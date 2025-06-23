import type { PlayerControls } from '@react-native-youtube-bridge/core';

interface ReceivePlayerControls extends PlayerControls {
  cleanup: () => void;
  updateProgressInterval: (interval: number) => void;
}

export interface ReceiveMessage<K extends keyof ReceivePlayerControls = keyof ReceivePlayerControls> {
  command: K;
  args: Parameters<ReceivePlayerControls[K]>;
  id?: string;
}
