import { defineConfig } from 'vite';

export default defineConfig({
  envPrefix: 'REACT_APP_',
  build: { outDir: 'build' },
  server: { port: Number(process.env.PORT || 3000) }
});
