import { getStore } from '@netlify/blobs';
import { handleApi } from '../../server/api.js';

const toArrayBuffer = (bytes) => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);

function blobStore(s) {
  return {
    getJSON: (key) => s.get(key, { type: 'json' }),
    setJSON: (key, value) => s.setJSON(key, value),
    del: (key) => s.delete(key),
    async getBin(key) {
      const res = await s.getWithMetadata(key, { type: 'arrayBuffer' });
      return res ? { data: new Uint8Array(res.data), type: res.metadata?.type } : null;
    },
    setBin: (key, bytes, type) => s.set(key, toArrayBuffer(bytes), { metadata: { type } }),
  };
}

export default async (req) => {
  const store = blobStore(getStore({ name: 'portfolio', consistency: 'strong' }));
  return handleApi(req, store, { ADMIN_PASSWORD: process.env.ADMIN_PASSWORD });
};

export const config = { path: '/api/*' };
