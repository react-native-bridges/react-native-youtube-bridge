---
'react-native-youtube-bridge': patch
---

Attach the native player controller before emitting ready so commands and getters called from ready listeners work immediately.
