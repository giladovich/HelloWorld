import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES === 'true' ? '/HelloWorld/' : '/',
  server: { port: 5173 },
  preview: { port: 4173 },
});
