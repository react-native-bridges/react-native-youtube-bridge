# react-native-youtube-bridge

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
