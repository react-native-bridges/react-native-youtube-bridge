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

## Example
> For a quick start, check out the [example](/example/).

- [Web Demo](https://react-native-youtube-bridge.pages.dev/) 

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
    <YoutubePlayer videoId={videoId} />
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
        videoId={videoId}
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
      videoId={videoId}
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
      videoId={videoId}
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

### Useful Features

#### Playback Progress Tracking
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
      videoId={videoId}
      progressInterval={1000}
      onProgress={handleProgress}
    />
  )
}
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

[MIT](./LICENSE)
