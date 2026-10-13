/** Vite plugin: serves the same /api handler locally, storing data as files in ./.data (git-ignored). */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { loadEnv } from 'vite';
import { handleApi } from './api.js';

function fileStore(dir) {
  const file = (key, ext) => path.join(dir, `${key.replace(/[^a-z0-9_-]/gi, '_')}.${ext}`);
  const read = (p) => readFile(p).catch(() => null);
  return {
    async getJSON(key) {
      const buf = await read(file(key, 'json'));
      return buf ? JSON.parse(buf.toString()) : null;
    },
    async setJSON(key, value) {
      await mkdir(dir, { recursive: true });
      await writeFile(file(key, 'json'), JSON.stringify(value));
    },
    del: (key) => rm(file(key, 'json'), { force: true }),
    async getBin(key) {
      const [data, meta] = await Promise.all([read(file(key, 'bin')), read(file(key, 'type'))]);
      return data ? { data, type: meta?.toString() } : null;
    },
    async setBin(key, bytes, type) {
      await mkdir(dir, { recursive: true });
      await Promise.all([writeFile(file(key, 'bin'), bytes), writeFile(file(key, 'type'), type)]);
    },
  };
}

export default function devApi() {
  return {
    name: 'portfolio-dev-api',
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), '');
      const store = fileStore(path.resolve('.data'));

      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) return next();
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        const headers = new Headers();
        for (const [k, v] of Object.entries(req.headers)) if (typeof v === 'string') headers.set(k, v);
        const hasBody = !['GET', 'HEAD'].includes(req.method);
        const request = new Request(`http://${req.headers.host}${req.url}`, {
          method: req.method,
          headers,
          body: hasBody ? Buffer.concat(chunks) : undefined,
        });
        const response = await handleApi(request, store, { ADMIN_PASSWORD: env.ADMIN_PASSWORD });
        res.statusCode = response.status;
        response.headers.forEach((value, key) => {
          if (key !== 'set-cookie') res.setHeader(key, value);
        });
        const cookies = response.headers.getSetCookie();
        if (cookies.length) res.setHeader('set-cookie', cookies);
        res.end(Buffer.from(await response.arrayBuffer()));
      });
    },
  };
}
