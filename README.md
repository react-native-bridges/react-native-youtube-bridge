# React Native Youtube Bridge

> English | [한국어](./README-ko_kr.md)

> [!note]
> **V1 users:** [V1 Documentation](/packages/react-native-youtube-bridge/docs/v1.md) | [V2 Migration Guide](/packages/react-native-youtube-bridge/docs/migration-v2.md)

## Overview
Using a YouTube player in React Native requires complex setup and configuration.   
However, there are currently no actively maintained YouTube player libraries for React Native. (The most popular react-native-youtube-iframe's [latest release was July 2, 2023](https://github.com/LonelyCpp/react-native-youtube-iframe/releases/tag/v2.3.0))   

`react-native-youtube-bridge` is a library that makes it easy to use the [YouTube iframe Player API](https://developers.google.com/youtube/iframe_api_reference) in React Native applications.   

- ✅ TypeScript support
- ✅ iOS, Android, and Web platform support
- ✅ New Architecture support
- ✅ Works without YouTube native player modules
- ✅ Support for various [YouTube iframe Player API](https://developers.google.com/youtube/iframe_api_reference) features
- ✅ Multiple instance support - manage multiple players independently
- ✅ Intuitive and easy-to-use Hook-based API very similar to Expo's approach
- ✅ Expo support
- ✅ Flexible rendering modes (inline HTML & webview)

## Examples

> If you want to get started quickly, check out the [example](/example/).

- [Web Demo](https://react-native-youtube-bridge-example.pages.dev/)
- [Expo Go](https://snack.expo.dev/@harang/react-native-youtube-bridge)

<p align="center">
  <img src="./assets/example.gif" width="600" />
</p>

## Installation

```bash
npm install react-native-youtube-bridge

pnpm add react-native-youtube-bridge

yarn add react-native-youtube-bridge

bun add react-native-youtube-bridge
```

## Usage

```tsx
import { YoutubeView, useYouTubePlayer } from 'react-native-youtube-bridge';

function App() {
  const videoIdOrUrl = 'AbZH7XWDW_k'

  // OR useYouTubePlayer({ videoId: 'AbZH7XWDW_k' })
  // OR useYouTubePlayer({ url: 'https://youtube.com/watch?v=AbZH7XWDW_k' })
  const player = useYouTubePlayer(videoIdOrUrl);

  return (
    <YoutubeView player={player} />
  );
}
```

### Events

[Events](https://developers.google.com/youtube/iframe_api_reference#Events) are fired to communicate YouTube iframe API state changes to your application.   

The `useYouTubeEvent` hook provides complete type inference and allows you to easily detect and use events in two ways.

```tsx
import { YoutubeView, useYouTubeEvent, useYouTubePlayer } from 'react-native-youtube-bridge';

function App() {
  const player = useYouTubePlayer(videoIdOrUrl);

  const playbackRate = useYouTubeEvent(player, 'playbackRateChange', 1);
  const progress = useYouTubeEvent(player, 'progress', progressInterval);

  useYouTubeEvent(player, 'ready', (playerInfo) => {
    console.log('Player is ready!');
    Alert.alert('Alert', 'YouTube player is ready!');
  });

  useYouTubeEvent(player, 'autoplayBlocked', () => {
    console.log('Autoplay was blocked');
  });

  useYouTubeEvent(player, 'error', (error) => {
    console.error('Player error:', error);
    Alert.alert('Error', `Player error (${error.code}): ${error.message}`);
  });

  return (
    <YoutubeView player={player} />
  );
}
```

The `useYouTubeEvent` hook provides two ways to receive values: callback-based and state-based.

1. **Callback method**: If re-rendering is needed based on dependencies, inject a dependency array as the 4th argument.
2. **State method**:
   1. For `progress` events, you can set an interval value as the 3rd argument. (default: 1000ms)
   2. For other events, you can set a default value as the 3rd argument.

### Features

You can control various player features like muting, playing, and volume adjustment by calling methods on the player instance returned from `useYouTubePlayer`, which uses the YouTube iframe API [functions](https://developers.google.com/youtube/iframe_api_reference#Functions).   

```tsx
import { YoutubeView, useYouTubePlayer } from 'react-native-youtube-bridge';

function App() {
  const player = useYouTubePlayer(videoIdOrUrl);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const onPlay = useCallback(() => {
    if (isPlaying) {
      player.pause();
      return;
    }

    player.play();
  }, [isPlaying]);

  const seekTo = (time: number, allowSeekAhead: boolean) => {
    player.seekTo(time, allowSeekAhead);
  };

  const stop = () => player.stop();

  return (
    <View>
      <YoutubeView player={player} />

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, styles.seekButton]}
          onPress={() => seekTo(currentTime > 10 ? currentTime - 10 : 0)}
        >
          <Text style={styles.buttonText}>⏪ -10s</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.playButton]} onPress={onPlay}>
          <Text style={styles.buttonText}>{isPlaying ? '⏸️ Pause' : '▶️ Play'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={stop}>
          <Text style={styles.buttonText}>⏹️ Stop</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.seekButton]}
          onPress={() => seekTo(currentTime + 10, true)}
        >
          <Text style={styles.buttonText}>⏭️ +10s</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
```

### Initial Player Parameters

You can customize the initial playback environment by setting YouTube embedded player [parameters](https://developers.google.com/youtube/player_parameters#Parameters).

```tsx
import { YoutubeView, useYouTubePlayer } from 'react-native-youtube-bridge';

function App() {
  const player = useYouTubePlayer(videoIdOrUrl, {
    autoplay: true,
    controls: true,
    playsinline: true,
    rel: false,
    muted: true,
  });

  return (
    <YoutubeView player={player} />
  );
}
```

### Styling

You can customize the YouTube player's style as desired.

```tsx
function App() {
  return (
    <YoutubeView
      player={player}
      height={400}
      width={200}
      style={{
        borderRadius: 10,
      }}
      // Web platform support
      iframeStyle={{
        aspectRatio: 16 / 9,
      }}
      // iOS, Android platform support
      webViewStyle={{
        // ...
      }}
      // iOS, Android platform support
      webViewProps={{
        // ...
      }}
    />
  )
}
```

### Tracking Playback Progress

- You can track playback progress by registering a listener for the `progress` event using the `useYouTubeEvent` hook.
- Set an interval value as the 3rd argument to have the event called at that interval (ms).
- If you don't want an interval, set it to `0`.
- The default value is 1000ms.

```tsx
function App() {
  const progressInterval = 1000;

  const player = useYouTubePlayer(videoIdOrUrl);
  const progress = useYouTubeEvent(player, 'progress', progressInterval);

  return (
    <YoutubeView player={player} />
  )
}
```

### Player Rendering and Source Configuration (iOS, Android)

**Inline HTML vs WebView Mode**   
Control the YouTube player rendering method and set source URLs for compatibility.

1. **Inline HTML mode** (`useInlineHtml: true`) renders the player by loading HTML directly within the app. (default)
2. **WebView mode** (`useInlineHtml: false`) loads an external player page. 
   - The default URI is https://react-native-youtube-bridge.pages.dev.
   - To use your own custom player page as an external WebView, build your player with `@react-native-youtube-bridge/web` and set the URL in the `webViewUrl` property. For detailed implementation instructions, please refer to the [Web Player Guide](https://github.com/react-native-bridges/react-native-youtube-bridge/tree/main/packages/web).

> [!NOTE]
> **webViewUrl Usage**
> - When `useInlineHtml: true`: Set as the HTML `baseUrl` of the WebView source.
> - When `useInlineHtml: false`: Overrides the WebView source's `uri`.
>
> **Resolving Embed Restrictions**: If you encounter `embed not allowed` errors from the YouTube iframe when using inline HTML and the video doesn't load properly, switch to WebView mode to load the YouTube iframe through an external player.

```tsx
// Inline HTML (default)
<YoutubeView
  player={player}
  useInlineHtml
/>

// External WebView using custom player page
<YoutubeView
  player={player}
  useInlineHtml={false}
  // default: https://react-native-youtube-bridge.pages.dev
  webViewUrl="https://your-custom-player.com"
/>
```

**Custom Player Page**

To use a custom player page you've created, you can build a React-based player page using `@react-native-youtube-bridge/web`.

```tsx
import { YoutubePlayer } from '@react-native-youtube-bridge/web';

function CustomPlayerPage() {
  return <YoutubePlayer />;
}

export default CustomPlayerPage;
```

> For more details, please refer to the [Web Player Guide](./packages/web/).

### YouTube oEmbed API

You can fetch YouTube video metadata through the `useYoutubeOEmbed` hook.   
This hook only supports YouTube URLs.

```tsx
import { useYoutubeOEmbed } from 'react-native-youtube-bridge';

function App() {
  const { oEmbed, isLoading, error } = useYoutubeOEmbed('https://www.youtube.com/watch?v=AbZH7XWDW_k');

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;
  if (!oEmbed) return null;

  return (
    <>
      <Text>{oEmbed.title}</Text>
      <Image 
        source={{ uri: oEmbed?.thumbnail_url }} 
        style={{ width: oEmbed?.thumbnail_width, height: oEmbed?.thumbnail_height }} 
      />
    </>
  )
}
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

[MIT](./LICENSE)
