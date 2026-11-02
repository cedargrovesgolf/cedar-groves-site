import path from 'node:path'
import { defineConfig } from 'vite'

const client = path.join(import.meta.dirname, 'app/client')

export default defineConfig({
  root: client,
  base: '/build/',
  publicDir: false,
  input: ['main', 'home', 'cms'].flatMap(name =>
    [`${name}.css`, `${name}.js`].map(file => path.join(client, file))),
  server: {
    port: 5173,
    strictPort: true,
    origin: 'http://localhost:5173'
  },
  build: {
    outDir: path.join(import.meta.dirname, 'app/public/build'),
    emptyOutDir: true,
    manifest: true,
    sourcemap: true,
    modulePreload: { polyfill: false }
  }
})
