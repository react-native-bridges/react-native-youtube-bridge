---
"react-native-youtube-bridge": major
"@react-native-youtube-bridge/react": major
"@react-native-youtube-bridge/core": major
"@react-native-youtube-bridge/web": major
---

feat!: introduce hooks-based API for v2.0

BREAKING CHANGE: Complete API redesign with React hooks

- Replace `YoutubePlayer` component with `YoutubeView` + `useYouTubePlayer` hook
- Add `useYouTubeEvent` hook for reactive event handling
- Remove ref-based imperative API in favor of declarative approach
- Simplify component props and reduce coupling between components
- Follow expo patterns for better DX

Migration required from v1:

- `YoutubePlayer` → `YoutubeView` + `useYouTubePlayer()`
- Event props → `useYouTubeEvent()` hooks
- `playerRef.current.method()` → `player.method()`

Fixes: Memory leaks, complex state management, tight coupling
Improves: Developer experience, maintainability, performance
