---
"react-native-youtube-bridge": patch
"@react-native-youtube-bridge/react": patch
"@react-native-youtube-bridge/core": patch
"@react-native-youtube-bridge/web": patch
---

fix: preserve muted preference when replay starts after video end (#82)

When a video is configured with muted=true, pressing the YouTube replay button after ENDED could resume playback with sound.  
This patch preserves mute intent across replay by tracking the desired muted state and reapplying mute on ENDED->PLAYING transitions in both inline WebView and core controller paths.  
It also synchronizes desired mute state when mute/unmute is explicitly toggled and updates iframe playerVars typing to include mute for consistency across web and native flows.  
