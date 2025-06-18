---
"react-native-youtube-bridge": patch
---

fix: where onProgress is not called when seekTo is invoked
- add TSDoc documentation
- add defensive logic for cases without videoId
- fix issue where seekTo doesn't work properly when paused without interval
