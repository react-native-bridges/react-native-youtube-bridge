# React Native Youtube Bridge

> English | [한국어](./README-ko_kr.md)

## Overview
Using a YouTube player in React Native requires complex setup and configuration.   
However, there are currently no actively maintained YouTube player libraries for React Native. (The most popular react-native-youtube-iframe's [latest release was July 2, 2023](https://github.com/LonelyCpp/react-native-youtube-iframe/releases/tag/v2.3.0))   

`react-native-youtube-bridge` is a library that makes it easy to use the [YouTube iframe Player API](https://developers.google.com/youtube/iframe_api_reference) in React Native applications.   

- ✅ TypeScript support
- ✅ iOS, Android, and Web platform support
- ✅ New Architecture support
- ✅ Works without YouTube native player modules
- ✅ [YouTube iframe Player API](https://developers.google.com/youtube/iframe_api_reference) feature support
- ✅ Developer-friendly API
- ✅ Expo support
- ✅ Flexible rendering modes (Inline HTML & WebView)

## Example
> For a quick start, check out the [example](/example/).

- [Web Demo](https://react-native-youtube-bridge-example.pages.dev/)
- [Expo Go](https://snack.expo.dev/@harang/react-native-youtube-bridge)

<p align="center">
  <img src="../../assets/example.gif" width="600" />
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
import { YoutubePlayer } from 'react-native-youtube-bridge';

function App() {
  return (
    <YoutubePlayer 
      source={source} // youtube videoId or url
      // OR source={{ videoId: 'AbZH7XWDW_k' }}
      // OR source={{ url: 'https://youtube.com/watch?v=AbZH7XWDW_k' }}
    />
  )
}
```

### Events
The library fires [events](https://developers.google.com/youtube/iframe_api_reference#Events) to notify your application of YouTube iframe API state changes. You can subscribe to these events using callback functions.   

> 🔔 Note - Wrap callback functions with `useCallback` for performance optimization and to prevent abnormal behavior.

```tsx
function App() {
  const playerRef = useRef<PlayerControls>(null);

  const handleReady = useCallback(() => {
    console.log('Player is ready!');
  }, []);

  const handleStateChange = useCallback((state: PlayerState) => {
    console.log('Player state changed:', state);
  }, []);

  const handlePlaybackRateChange = useCallback((rate: number) => {
    console.log('Playback rate changed:', rate);
  }, []);

  const handlePlaybackQualityChange = useCallback((quality: string) => {
    console.log('Playback quality changed:', quality);
  }, []);

  const handleAutoplayBlocked = useCallback(() => {
    console.log('Autoplay was blocked');
  }, []);

  const handleError = useCallback((error: YouTubeError) => {
    console.error('Player error:', error);
  }, []);

  return (
    <YoutubePlayer
      onReady={handleReady}
      onStateChange={handleStateChange}
      onError={handleError}
      onPlaybackRateChange={handlePlaybackRateChange}
      onPlaybackQualityChange={handlePlaybackQualityChange}
      onAutoplayBlocked={handleAutoplayBlocked}
    />
  )
}
```

### Functions
You can control various player features like mute, play, volume, and more by calling YouTube iframe API [functions](https://developers.google.com/youtube/iframe_api_reference#Functions) through the `ref`.   

```tsx
function App() {
  const playerRef = useRef<PlayerControls>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const onPlay = useCallback(() => {
    if (isPlaying) {
      playerRef.current?.pause();
      return;
    }

    playerRef.current?.play();
  }, [isPlaying]);

  const seekTo = useCallback((time: number, allowSeekAhead: boolean) => {
    playerRef.current?.seekTo(time, allowSeekAhead);
  }, []);

  const stop = () => playerRef.current?.stop();

  return (
    <View>
      <YoutubePlayer
        ref={playerRef}
        source={source}
      />

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

### Player Parameters
You can customize the playback environment by configuring YouTube embedded player [parameters](https://developers.google.com/youtube/player_parameters#Parameters).

```tsx
function App() {
  return (
    <YoutubePlayer
      source={source}
      playerVars={{
        autoplay: true,
        controls: true,
        playsinline: true,
        rel: false,
        muted: true,
      }}
    />
  )
}
```

### Styles
You can customize the YouTube player's styling to match your application's design.

```tsx
function App() {
  return (
    <YoutubePlayer
      source={source}
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

### Playback Progress Tracking
- If `progressInterval` is provided, the `onProgress` callback will be invoked at the specified interval (in milliseconds).
- If `progressInterval` is `undefined`, `0`, or `null`, progress tracking is disabled and `onProgress` will not be called.

```tsx
function App() {
  const handleProgress = useCallback((progress: ProgressData) => {
    setCurrentTime(progress.currentTime);
    setDuration(progress.duration);
    setLoadedFraction(progress.loadedFraction);
  }, []);

  return (
    <YoutubePlayer
      source={source}
      progressInterval={1000}
      onProgress={handleProgress}
    />
  )
}
```

### Player Rendering & Source Configuration (ios, android)

**Inline HTML vs WebView Mode**   
Control YouTube player rendering method and configure source URLs for compatibility.

1. **Inline HTML Mode** (`useInlineHtml: true`) renders the player by loading HTML directly within the app. (default)
2. **WebView Mode** (`useInlineHtml: false`) loads an external player page.
   - The default URI is https://react-native-youtube-bridge.pages.dev.
   - To use your own custom player page as an external WebView, build your player with `@react-native-youtube-bridge/web` and set the URL in the `webViewUrl` property. For detailed implementation instructions, please refer to the [Web Player Guide](../web/).

> [!NOTE]
> **webViewUrl Usage**
> - When `useInlineHtml: true`: Set as the `baseUrl` for WebView source HTML.
> - When `useInlineHtml: false`: Overrides the WebView source `uri`.
>
> **Embed Restriction Solution**: If you encounter `embed not allowed` errors with YouTube iframe when using inline HTML mode and videos don't load properly, switch to WebView mode to load YouTube iframe through an external player.

```tsx
// Inline HTML (default)
<YoutubePlayer
 source={source}
 useInlineHtml
/>

// External WebView with custom player page
<YoutubePlayer
 source={source}
 useInlineHtml={false}
 // default: https://react-native-youtube-bridge.pages.dev
 webViewUrl="https://your-custom-player.com"
/>
```

**Custom Player Page**

To use your own custom player page, you can build a React-based player using `@react-native-youtube-bridge/web`.

```tsx
import { YoutubePlayer } from '@react-native-youtube-bridge/web';

function CustomPlayerPage() {
  return <YoutubePlayer />;
}

export default CustomPlayerPage;
```

> For more details, please refer to the [Web Player Guide](../web/).

### YouTube oEmbed API
Use the `useYoutubeOEmbed` hook to fetch YouTube video metadata.  
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

See the [contributing guide](/CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

[MIT](./LICENSE)
