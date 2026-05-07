import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/components/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom'],
  treeshake: true,
  sourcemap: true,
  minify: true
})
