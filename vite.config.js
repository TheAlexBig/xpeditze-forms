import { defineConfig, transformWithOxc } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    {
      name: 'xpeditze-jsx',
      enforce: 'pre',
      async transform(code, id) {
        if (!/\/src\/.*\.js$/.test(id)) {
          return null;
        }
        return transformWithOxc(code, id, { lang: 'jsx' });
      },
    },
    react(),
  ],
  optimizeDeps: {
    rolldownOptions: {
      moduleTypes: {
        '.js': 'jsx',
      },
    },
  },
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8080',
    },
  },
});
