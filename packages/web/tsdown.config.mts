import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: { emitDtsOnly: true },
  outExtensions: () => ({ dts: '.d.ts' }),
  clean: false,
  exports: false,
});
