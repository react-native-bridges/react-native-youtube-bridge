# React Native Youtube Bridge

> English | [한국어](./README-ko_kr.md)

<div align="center">
  <img src="./assets/logo.png" width="300px" alt="React Native Youtube Bridge logo" />
</div>


## Overview

Using a YouTube player in React Native usually means wiring the YouTube IFrame API, WebView behavior, events, and platform differences yourself.

`react-native-youtube-bridge` provides a typed, hook-based YouTube player for React Native apps across iOS, Android, and Web.

<p align="center">
  <img src="./assets/example.gif" width="600" alt="Demo of react-native-youtube-bridge" />
</p>

### Key Features

- 🎥 **YouTube IFrame Player API** - Uses YouTube's iframe player instead of native YouTube modules
- 🪝 **Hook-Based API** - Create a player with `useYouTubePlayer` and render it with `YoutubeView`
- 🔔 **Typed Events** - Subscribe to ready, state, progress, mute, and error updates with `useYouTubeEvent`
- 🌐 **Cross-Platform** - Supports iOS, Android, and React Native Web
- 🧩 **Flexible Rendering Modes** - Use inline HTML by default or an external WebView player page when needed
- 🧠 **TypeScript Support** - Typed player methods, events, source inputs, and view props
- 🚀 **Expo Friendly** - Works well in Expo and modern React Native projects

## Quick Start

### 📚 Documentation

Full documentation is available at: <https://react-native-youtube-bridge-docs.pages.dev>

- [Getting Started](https://react-native-youtube-bridge-docs.pages.dev/guide/getting-started/overview.html)
- [API Reference](https://react-native-youtube-bridge-docs.pages.dev/guide/usage/api-reference.html)
- [1.x Documentation](https://react-native-youtube-bridge-docs.pages.dev/1.x/)
- [Migration from 1.x](https://react-native-youtube-bridge-docs.pages.dev/guide/migration-from-1.x.html)

### Examples & Demo

- [📁 Example Project](/example/) - Example React Native app
- [🌐 Web Demo](https://react-native-youtube-bridge-example.pages.dev/) - Hosted demo
- [🤖 Expo Snack](https://snack.expo.dev/@harang/react-native-youtube-bridge) - Try it instantly on Expo Snack

### 🤖 AI

- [llms.txt](https://react-native-youtube-bridge-docs.pages.dev/llms.txt): A structured index file containing documentation pages and descriptions.
- [llms-full.txt](https://react-native-youtube-bridge-docs.pages.dev/llms-full.txt): A full-content file that concatenates the complete documentation into a single file.

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

For events, player controls, rendering modes, WebView customization, and migration details, see the [full documentation](https://react-native-youtube-bridge-docs.pages.dev).

## Contributing

For details on how to contribute to the project and set up the development environment, please refer to the [Contributing Guide](CONTRIBUTING.md).

## License

[MIT](./LICENSE)
