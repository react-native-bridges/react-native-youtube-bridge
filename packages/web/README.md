# React Native Youtube Bridge Web

> English | [한국어](./README-ko_kr.md)

> [!note]
> Full documentation is available at <https://react-native-youtube-bridge-docs.pages.dev>.

A YouTube player package for hosting an external WebView player page that works with [`react-native-youtube-bridge`](https://github.com/react-native-bridges/react-native-youtube-bridge).

## Overview

Use this package only when you want to host your own external player page and pass that page to the main library through `YoutubeView`'s `webViewUrl` prop.

The main React Native app still uses `react-native-youtube-bridge`:

```tsx
import { YoutubeView, useYouTubePlayer } from 'react-native-youtube-bridge';

function App() {
  const player = useYouTubePlayer('AbZH7XWDW_k');

  return <YoutubeView player={player} useInlineHtml={false} webViewUrl="https://your-custom-player.com" />;
}
```

The hosted page uses `@react-native-youtube-bridge/web`:

```tsx
import { YoutubePlayer } from '@react-native-youtube-bridge/web';

function CustomPlayerPage() {
  return <YoutubePlayer />;
}

export default CustomPlayerPage;
```

## Query-string contract

When `YoutubeView` loads your hosted page, it appends the player configuration to the URL query string. The stock `YoutubePlayer` component reads these values automatically:

- `videoId`
- `startTime`
- `endTime`
- `origin`
- `autoplay`
- `controls`
- `loop`
- `muted`
- `playsinline`
- `rel`

## Installation

```bash
npm install @react-native-youtube-bridge/web
```

## When this is worth it

- custom hosting requirements
- origin-specific iframe needs
- apps that need to avoid inline HTML mode for compatibility reasons

## Contributing

Please refer to the [Contributing Guide](./CONTRIBUTING.md) for detailed information about how to contribute to this project and our development workflow.

## License

[MIT](./LICENSE)
