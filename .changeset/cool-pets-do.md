---
"react-native-youtube-bridge": patch
"@react-native-youtube-bridge/core": patch
---

fix: resolve 101/150 errors by aligning WebView baseUrl and IFrame origin in inline mode

- Set baseUrl to the default `https://localhost/` for inline WebView
- Default playerVars.origin to `https://localhost` in inline WebView
- Wrap certain dev logs with DEV so they only run in development
- Add TSDoc for playerVars.origin and webViewUrl props
