import { defineConfig, type ExportsOptions } from 'tsdown';

const exportsConfig: ExportsOptions = {
  customExports(exports) {
    exports['.'] = {
      types: './dist/index.d.mts',
      ...exports['.'],
      default: './dist/index.mjs',
    };

    return exports;
  },
};

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    outDir: 'dist',
    dts: true,
    exports: exportsConfig,
  },
]);
