import type { ReceiveMessage } from './messages';

interface ReactNativeWebView {
  postMessage(message: string): void;
}

declare global {
  interface Window {
    ReactNativeWebView?: ReactNativeWebView;
    __execCommand?: (command: ReceiveMessage) => void;
  }
}

export type { ReactNativeWebView };
