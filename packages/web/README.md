# React Native Youtube Bridge Web

> English | [한국어](./README-ko_kr.md)

A YouTube player library for external WebView implementation, designed to work seamlessly with [`react-native-youtube-bridge`](https://github.com/react-native-bridges/react-native-youtube-bridge) in React Native environments.

## Overview

This library is useful when you want to implement external WebView functionality through custom web pages for playing YouTube videos in React Native applications.

## Use Cases

In React Native environments, you can use YouTube iframe in WebView through two different approaches:

```tsx
function App() {
  return (
    <>
      {/* Method 1: Using inline HTML (default) */}
      <YoutubePlayer source={source} useInlineHtml />

      {/* Method 2: Using external WebView page */}
      <YoutubePlayer
        source={source}
        useInlineHtml={false}
        // Default: https://react-native-youtube-bridge.pages.dev
        webViewUrl="https://your-custom-player.com"
      />
    </>
  );
}
```

Currently, the default static site (https://react-native-youtube-bridge.pages.dev) is being used as the external WebView URL.

If you want to use your own custom player page, simply pass the URL to the `webViewUrl` property. You can easily build a React-based custom player page using `@react-native-youtube-bridge/web`.

## Installation

```bash
# npm
npm install @react-native-youtube-bridge/web

# pnpm
pnpm add @react-native-youtube-bridge/web

# yarn
yarn add @react-native-youtube-bridge/web

# bun
bun add @react-native-youtube-bridge/web
```

## Usage

```tsx
import { YoutubePlayer } from '@react-native-youtube-bridge/web';

function CustomPlayerPage() {
  return <YoutubePlayer />;
}

export default CustomPlayerPage;
```

## Contributing

Please refer to the [Contributing Guide](./CONTRIBUTING.md) for detailed information about how to contribute to this project and our development workflow.

## License

[MIT](./LICENSE)
