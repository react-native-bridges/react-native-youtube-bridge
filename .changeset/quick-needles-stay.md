---
"react-native-youtube-bridge": patch
---

fix: prevent YouTube website from loading inside video player

- YouTube logo clicks now open in external browser instead of WebView
- Add default `onShouldStartLoadWithRequest` handler to intercept navigation
- Maintain embed video playback while redirecting external YouTube links
