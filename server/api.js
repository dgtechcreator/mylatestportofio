/**
 * Tiny admin API shared by the Netlify Function (production) and the Vite dev server (local).
 *
 * - The password is NEVER sent to or stored in the browser. Only a salted scrypt hash lives
 *   in the server-side store; the first password comes from the ADMIN_PASSWORD env var.
 * - A successful login sets an HttpOnly, SameSite=Strict, HMAC-signed cookie (JavaScript on the
 *   page — including DevTools — cannot read it).
 * - Every write needs that cookie + a custom header + a same-origin check (CSRF protection).
 * - Failed logins are rate limited per IP.
 *
 * `store` must provide: getJSON(key), setJSON(key, value), del(key), getBin(key), setBin(key, bytes, type).
 */
import { createHash, createHmac, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

const COOKIE = 'vp_session';
const SESSION_SECONDS = 8 * 60 * 60;
const MAX_CONTENT_BYTES = 300_000;
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const MAX_FAILS = 5;
const LOCK_MS = 15 * 60 * 1000;
const MIN_PASSWORD = 10;
const CONTENT_KEYS = ['profile', 'nav', 'hero', 'marquee', 'about', 'skills', 'projects', 'experience', 'contact', 'footer'];

const BASE_HEADERS = { 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' };

const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...BASE_HEADERS, ...headers },
  });

const fail = (status, error, extra = {}) => json({ error, ...extra }, status);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const sha256 = (s) => createHash('sha256').update(s).digest('hex');

function safeEqual(a, b) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/* ---------- auth record (hash, signing secret, session version) ---------- */

async function getAuth(store) {
  let auth = await store.getJSON('auth');
  if (!auth) {
    auth = { secret: randomBytes(32).toString('base64'), v: 1 };
    await store.setJSON('auth', auth);
  }
  return auth;
}

async function passwordMatches(auth, env, password) {
  if (typeof password !== 'string' || !password || password.length > 200) return false;
  if (auth.hash) {
    const derived = await scryptAsync(password, Buffer.from(auth.salt, 'base64'), 64);
    return safeEqual(derived.toString('base64'), auth.hash);
  }
  if (env.ADMIN_PASSWORD) {
    // Compare digests so length differences don't leak through timing.
    return safeEqual(sha256(password), sha256(env.ADMIN_PASSWORD));
  }
  return false;
}

async function hashPassword(password) {
  const salt = randomBytes(16);
  const derived = await scryptAsync(password, salt, 64);
  return { salt: salt.toString('base64'), hash: derived.toString('base64') };
}

/* ---------- session cookie ---------- */

function signSession(auth) {
  const body = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS, v: auth.v })).toString('base64url');
  const sig = createHmac('sha256', Buffer.from(auth.secret, 'base64')).update(body).digest('base64url');
  return `${body}.${sig}`;
}

function readCookie(req, name) {
  const header = req.headers.get('cookie') || '';
  for (const part of header.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (k === name) return rest.join('=');
  }
  return null;
}

function isAdmin(req, auth) {
  const token = readCookie(req, COOKIE);
  if (!token) return false;
  const [body, sig] = token.split('.');
  if (!body || !sig) return false;
  const expected = createHmac('sha256', Buffer.from(auth.secret, 'base64')).update(body).digest('base64url');
  if (!safeEqual(sig, expected)) return false;
  try {
    const { exp, v } = JSON.parse(Buffer.from(body, 'base64url').toString());
    return exp > Date.now() / 1000 && v === auth.v;
  } catch {
    return false;
  }
}

const sessionCookie = (token, url, maxAge) =>
  `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${url.protocol === 'https:' ? '; Secure' : ''}`;

/* ---------- login rate limit ---------- */

function clientKey(req) {
  const ip =
    req.headers.get('x-nf-client-connection-ip') ||
    (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
    'unknown';
  return `rl-${sha256(ip).slice(0, 32)}`;
}

async function lockedFor(store, key) {
  const rec = await store.getJSON(key);
  return rec?.until && rec.until > Date.now() ? Math.ceil((rec.until - Date.now()) / 1000) : 0;
}

async function recordFailure(store, key) {
  const now = Date.now();
  let rec = await store.getJSON(key);
  if (!rec || now - (rec.first || 0) > LOCK_MS) rec = { count: 0, first: now };
  rec.count += 1;
  if (rec.count >= MAX_FAILS) rec = { count: 0, first: now, until: now + LOCK_MS };
  await store.setJSON(key, rec);
}

/** Shared by login + change-password: rate limit, check, delay on failure. Returns an error Response or null. */
async function checkPassword(req, store, auth, env, password) {
  const key = clientKey(req);
  const wait = await lockedFor(store, key);
  if (wait) return fail(429, 'Too many wrong attempts. Try again later.', { retryAfter: wait });
  if (await passwordMatches(auth, env, password)) {
    await store.del(key);
    return null;
  }
  await recordFailure(store, key);
  await sleep(500);
  return fail(401, 'Wrong password.');
}

/* ---------- validation ---------- */

function sniffImage(bytes) {
  const b = bytes;
  if (b.length > 12 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'image/png';
  if (b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
  if (b.length > 12 && b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP') return 'image/webp';
  return null;
}

const isPlainObject = (v) => v && typeof v === 'object' && !Array.isArray(v);

/* ---------- handler ---------- */

export async function handleApi(req, store, env = {}) {
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/(\.netlify\/functions\/)?api\/?/, '').replace(/\/+$/, '');
  const method = req.method;

  try {
    // ----- public reads -----
    if (method === 'GET' && path === 'content') {
      const saved = await store.getJSON('content');
      return json({ content: saved?.content ?? null }, 200, { 'cache-control': 'no-cache' });
    }

    if (method === 'GET' && path.startsWith('img/')) {
      const id = path.slice(4);
      if (!/^[a-f0-9]{24}$/.test(id)) return fail(404, 'Not found');
      const bin = await store.getBin(`img-${id}`);
      if (!bin) return fail(404, 'Not found');
      return new Response(bin.data, {
        headers: {
          'content-type': bin.type || 'application/octet-stream',
          'cache-control': 'public, max-age=31536000, immutable',
          'x-content-type-options': 'nosniff',
          'content-security-policy': "default-src 'none'",
        },
      });
    }

    const auth = await getAuth(store);

    if (method === 'GET' && path === 'me') return json({ admin: isAdmin(req, auth) });

    if (method !== 'POST' && method !== 'PUT') return fail(404, 'Not found');

    // ----- everything below changes state: CSRF checks -----
    if (req.headers.get('x-requested-with') !== 'vp-admin') return fail(403, 'Forbidden');
    const origin = req.headers.get('origin');
    if (origin && origin !== url.origin) return fail(403, 'Forbidden');

    if (method === 'POST' && path === 'login') {
      const body = await req.json().catch(() => ({}));
      if (!auth.hash && !env.ADMIN_PASSWORD) {
        return fail(500, 'Admin password is not set up yet. Add ADMIN_PASSWORD in the hosting environment variables.');
      }
      const denied = await checkPassword(req, store, auth, env, body.password);
      if (denied) return denied;
      return json({ ok: true }, 200, { 'set-cookie': sessionCookie(signSession(auth), url, SESSION_SECONDS) });
    }

    if (method === 'POST' && path === 'logout') {
      return json({ ok: true }, 200, { 'set-cookie': sessionCookie('', url, 0) });
    }

    // ----- admin only -----
    if (!isAdmin(req, auth)) return fail(401, 'Please log in again.');

    if (method === 'PUT' && path === 'content') {
      const raw = await req.text();
      if (raw.length > MAX_CONTENT_BYTES) return fail(413, 'Content is too large.');
      let content;
      try {
        content = JSON.parse(raw).content;
      } catch {
        return fail(400, 'Invalid JSON.');
      }
      if (!isPlainObject(content) || Object.keys(content).some((k) => !CONTENT_KEYS.includes(k))) {
        return fail(400, 'Invalid content.');
      }
      await store.setJSON('content', { content, updatedAt: new Date().toISOString() });
      return json({ ok: true });
    }

    if (method === 'POST' && path === 'upload') {
      const bytes = Buffer.from(await req.arrayBuffer());
      if (!bytes.length) return fail(400, 'Empty file.');
      if (bytes.length > MAX_IMAGE_BYTES) return fail(413, 'Image is too large (max 4 MB).');
      const type = sniffImage(bytes);
      if (!type) return fail(415, 'Only PNG, JPEG or WebP images are allowed.');
      const id = randomBytes(12).toString('hex');
      await store.setBin(`img-${id}`, bytes, type);
      return json({ url: `/api/img/${id}` });
    }

    if (method === 'POST' && path === 'password') {
      const body = await req.json().catch(() => ({}));
      const next = body.next;
      if (typeof next !== 'string' || next.length < MIN_PASSWORD || next.length > 200) {
        return fail(400, `New password must be at least ${MIN_PASSWORD} characters.`);
      }
      if (next === body.current) return fail(400, 'New password must be different.');
      const denied = await checkPassword(req, store, auth, env, body.current);
      if (denied) return denied;
      const updated = { ...auth, ...(await hashPassword(next)), v: auth.v + 1, updatedAt: new Date().toISOString() };
      await store.setJSON('auth', updated);
      // Bumping `v` signs every other device out; keep this one logged in.
      return json({ ok: true }, 200, { 'set-cookie': sessionCookie(signSession(updated), url, SESSION_SECONDS) });
    }

    return fail(404, 'Not found');
  } catch (err) {
    console.error('api error', err);
    return fail(500, 'Server error.');
  }
}
