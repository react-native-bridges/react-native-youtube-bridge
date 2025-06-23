import type { ReceiveMessage } from './src/types/message';

interface ReactNativeWebView {
  postMessage(message: string): void;
}

declare global {
  interface Window {
    ReactNativeWebView?: ReactNativeWebView;
    __execCommand?: (command: ReceiveMessage) => void;
  }
}
