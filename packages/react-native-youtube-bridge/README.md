# React Native Youtube Bridge

> English | [한국어](./README-ko_kr.md)

<div align="center">
  <img src="https://raw.githubusercontent.com/react-native-bridges/react-native-youtube-bridge/main/assets/logo.png" width="300px" alt="React Native Youtube Bridge logo" />
</div>


## Overview

`react-native-youtube-bridge` provides a typed, hook-based YouTube player for React Native apps across iOS, Android, and Web.

<p align="center">
  <img src="https://raw.githubusercontent.com/react-native-bridges/react-native-youtube-bridge/main/assets/example.gif" width="600" alt="Demo of react-native-youtube-bridge" />
</p>

### Key Features

- 🎥 YouTube IFrame Player API without native YouTube modules
- 🪝 `useYouTubePlayer` + `YoutubeView` hook-based API
- 🔔 Typed events with `useYouTubeEvent`
- 🌐 iOS, Android, and React Native Web support
- 🧩 Inline HTML and external WebView rendering modes
- 🧠 TypeScript support

## Quick Start

### 📚 Documentation

Full documentation is available at: <https://react-native-youtube-bridge-docs.pages.dev>

- [Getting Started](https://react-native-youtube-bridge-docs.pages.dev/guide/getting-started/overview.html)
- [API Reference](https://react-native-youtube-bridge-docs.pages.dev/guide/usage/api-reference.html)
- [1.x Documentation](https://react-native-youtube-bridge-docs.pages.dev/1.x/)
- [Migration from 1.x](https://react-native-youtube-bridge-docs.pages.dev/guide/migration-from-1.x.html)

### Examples & Demo

- [📁 Example Project](https://github.com/react-native-bridges/react-native-youtube-bridge/tree/main/example)
- [🌐 Web Demo](https://react-native-youtube-bridge-example.pages.dev/)
- [🤖 Expo Snack](https://snack.expo.dev/@harang/react-native-youtube-bridge)

### 🤖 AI

- [llms.txt](https://react-native-youtube-bridge-docs.pages.dev/llms.txt)
- [llms-full.txt](https://react-native-youtube-bridge-docs.pages.dev/llms-full.txt)

### Installation

```bash
npm install react-native-youtube-bridge
```

### Basic Usage

```tsx
import { YoutubeView, useYouTubePlayer } from 'react-native-youtube-bridge';

function App() {
  const player = useYouTubePlayer('AbZH7XWDW_k');

  return <YoutubeView player={player} />;
}
```

For the complete guide, see the [documentation](https://react-native-youtube-bridge-docs.pages.dev).

## License

[MIT](./LICENSE)
