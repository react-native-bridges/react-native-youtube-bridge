---
'react-native-youtube-bridge': patch
---

Emit `ready` on native only after the player's controller is attached, so commands called from a `ready` listener (such as `seekTo`, `setPlaybackRate` or `play`) reach the player instead of being dropped.
