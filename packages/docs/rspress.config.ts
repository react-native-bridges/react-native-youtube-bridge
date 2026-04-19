import * as path from 'node:path';

import { defineConfig } from '@rspress/core';
import { transformerNotationDiff, transformerNotationHighlight } from '@shikijs/transformers';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  lang: 'en',
  title: 'React Native Youtube Bridge',
  logoText: 'React Native Youtube Bridge',
  llms: true,
  multiVersion: {
    default: '2.x',
    versions: ['1.x', '2.x'],
  },
  search: {
    versioned: true,
  },
  ssg: true,
  markdown: {
    showLineNumbers: true,
    defaultWrapCode: false,
    shiki: {
      transformers: [transformerNotationDiff(), transformerNotationHighlight()],
    },
  },
  themeConfig: {
    lastUpdated: true,
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/react-native-bridges/react-native-youtube-bridge',
      },
      {
        icon: 'npm',
        mode: 'link',
        content: 'https://www.npmjs.com/package/react-native-youtube-bridge',
      },
    ],
    locales: [
      {
        lang: 'en',
        label: 'English',
      },
      {
        lang: 'ko',
        label: '한국어',
      },
    ],
    editLink: {
      docRepoBaseUrl:
        'https://github.com/react-native-bridges/react-native-youtube-bridge/tree/main/packages/docs/docs',
    },
  },
});
