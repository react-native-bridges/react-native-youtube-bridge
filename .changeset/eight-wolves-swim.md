---
"react-native-youtube-bridge": minor
"@react-native-youtube-bridge/react": minor
"@react-native-youtube-bridge/core": minor
"@react-native-youtube-bridge/web": minor
---

feat: support optional YouTube source for dynamic loading

- Extend YouTubeSource type to accept undefined values
- Add defensive logic for undefined source handling
- Enable async video ID loading patterns
- Maintain backward compatibility with existing usage

New usage pattern:

```tsx
type YouTubeSource = string | { videoId: string | undefined } | { url: string | undefined } | undefined;

const [videoId, setVideoId] = useState<string | undefined>();
const player = useYouTubePlayer(videoId); // Now supports undefined
```
