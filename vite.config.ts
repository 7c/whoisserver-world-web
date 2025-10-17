import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    {
      name: 'request-logger',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const start = Date.now();
          const method = req.method ?? 'GET';
          const url = req.url ?? '';
          res.on('finish', () => {
            const duration = Date.now() - start;
            console.log(`[dev] ${method} ${url} -> ${res.statusCode} (${duration}ms)`);
          });
          next();
        });
      }
    }
  ],
  appType: 'mpa',
  server: {
    open: '/demo/index.html'
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'WhoisserverWorldWeb',
      formats: ['es', 'cjs'],
      fileName: (format) => `whoisserver-world-web.${format === 'es' ? 'mjs' : 'cjs'}`
    },
    rollupOptions: {
      // No external dependencies; JSON data is bundled statically.
      // If you wrap third-party libs, add them here to keep bundles small.
      external: []
    }
  }
});
