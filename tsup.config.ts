import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/firebase-functions.ts'],
  format: ['cjs'],
  splitting: false,
  sourcemap: false,
  // clean: true,
  minify: true,
  treeshake: true,
  outDir: 'lib',
});
