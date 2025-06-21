import { useCallback, useEffect, useState } from 'react';
import type { MessageData } from '../../../src/types/message';
import type { ReceiveMessage } from '../types/messages';
import { isWebViewAvailable } from '../utils';

interface UseWebViewReturn {
  isWebView: boolean;
  sendMessage: (message: MessageData) => boolean;
  onMessage: (handler: (message: ReceiveMessage) => void) => () => void;
}

export const useWebView = (): UseWebViewReturn => {
  const [isWebView, setIsWebView] = useState<boolean>(false);

  const sendMessage = useCallback((message: MessageData): boolean => {
    if (!isWebViewAvailable(window)) {
      console.warn('WebView is not available');
      return false;
    }

    try {
      const messageWithTimestamp = {
        ...message,
        timestamp: Date.now(),
      };

      window.ReactNativeWebView.postMessage(JSON.stringify(messageWithTimestamp));
      return true;
    } catch (error) {
      console.error('Failed to send WebView message:', error);
      return false;
    }
  }, []);

  const onMessage = useCallback((handler: (message: ReceiveMessage) => void) => {
    const messageHandler = (command: ReceiveMessage) => {
      try {
        handler(command);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'unknown error';

        if (command.id && window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(
            JSON.stringify({
              type: 'error',
              id: command.id,
              error: { code: -5, message: `Execution failed: ${errorMessage}` },
            }),
          );
        }
      }
    };

    window.__execCommand = messageHandler;

    return () => {
      window.__execCommand = undefined;
    };
  }, []);

  useEffect(() => {
    setIsWebView(isWebViewAvailable(window));
  }, []);

  return {
    isWebView,
    sendMessage,
    onMessage,
  };
};
