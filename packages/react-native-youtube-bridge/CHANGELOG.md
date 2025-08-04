# react-native-youtube-bridge

## 2.1.2

### Patch Changes

- 3645311: fix: prevent YouTube website from loading inside video player

  - YouTube logo clicks now open in external browser instead of WebView
  - Add default `onShouldStartLoadWithRequest` handler to intercept navigation
  - Maintain embed video playback while redirecting external YouTube links

- Updated dependencies [3645311]
  - @react-native-youtube-bridge/core@2.1.2
  - @react-native-youtube-bridge/react@2.1.2

## 2.1.1

### Patch Changes

- 8607fb1: feat: add `YoutubePlayerEvents`, `YoutubeSource` types and enhance TSDoc documentation

  - Add `YoutubePlayerEvents`, `YoutubeSource` type definition
  - Enhance TSDoc with comprehensive parameter descriptions and examples
  - Change type name `YouTubeError` to `YoutubeError`
  - Remove unused v1 export `PlayerEvents`, `PlayerControls`, `YoutubePlayerProps` type

- Updated dependencies [8607fb1]
  - @react-native-youtube-bridge/core@2.1.1
  - @react-native-youtube-bridge/react@2.1.1

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

### Patch Changes

- Updated dependencies [601dbe0]
  - @react-native-youtube-bridge/react@2.1.0
  - @react-native-youtube-bridge/core@2.1.0

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

### Patch Changes

- Updated dependencies [ae4cc4d]
  - @react-native-youtube-bridge/react@2.0.0
  - @react-native-youtube-bridge/core@2.0.0

## 1.1.4

### Patch Changes

- ba12f3d: fix: resolve broken links in README files

## 1.1.3

### Patch Changes

- 4037df5: chore: include src folder in package.json files

  - Add src to files array for better debugging experience
  - Enables accurate source maps and stack traces for library users
  - Follows React Native library best practices

## 1.1.2

### Patch Changes

- e0ae7e0: docs: add comprehensive TSDoc for YoutubePlayer props and events
  - Improve documentation for player events (`onReady`, `onStateChange`, etc.)
  - Add detailed descriptions for player parameters and configuration
- Updated dependencies [e0ae7e0]
  - @react-native-youtube-bridge/core@1.0.3
  - @react-native-youtube-bridge/react@1.1.1

## 1.1.1

### Patch Changes

- 4f1513a: fix(types): preserve TSDoc in YoutubePlayer component props

  - Add explicit type annotation to maintain interface reference
  - Fix Go to Definition to navigate to YoutubePlayerProps interface
  - Ensure IntelliSense displays JSDoc comments for component props
  - Prevent TypeScript compiler from inlining props type definition

## 1.1.0

### Minor Changes

- 46ce91a: feat(hook): add useYoutubeOEmbed hook for fetching YouTube video metadata

### Patch Changes

- Updated dependencies [46ce91a]
  - @react-native-youtube-bridge/react@1.1.0

## 1.0.2

### Patch Changes

- d2b1b03: fix: migrate from bun to pnpm to resolve workspace dependency resolution issues
  - Bun changeset publish fails to resolve workspace dependencies
  - Migrated from bun to pnpm for stable monorepo workflow
  - Updated CI/CD configurations for pnpm compatibility
- Updated dependencies [d2b1b03]
  - @react-native-youtube-bridge/core@1.0.2
  - @react-native-youtube-bridge/react@1.0.2

## 1.0.1

### Patch Changes

- Updated dependencies [3a3112d]
  - @react-native-youtube-bridge/react@1.0.1
  - @react-native-youtube-bridge/core@1.0.1

## 1.0.0

### Major Changes

- 26dc564: feat(react-native): 🎉 Release react-native-youtube-bridge v1.0.0
  - Released v1.0.0 after completing essential features and confirming stable operation.
  - Migrated the entire project to a monorepo structure without any functional changes. (`@react-native-youtube-bridge/core`, `@react-native-youtube-bridge/react`, `@react-native-youtube-bridge/web`, `react-native-youtube-bridge`)
  - New feature: Added the ability to build custom web players using `@react-native-youtube-bridge/web`. For detailed usage instructions, please refer to the [Web Player Guide](https://github.com/react-native-bridges/react-native-youtube-bridge/tree/main/packages/web).

### Patch Changes

- Updated dependencies [26dc564]
- Updated dependencies [26dc564]
  - @react-native-youtube-bridge/core@1.0.0
  - @react-native-youtube-bridge/react@1.0.0

## 0.4.3

### Patch Changes

- cc61a8d: fix: override webview source props (method, body, header)

## 0.4.2

### Patch Changes

- ae3777a: fix(web): prevent player rerender when onError is not wrapped with useCallback

## 0.4.1

### Patch Changes

- ea4af1b: fix: add missing origin parameter for YouTube iframe API security
  - Pass webViewUrl as origin parameter to resolve iframe API restrictions
  - Fix embed access issues when enablejsapi=1 is used

## 0.4.0

### Minor Changes

- 6ed4d00: feat: add flexible rendering modes with webViewUrl configuration
  - Add webViewUrl prop for custom source URL configuration
  - Support baseUrl setting for inline HTML mode to resolve embed restrictions
  - Support URI override for WebView mode with custom player pages
  - Update documentation with rendering configuration guide

## 0.3.1

### Patch Changes

- 058d4c8: docs(example): update example video and expo go link

## 0.3.0

### Minor Changes

- 4925df0: feat: add flexible source prop to support videoId and URL

  > [!note]
  > ❗ BREAKING CHANGE: videoId prop replaced with source prop
  >
  > - source accepts string (videoId/URL) or object {videoId} | {url}
  > - Add useYouTubeVideoId hook for internal parsing
  > - Support multiple YouTube URL formats

## 0.2.4

### Patch Changes

- a71768e: refactor(web): extract YouTubePlayerCore class for better architecture
  - Separate business logic from React lifecycle
  - Create framework-agnostic core with useYouTubePlayer hook

## 0.2.3

### Patch Changes

- bf1b999: chore(package.json): remove src folder when uploading to npm (-53.5kb)

## 0.2.2

### Patch Changes

- 5c8c57d: refactor: organize and constantize error codes

## 0.2.1

### Patch Changes

- b4cdf79: fix: where onProgress is not called when seekTo is invoked
  - add TSDoc documentation
  - add defensive logic for cases without videoId
  - fix issue where seekTo doesn't work properly when paused without interval

## 0.2.0

### Minor Changes

- 878a2a9: fix: change props name from webviewProps to webViewProps

## 0.1.0

### Minor Changes

- 83a2b0f: feat: 🎉 Initial Release react-native-youtube-bridge v0.1.0
