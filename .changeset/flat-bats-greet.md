---
"react-native-youtube-bridge": minor
"@react-native-youtube-bridge/core": minor
"@react-native-youtube-bridge/web": minor
---

feat: add muteChange event with subscription-based muted state tracking

- Add `muteChange` event for real-time muted state updates.
- Forward `muteChange` through core/web/webview/react-native bridge layers.
- Enable muted-state tracking only while `muteChange` is subscribed (performance optimization).
- Keep replay mute-preservation behavior intact.
- Update the example app to use `useYouTubeEvent(player, 'muteChange', false)` for muted state.
- Update README docs (EN/KO, root + package) to document `muteChange` usage and tracking behavior.

```tsx
import { YoutubeView, useYouTubeEvent, useYouTubePlayer } from 'react-native-youtube-bridge';

function App() {
  const player = useYouTubePlayer(videoIdOrUrl);

  // 1. State-based event listening
  const isMuted = useYouTubeEvent(player, 'muteChange', false);

  // 2. Callback-based event listening
  useYouTubeEvent(player, 'muteChange', (muted) => {
    console.log('Player is muted:', muted);
  });

  return <YoutubeView player={player} />;
}
```
