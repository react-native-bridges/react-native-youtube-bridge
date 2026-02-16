import type { PlayerEvents } from '@react-native-youtube-bridge/core';
import type WebView from 'react-native-webview';

class WebviewYoutubePlayerController {
  private webViewRef: React.RefObject<WebView | null>;
  private commandId = 0;
  private pendingCommands: Map<string, (result: unknown) => void> = new Map();

  constructor(webViewRef: React.RefObject<WebView | null>) {
    this.webViewRef = webViewRef;
  }

  static createInstance(
    webViewRef: React.RefObject<WebView | null>,
  ): WebviewYoutubePlayerController {
    return new WebviewYoutubePlayerController(webViewRef);
  }

  getPendingCommands(): Map<string, (result: unknown) => void> {
    return this.pendingCommands;
  }

  async play(): Promise<void> {
    await this.executeCommand('play');
  }

  async pause(): Promise<void> {
    await this.executeCommand('pause');
  }

  async stop(): Promise<void> {
    await this.executeCommand('stop');
  }

  async seekTo(seconds: number, allowSeekAhead = true): Promise<void> {
    await this.executeCommand('seekTo', [seconds, allowSeekAhead]);
  }

  async setVolume(volume: number): Promise<void> {
    await this.executeCommand('setVolume', [volume]);
  }

  async getVolume(): Promise<number> {
    return await this.executeCommand('getVolume', [], true);
  }

  async mute(): Promise<void> {
    await this.executeCommand('mute');
  }

  async unMute(): Promise<void> {
    await this.executeCommand('unMute');
  }

  async isMuted(): Promise<boolean> {
    return await this.executeCommand('isMuted', [], true);
  }

  async getCurrentTime(): Promise<number> {
    return await this.executeCommand('getCurrentTime', [], true);
  }

  async getDuration(): Promise<number> {
    return await this.executeCommand('getDuration', [], true);
  }

  async getVideoUrl(): Promise<string> {
    return await this.executeCommand('getVideoUrl', [], true);
  }

  async getVideoEmbedCode(): Promise<string> {
    return await this.executeCommand('getVideoEmbedCode', [], true);
  }

  async getPlaybackRate(): Promise<number> {
    return await this.executeCommand('getPlaybackRate', [], true);
  }

  async getAvailablePlaybackRates(): Promise<number[]> {
    return await this.executeCommand('getAvailablePlaybackRates', [], true);
  }

  async getPlayerState(): Promise<number> {
    return await this.executeCommand('getPlayerState', [], true);
  }

  async setPlaybackRate(suggestedRate: number): Promise<void> {
    await this.executeCommand('setPlaybackRate', [suggestedRate]);
  }

  async getVideoLoadedFraction(): Promise<number> {
    return await this.executeCommand('getVideoLoadedFraction', [], true);
  }

  async loadVideoById(videoId: string, startSeconds?: number, endSeconds?: number): Promise<void> {
    await this.executeCommand('loadVideoById', [videoId, startSeconds, endSeconds]);
  }

  async cueVideoById(videoId: string, startSeconds?: number, endSeconds?: number): Promise<void> {
    await this.executeCommand('cueVideoById', [videoId, startSeconds, endSeconds]);
  }

  async setSize(width: number, height: number): Promise<void> {
    await this.executeCommand('setSize', [width, height]);
  }

  async cleanup(): Promise<void> {
    await this.executeCommand('cleanup');
  }

  async updateProgressInterval(interval: number): Promise<void> {
    await this.executeCommand('updateProgressInterval', [interval]);
  }

  private executeCommand(
    command: string,
    args: (string | number | boolean | undefined)[] = [],
    needsResult = false,
  ): Promise<any> {
    return new Promise((resolve) => {
      if (!this.webViewRef.current) {
        resolve(null);
        return;
      }

      const messageId = needsResult ? (++this.commandId).toString() : undefined;

      if (needsResult && messageId) {
        const timeout = setTimeout(() => {
          this.pendingCommands.delete(messageId);
          console.warn('Command timeout:', command, messageId);
          resolve(null);
        }, 5000);

        this.pendingCommands.set(messageId, (result) => {
          clearTimeout(timeout);
          resolve(result);
        });
      }

      const commandData = {
        command,
        args,
        ...(messageId && { id: messageId }),
      };

      const injectScript = /* js */ `
        window.__execCommand && window.__execCommand(${JSON.stringify(commandData)}); true;
      `;

      this.webViewRef.current.injectJavaScript(injectScript);

      if (!needsResult) {
        resolve(null);
      }
    });
  }

  /**
   * Updates player event callbacks. No-op in WebView implementation.
   * This method exists for interface compatibility with web implementation.
   * @param _newCallbacks - Event callbacks (ignored in WebView)
   */
  updateCallbacks(_newCallbacks: Partial<PlayerEvents>): void {
    // no-op only for web
  }

  async destroy(): Promise<void> {
    this.pendingCommands.clear();
    await this.cleanup();
  }
}

export default WebviewYoutubePlayerController;
