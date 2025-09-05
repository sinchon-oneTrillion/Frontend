import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,

    '/api': {
      target: 'https://saechi.shop',
      changeOrigin: true,
      secure: false,
    },
  },
});
