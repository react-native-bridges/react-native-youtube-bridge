---
"react-native-youtube-bridge": patch
"@react-native-youtube-bridge/core": patch
---

fix: resolve YouTube 101/150 errors by aligning WebView baseUrl and IFrame origin in inline mode

- Wrap certain dev logs with `__DEV__` so they only run in development
- Add TSDoc for `webViewUrl` prop

Notes:

- When using a custom baseUrl like `https://your-domain.com/`, the IFrame API `origin` must be `https://your-domain.com` (port must match).
- Use a trailing slash for `baseUrl` (e.g., `https://localhost/`), but never for `origin` (scheme + host [+ port] only).
