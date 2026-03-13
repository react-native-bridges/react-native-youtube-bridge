# @react-native-youtube-bridge/core

## 2.2.0

### Minor Changes

- [#85](https://github.com/react-native-bridges/react-native-youtube-bridge/pull/85) [`65fa568`](https://github.com/react-native-bridges/react-native-youtube-bridge/commit/65fa568b8d94143ca09e695e8372ee0627456df9) Thanks [@saseungmin](https://github.com/saseungmin)! - feat: add muteChange event with subscription-based muted state tracking

  - Add `muteChange` event for real-time muted state updates.
  - Forward `muteChange` through core/web/webview/react-native bridge layers.
  - Enable muted-state tracking only while `muteChange` is subscribed (performance optimization).
  - Keep replay mute-preservation behavior intact.
  - Update the example app to use `useYouTubeEvent(player, 'muteChange', false)` for muted state.
  - Update README docs (EN/KO, root + package) to document `muteChange` usage and tracking behavior.

  ```tsx
  import {
    YoutubeView,
    useYouTubeEvent,
    useYouTubePlayer,
  } from "react-native-youtube-bridge";

  function App() {
    const player = useYouTubePlayer(videoIdOrUrl);

    // 1. State-based event listening
    const isMuted = useYouTubeEvent(player, "muteChange", false);

    // 2. Callback-based event listening
    useYouTubeEvent(player, "muteChange", (muted) => {
      console.log("Player is muted:", muted);
    });

    return <YoutubeView player={player} />;
  }
  ```

### Patch Changes

- [#81](https://github.com/react-native-bridges/react-native-youtube-bridge/pull/81) [`fd60a82`](https://github.com/react-native-bridges/react-native-youtube-bridge/commit/fd60a82bc08818523e6eea9c22555e7d28dbdeff) Thanks [@saseungmin](https://github.com/saseungmin)! - chore: update tsdown dependency

- [#79](https://github.com/react-native-bridges/react-native-youtube-bridge/pull/79) [`4993ebb`](https://github.com/react-native-bridges/react-native-youtube-bridge/commit/4993ebbe23418737e02ff2fbf712c7442dea5205) Thanks [@saseungmin](https://github.com/saseungmin)! - chore: reformat code with oxfmt

- [#83](https://github.com/react-native-bridges/react-native-youtube-bridge/pull/83) [`3cad8a0`](https://github.com/react-native-bridges/react-native-youtube-bridge/commit/3cad8a03da7a7beb1f9600ba54fca226aa9ba003) Thanks [@saseungmin](https://github.com/saseungmin)! - fix: preserve muted preference when replay starts after video end ([#82](https://github.com/react-native-bridges/react-native-youtube-bridge/issues/82))

  When a video is configured with muted=true, pressing the YouTube replay button after ENDED could resume playback with sound.
  This patch preserves mute intent across replay by tracking the desired muted state and reapplying mute on ENDED->PLAYING transitions in both inline WebView and core controller paths.
  It also synchronizes desired mute state when mute/unmute is explicitly toggled and updates iframe playerVars typing to include mute for consistency across web and native flows.

## 2.1.4

### Patch Changes

- 390538e: chore(docs): replace @remark with @remarks per TSDoc spec

  - TSDoc specifies the tag name as `@remarks` (not `@remark`).
  - This aligns our comments with the spec and improves tooling support.
  - No runtime behavior changes.
  - Ref: https://tsdoc.org/pages/tags/remarks/

## 2.1.3

### Patch Changes

- a4784e6: chore: update TSDoc for `playerVars.origin` prop

## 2.1.2

### Patch Changes

- 3645311: feat: export `MATCH_URL_YOUTUBE` regex constant

## 2.1.1

### Patch Changes

- 8607fb1: feat: add `YoutubePlayerEvents`, `YoutubeSource` types and enhance TSDoc documentation

  - Add `YoutubePlayerEvents`, `YoutubeSource` type definition
  - Enhance TSDoc with comprehensive parameter descriptions and examples
  - Change type name `YouTubeError` to `YoutubeError`
  - Remove unused v1 export `PlayerEvents`, `PlayerControls`, `YoutubePlayerProps` type

## 2.1.0

### Minor Changes

- 601dbe0: feat: support optional YouTube source for dynamic loading

  - Extend YouTubeSource type to accept undefined values
  - Add defensive logic for undefined source handling
  - Enable async video ID loading patterns
  - Maintain backward compatibility with existing usage

  New usage pattern:

  ```tsx
  type YouTubeSource =
    | string
    | { videoId: string | undefined }
    | { url: string | undefined }
    | undefined;

  const [videoId, setVideoId] = useState<string | undefined>();
  const player = useYouTubePlayer(videoId); // Now supports undefined
  ```

## 2.0.0

### Major Changes

- ae4cc4d: feat!: introduce hooks-based API for v2.0

  > [!important]
  > BREAKING CHANGE: **Complete API Redesign with React Hooks**

  #### New Hooks-Based Architecture

  - **`useYouTubePlayer(videoId, config)`** - Creates a player instance with declarative configuration
  - **`useYouTubeEvent(player, eventName, intervalOrDefault?, deps?)`** - Reactive event handling with complete type inference
  - **`YoutubeView`** - Simplified view component that accepts a player instance

  #### Migration from v1 to v2

  **Before (v1):**

  ```jsx
  // Imperative, ref-based API
  const playerRef = useRef < PlayerControls > null;

  <YoutubePlayer
    ref={playerRef}
    source={videoId}
    onReady={handleReady}
    onStateChange={handleStateChange}
    onProgress={handleProgress}
    playerVars={{ autoplay: true }}
  />;

  // Manual event handlers and state management
  const [isPlaying, setIsPlaying] = useState(false);
  const handleStateChange = (state) =>
    setIsPlaying(state === PlayerState.PLAYING);
  ```

  **After (v2):**

  ```jsx
  // Declarative, hooks-based API
  const player = useYouTubePlayer(videoId, {
    autoplay: true,
    controls: true,
    playsinline: true,
  });

  <YoutubeView player={player} />;

  // Reactive state with automatic updates - two usage patterns:

  // 1. State-based (returns reactive values)
  const playbackRate = useYouTubeEvent(player, "playbackRateChange", 1);
  const progress = useYouTubeEvent(player, "progress", 1000); // 1000ms interval
  const state = useYouTubeEvent(player, "stateChange");

  const isPlaying = state === PlayerState.PLAYING;

  // 2. Callback-based (for side effects)
  useYouTubeEvent(player, "ready", (playerInfo) => {
    console.log("Player ready:", playerInfo);
  });

  useYouTubeEvent(player, "error", (error) => {
    console.error("Player error:", error);
  });
  ```

  ### ✨ New Features

  - **Declarative Configuration**: Configure player options directly in `useYouTubePlayer` hook
  - **Automatic State Management**: No need to manually manage state for common use cases
  - **Reactive Events**: `useYouTubeEvent` with two usage patterns - state-based for reactive values and callback-based for side effects
  - **Better TypeScript Support**: Improved type inference and autocomplete
  - **Reduced Boilerplate**: Significantly less code required for common operations
  - **Automatic Cleanup**: Hooks handle cleanup automatically, preventing memory leaks

  ### 🎯 Improvements

  - **Reduced Coupling**: Eliminated ref dependencies between parent and child components
  - **Simplified API**: Fewer props to manage, more intuitive usage patterns
  - **Better Developer Experience**: Following established React Native patterns (expo-audio, expo-video)
  - **Performance**: More efficient event handling with automatic cleanup
  - **Maintainability**: Cleaner separation of concerns

  ### 📦 Component Changes

  #### Removed

  - ❌ `YoutubePlayer` component (replaced by `YoutubeView`)
  - ❌ `PlayerControls` ref interface
  - ❌ Direct event props (`onReady`, `onStateChange`, `onProgress`, etc.)

  #### Added

  - ✅ `YoutubeView` component
  - ✅ `useYouTubePlayer` hook
  - ✅ `useYouTubeEvent` hook
  - ✅ Simplified prop interface

  ### 📚 Migration Guide

  For detailed migration examples and step-by-step instructions, see our [Migration Guide](/packages/react-native-youtube-bridge/docs/migration-v2.md).

  Key migration steps:

  1. **Replace `YoutubePlayer` with `YoutubeView` + `useYouTubePlayer`**
  2. **Convert event props to `useYouTubeEvent` hooks** (state-based or callback-based)
  3. **Move `playerVars` to `useYouTubePlayer` config**
  4. **Replace ref-based method calls with direct player method calls**
  5. **Remove manual state management for events**

  ### ⚠️ Breaking Changes

  - **API Surface**: Complete API redesign, no backward compatibility
  - **Event Handling**: Manual event listeners replaced with reactive hooks
  - **Component Structure**: `YoutubePlayer` split into `YoutubeView` + hooks

  ### 🐛 Bug Fixes

  - Fixed memory leaks from improper event cleanup
  - Better handling of rapid video ID changes
  - Manage multiple players independently

  ### 📖 Documentation

  - Complete API documentation rewrite
  - Added migration guide from v1
  - Updated all examples to use v2 API
  - Added TypeScript usage examples

  ***

  ## Previous Versions

  ### [1.x.x] - Legacy Version

  See [v1 documentation](/packages/react-native-youtube-bridge/docs/v1.md) for the previous imperative API.

## 1.0.3

### Patch Changes

- e0ae7e0: docs: add comprehensive TSDoc for YoutubePlayer props and events
  - Improve documentation for player events (`onReady`, `onStateChange`, etc.)
  - Add detailed descriptions for player parameters and configuration

## 1.0.2

### Patch Changes

- d2b1b03: fix: migrate from bun to pnpm to resolve workspace dependency resolution issues
  - Bun changeset publish fails to resolve workspace dependencies
  - Migrated from bun to pnpm for stable monorepo workflow
  - Updated CI/CD configurations for pnpm compatibility

## 1.0.1

### Patch Changes

- 3a3112d: fix: remove private flag to enable npm publishing

## 1.0.0

### Major Changes

- 26dc564: feat(core): 🎉 Initial Release @react-native-youtube-bridge/core v1.0.0
  - `@react-native-youtube-bridge/core` is a shared core utility package used commonly across `react-native-youtube-bridge`.
