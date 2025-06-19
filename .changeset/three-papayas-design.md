---
"react-native-youtube-bridge": minor
---

feat: add flexible source prop to support videoId and URL

> [!note]
> ❗ BREAKING CHANGE: videoId prop replaced with source prop
> - source accepts string (videoId/URL) or object {videoId} | {url}
> - Add useYouTubeVideoId hook for internal parsing
> - Support multiple YouTube URL formats
