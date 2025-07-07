# react-native-youtube-bridge

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
