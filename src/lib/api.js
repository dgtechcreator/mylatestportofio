const HEADERS = { 'x-requested-with': 'vp-admin' };

async function request(path, { method = 'GET', body, raw, type } = {}) {
  const headers = { ...HEADERS };
  let payload;
  if (raw) {
    payload = raw;
    headers['content-type'] = type;
  } else if (body !== undefined) {
    payload = JSON.stringify(body);
    headers['content-type'] = 'application/json';
  }
  const res = await fetch(`/api/${path}`, { method, headers, body: payload, credentials: 'same-origin' });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  content: () => request('content'),
  me: () => request('me'),
  login: (password) => request('login', { method: 'POST', body: { password } }),
  logout: () => request('logout', { method: 'POST' }),
  saveContent: (content) => request('content', { method: 'PUT', body: { content } }),
  changePassword: (current, next) => request('password', { method: 'POST', body: { current, next } }),
  upload: (blob) => request('upload', { method: 'POST', raw: blob, type: blob.type }),
};
