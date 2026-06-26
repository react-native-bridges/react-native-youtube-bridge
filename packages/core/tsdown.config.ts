import { defineConfig, type ExportsOptions } from 'tsdown';

const exportsConfig: ExportsOptions = {
  customExports(exports) {
    exports['.'] = {
      import: {
        types: './dist/index.d.mts',
        default: './dist/index.mjs',
      },
      require: {
        types: './dist/index.d.cts',
        default: './dist/index.cjs',
      },
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
