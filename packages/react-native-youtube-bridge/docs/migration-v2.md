# Migration Guide: v1 to v2

This guide will help you migrate from react-native-youtube-bridge v1 to v2. The v2 API is completely redesigned to be more React-friendly using hooks, similar to expo-audio and expo-video.

## Overview of Changes

| Aspect               | v1 (Old)                     | v2 (New)                           |
| -------------------- | ---------------------------- | ---------------------------------- |
| **API Style**        | Imperative (ref-based)       | Declarative (hooks-based)          |
| **Component**        | `YoutubePlayer`              | `YoutubeView` + `useYouTubePlayer` |
| **Event Handling**   | Manual listeners + props     | `useYouTubeEvent` hook             |
| **State Management** | Manual `useState`            | Automatic reactive updates         |
| **Player Control**   | `playerRef.current.method()` | `player.method()`                  |
| **Configuration**    | Component props              | Hook parameters                    |

## Step-by-Step Migration

### 1. Component Replacement

**Before (v1):**

```jsx
import { YoutubePlayer } from 'react-native-youtube-bridge';

<YoutubePlayer
  ref={playerRef}
  source={videoId}
  height={400}
  playerVars={{
    autoplay: true,
    controls: true,
    playsinline: true,
    rel: false,
    muted: true,
  }}
  onReady={handleReady}
  onStateChange={handleStateChange}
  onProgress={handleProgress}
  onError={handleError}
/>;
```

**After (v2):**

```jsx
import { YoutubeView, useYouTubePlayer } from 'react-native-youtube-bridge';

const player = useYouTubePlayer(videoId, {
  autoplay: true,
  controls: true,
  playsinline: true,
  rel: false,
  muted: true,
});

<YoutubeView player={player} style={{ height: 400 }} />;
```

### 2. Event Handling Migration

The `useYouTubeEvent` hook provides complete type inference and allows you to handle events in two ways: **callback-based** and **state-based**.

**Before (v1):**

```jsx
// Manual event handlers and state management
const [isPlaying, setIsPlaying] = useState(false);
const [currentTime, setCurrentTime] = useState(0);
const [duration, setDuration] = useState(0);
const [playbackRate, setPlaybackRate] = useState(1);
const [availableRates, setAvailableRates] = useState([1]);

const handleReady = useCallback((playerInfo) => {
  console.log('Player is ready!');
  if (playerInfo?.availablePlaybackRates) {
    setAvailableRates(playerInfo.availablePlaybackRates);
  }
}, []);

const handleStateChange = useCallback((state) => {
  setIsPlaying(state === PlayerState.PLAYING);
}, []);

const handleProgress = useCallback((progress) => {
  setCurrentTime(progress.currentTime);
  setDuration(progress.duration);
}, []);

const handlePlaybackRateChange = useCallback((rate) => {
  setPlaybackRate(rate);
}, []);
```

**After (v2):**

```jsx
// State-based event handling (reactive values)
const playbackRate = useYouTubeEvent(player, 'playbackRateChange', 1);
const progress = useYouTubeEvent(player, 'progress', 1000); // 1000ms interval
const state = useYouTubeEvent(player, 'stateChange');

const currentTime = progress?.currentTime ?? 0;
const duration = progress?.duration ?? 0;
const isPlaying = state === PlayerState.PLAYING;

// Callback-based event handling (for side effects)
const [availableRates, setAvailableRates] = useState([1]);

useYouTubeEvent(player, 'ready', (playerInfo) => {
  console.log('Player is ready!');
  if (playerInfo?.availablePlaybackRates) {
    setAvailableRates(playerInfo.availablePlaybackRates);
  }
});

useYouTubeEvent(player, 'autoplayBlocked', () => {
  console.log('Autoplay was blocked');
});

useYouTubeEvent(player, 'error', (error) => {
  console.error('Player error:', error);
  Alert.alert('Error', `Player error (${error.code}): ${error.message}`);
});
```

#### `useYouTubeEvent` Usage Patterns:

1. **State method** - Returns reactive values:

   ```jsx
   // For progress events with custom interval
   const progress = useYouTubeEvent(player, 'progress', 1000); // 1000ms interval

   // For other events with default value
   const playbackRate = useYouTubeEvent(player, 'playbackRateChange', 1);
   const state = useYouTubeEvent(player, 'stateChange');
   ```

2. **Callback method** - For side effects and actions:

   ```jsx
   // Simple callback
   useYouTubeEvent(player, 'ready', (playerInfo) => {
     console.log('Player ready:', playerInfo);
   });

   // With dependency array for re-rendering control
   useYouTubeEvent(
     player,
     'stateChange',
     (state) => {
       // Handle state change
     },
     [
       /* dependencies */
     ],
   );
   ```

### 3. Player Control Migration

**Before (v1):**

```jsx
const playerRef = useRef<PlayerControls>(null);

// Player methods
const play = () => playerRef.current?.play();
const pause = () => playerRef.current?.pause();
const stop = () => playerRef.current?.stop();
const seekTo = (time) => playerRef.current?.seekTo(time);
const setVolume = (volume) => playerRef.current?.setVolume(volume);
const mute = () => playerRef.current?.mute();
const unMute = () => playerRef.current?.unMute();

// Getting player info
const getPlayerInfo = async () => {
  const currentTime = await playerRef.current?.getCurrentTime();
  const duration = await playerRef.current?.getDuration();
  const state = await playerRef.current?.getPlayerState();
};
```

**After (v2):**

```jsx
const player = useYouTubePlayer(videoId, config);

// Player methods (direct calls)
const play = () => player.play();
const pause = () => player.pause();
const stop = () => player.stop();
const seekTo = (time) => player.seekTo(time);
const setVolume = (volume) => player.setVolume(volume);
const mute = () => player.mute();
const unMute = () => player.unMute();

// Getting player info
const getPlayerInfo = async () => {
  const currentTime = await player.getCurrentTime();
  const duration = await player.getDuration();
  const state = await player.getPlayerState();
};
```

### 4. Complete Migration Example

For a complete migration example with all features, please see our [example applications](/example/).

## Migration Checklist

### ✅ Required Changes

- [ ] Replace `YoutubePlayer` imports with `YoutubeView` and `useYouTubePlayer`
- [ ] Move `playerVars` from component props to hook parameters
- [ ] Replace event handler props with `useYouTubeEvent` hooks
- [ ] Remove `useRef` and replace `playerRef.current.method()` with `player.method()`
- [ ] Update component props (remove event handlers, keep styling props)
- [ ] Replace manual state management with reactive event hooks

### ✅ Optional Improvements

- [ ] Simplify state management by using reactive values directly
- [ ] Remove unnecessary `useState` calls for player-managed state
- [ ] Add error handling with `useYouTubeEvent(player, 'error')`
- [ ] Update TypeScript types if using TypeScript

## Breaking Changes Summary

- **Component**: `YoutubePlayer` → `YoutubeView` + `useYouTubePlayer`
- **Event Props**: Removed, use `useYouTubeEvent` instead
- **Player Control**: `playerRef.current.method()` → `player.method()`
- **Configuration**: `playerVars` prop → hook parameters
- **State Management**: Manual `useState` → reactive hook values

The v2 API is designed to be more intuitive and reduce boilerplate code while providing the same functionality. Most applications will see a significant reduction in code complexity after migration.

---

## Previous Versions

### [1.x.x] - Legacy Version

See [v1 documentation](./v1.md) for the previous imperative API.
