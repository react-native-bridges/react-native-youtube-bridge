import {
  escapeHtml,
  extractVideoIdFromUrl,
  validateVideoId,
} from '@react-native-youtube-bridge/core';
import { Platform } from 'react-native';

import YoutubePlayer from '../modules/YoutubePlayer';

describe('player input compatibility', () => {
  it('loads the React Native Jest environment', () => {
    expect(['ios', 'android']).toContain(Platform.OS);
  });

  it.each([
    'https://www.youtube.com/watch?v=AbZH7XWDW_k',
    'https://youtu.be/AbZH7XWDW_k',
    'https://www.youtube.com/embed/AbZH7XWDW_k',
  ])('extracts the video ID from %s', (url) => {
    expect(extractVideoIdFromUrl(url)).toBe('AbZH7XWDW_k');
  });

  it('rejects malformed video IDs', () => {
    expect(validateVideoId('AbZH7XWDW_k')).toBe(true);
    expect(validateVideoId('invalid')).toBe(false);
    expect(validateVideoId(null)).toBe(false);
  });

  it('escapes user input before embedding it in player HTML', () => {
    expect(escapeHtml('<script>"&\'</script>')).toBe(
      '&lt;script&gt;&quot;&amp;&#039;&lt;/script&gt;',
    );
  });

  it('delivers events until the listener unsubscribes', () => {
    const player = new YoutubePlayer('AbZH7XWDW_k');
    const listener = jest.fn();
    const unsubscribe = player.subscribe('muteChange', listener);

    player.emit('muteChange', true);
    expect(listener).toHaveBeenCalledWith(true);

    unsubscribe();
    player.emit('muteChange', false);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('keeps subscriptions on different player instances independent', () => {
    const first = new YoutubePlayer('AbZH7XWDW_k');
    const second = new YoutubePlayer('dQw4w9WgXcQ');
    const listener = jest.fn();
    first.subscribe('muteChange', listener);

    second.emit('muteChange', true);
    expect(listener).not.toHaveBeenCalled();
    expect(first.getVideoId()).toBe('AbZH7XWDW_k');
    expect(second.getVideoId()).toBe('dQw4w9WgXcQ');
  });
});
