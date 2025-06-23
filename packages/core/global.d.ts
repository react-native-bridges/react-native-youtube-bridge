import type { IframeApiType } from './src/types/iframe';

declare global {
  interface Window {
    YT: IframeApiType;
    onYouTubeIframeAPIReady: () => void;
    _ytApiPromise: Promise<void>;
  }
}
