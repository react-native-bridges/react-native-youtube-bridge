import type { PlayerControls } from '../../../src/types/youtube';

interface ReceivePlayerControls extends PlayerControls {
  cleanup: () => void;
  updateProgressInterval: (interval: number) => void;
}

export interface ReceiveMessage<K extends keyof ReceivePlayerControls = keyof ReceivePlayerControls> {
  command: K;
  args: Parameters<ReceivePlayerControls[K]>;
  id?: string;
}
