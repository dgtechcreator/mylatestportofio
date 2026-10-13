import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import devApi from './server/devApi.js';

export default defineConfig({
  plugins: [react(), devApi()],
  build: { sourcemap: false },
});
