---
"react-native-youtube-bridge": patch
---

fix: add missing origin parameter for YouTube iframe API security
- Pass webViewUrl as origin parameter to resolve iframe API restrictions
- Fix embed access issues when enablejsapi=1 is used
