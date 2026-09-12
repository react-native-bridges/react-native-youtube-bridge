import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const temporary = mkdtempSync(path.join(tmpdir(), 'youtube-package-check-'));
const packages = ['core', 'react', 'web', 'react-native-youtube-bridge'];
const run = (command, args, cwd = temporary) =>
  execFileSync(command, args, { cwd, stdio: 'pipe', encoding: 'utf8' });

try {
  for (const directory of packages) {
    const source = path.join(root, 'packages', directory);
    const manifest = JSON.parse(readFileSync(path.join(source, 'package.json'), 'utf8'));
    const archiveDirectory = path.join(temporary, 'archives', directory);
    mkdirSync(archiveDirectory, { recursive: true });
    run('pnpm', ['pack', '--pack-destination', archiveDirectory], source);
    const archive = `${manifest.name.replace('@', '').replaceAll('/', '-')}-${manifest.version}.tgz`;
    const destination = path.join(temporary, 'node_modules', manifest.name);
    mkdirSync(destination, { recursive: true });
    run('tar', [
      '-xzf',
      path.join(archiveDirectory, archive),
      '--strip-components=1',
      '-C',
      destination,
    ]);
    const packed = JSON.parse(readFileSync(path.join(destination, 'package.json'), 'utf8'));
    const checkEntry = (entry) => {
      if (typeof entry === 'string') {
        assert.ok(existsSync(path.join(destination, entry)), `${packed.name}: missing ${entry}`);
      } else {
        for (const value of Object.values(entry)) checkEntry(value);
      }
    };
    checkEntry(packed.exports['.']);
    for (const entry of [packed.main, packed.module, packed.types].filter(Boolean))
      checkEntry(entry);
    for (const version of Object.values(packed.dependencies ?? {})) {
      assert.ok(
        !version.startsWith('workspace:'),
        `${packed.name}: unpublished workspace protocol`,
      );
    }
    console.log(`Checked packed entries: ${packed.name}`);
  }

  // Supply consumer peers, while resolving every library through its actual packed files.
  const nativeRequire = createRequire(
    path.join(root, 'packages/react-native-youtube-bridge/package.json'),
  );
  for (const name of [
    'react',
    'react-native',
    'react-native-webview',
    '@types/react',
    '@types/node',
  ]) {
    const destination = path.join(temporary, 'node_modules', name);
    mkdirSync(path.dirname(destination), { recursive: true });
    symlinkSync(path.dirname(nativeRequire.resolve(`${name}/package.json`)), destination, 'dir');
  }
  writeFileSync(
    path.join(temporary, 'consumer.ts'),
    `
import { validateVideoId, type YoutubeSource } from '@react-native-youtube-bridge/core';
import { useYouTubeVideoId } from '@react-native-youtube-bridge/react';
import { YoutubePlayer } from '@react-native-youtube-bridge/web';
import { YoutubeView, useYouTubePlayer } from 'react-native-youtube-bridge';
const source: YoutubeSource = { videoId: 'AbZH7XWDW_k' };
void [source, validateVideoId, useYouTubeVideoId, YoutubePlayer, YoutubeView, useYouTubePlayer];
`,
  );
  writeFileSync(
    path.join(temporary, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        strict: true,
        noEmit: true,
        skipLibCheck: true,
        module: 'ESNext',
        moduleResolution: 'Bundler',
        target: 'ES2022',
        jsx: 'react-jsx',
        types: ['react'],
      },
      files: ['consumer.ts'],
    }),
  );
  const require = createRequire(path.join(root, 'package.json'));
  run(process.execPath, [require.resolve('typescript/bin/tsc'), '--project', 'tsconfig.json']);
  writeFileSync(
    path.join(temporary, 'web-consumer.ts'),
    `
import { YoutubePlayer } from '@react-native-youtube-bridge/web';
const Component: () => import('react').JSX.Element = YoutubePlayer;
void Component;
// @ts-expect-error The player component does not accept arbitrary arguments.
YoutubePlayer({ unexpected: true });
`,
  );
  const webConfig = JSON.parse(readFileSync(path.join(temporary, 'tsconfig.json'), 'utf8'));
  webConfig.compilerOptions.skipLibCheck = false;
  webConfig.compilerOptions.noUncheckedSideEffectImports = true;
  webConfig.files = ['web-consumer.ts'];
  writeFileSync(path.join(temporary, 'web-tsconfig.json'), JSON.stringify(webConfig));
  run(process.execPath, [require.resolve('typescript/bin/tsc'), '--project', 'web-tsconfig.json']);
  for (const mode of ['commonjs', 'module']) {
    const code =
      mode === 'commonjs'
        ? "const { validateVideoId } = require('@react-native-youtube-bridge/core'); const { useYouTubeVideoId } = require('@react-native-youtube-bridge/react');"
        : "import { validateVideoId } from '@react-native-youtube-bridge/core'; import { useYouTubeVideoId } from '@react-native-youtube-bridge/react';";
    run(process.execPath, [
      '--input-type=' + mode,
      '-e',
      code +
        "if (!validateVideoId('AbZH7XWDW_k') || typeof useYouTubeVideoId !== 'function') throw new Error('Invalid package exports');",
    ]);
  }
  console.log(
    'Packed consumer typechecks (including strict Web declarations) and ESM/CommonJS imports passed.',
  );
} catch (error) {
  if (error.stdout) console.error(error.stdout.toString());
  if (error.stderr) console.error(error.stderr.toString());
  throw error;
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
