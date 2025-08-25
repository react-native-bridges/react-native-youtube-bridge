---
"react-native-youtube-bridge": patch
---

fix: align inline baseUrl with IFrame origin

- add trailing-slash handling for WebView baseUrl in inline mode
- propagate origin/playerVars into local HTML
- refine YoutubeView WebView source resolution
