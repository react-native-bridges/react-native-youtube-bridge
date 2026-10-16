import { act } from 'react';
import type { WebView, WebViewMessageEvent } from 'react-native-webview';

import useYouTubeEvent from '../hooks/useYouTubeEvent';
import YoutubePlayer from '../modules/YoutubePlayer';
import YoutubeView from '../YoutubeView';

const mockInjectJavaScript = jest.fn();
let mockOnMessage: (event: WebViewMessageEvent) => void;

jest.mock('react-native-webview', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  return {
    WebView: React.forwardRef<
      Pick<WebView, 'injectJavaScript'>,
      { onMessage: typeof mockOnMessage }
    >((props, ref) => {
      React.useLayoutEffect(() => {
        mockOnMessage = props.onMessage;
      }, [props.onMessage]);
      React.useImperativeHandle(ref, () => ({ injectJavaScript: mockInjectJavaScript }), []);
      return null;
    }),
  };
});

jest.mock('../YoutubeViewWrapper', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('react-native/src/private/webapis/dom/nodes/specs/NativeDOM', () => ({
  __esModule: true,
  default: { linkRootNode: jest.fn() },
}));

// Render with React Native's bundled renderer. Only the native host boundary is mocked.
Object.assign((global as typeof global & { nativeFabricUIManager: object }).nativeFabricUIManager, {
  createChildSet: () => [],
  completeRoot: jest.fn(),
});

const { renderElement } = jest.requireActual<{
  renderElement: (options: { element: React.ReactNode; rootTag: number }) => void;
}>('react-native/Libraries/ReactNative/RendererProxy');

type Command = { command: string; args: unknown[]; id?: string };

function commands(): Command[] {
  return mockInjectJavaScript.mock.calls.map(([script]: [string]) =>
    JSON.parse(script.match(/__execCommand\((.*)\);/)![1]!),
  );
}

function TestView({ player, onReady }: { player: YoutubePlayer; onReady: () => void }) {
  useYouTubeEvent(player, 'ready', onReady);
  useYouTubeEvent(player, 'progress', 250);
  useYouTubeEvent(player, 'muteChange', () => {});
  return <YoutubeView player={player} />;
}

async function render(player: YoutubePlayer, onReady = () => {}) {
  await act(async () => {
    renderElement({ element: <TestView player={player} onReady={onReady} />, rootTag: 11 });
  });
}

async function message(data: Record<string, unknown>) {
  await act(async () => {
    mockOnMessage({ nativeEvent: { data: JSON.stringify(data) } } as WebViewMessageEvent);
  });
}

const ready = { type: 'ready', playerInfo: { currentTime: 0 } };

beforeEach(() => {
  jest.useFakeTimers();
  mockInjectJavaScript.mockClear();
});

afterEach(async () => {
  await act(async () => {
    renderElement({ element: null, rootTag: 11 });
  });
  jest.clearAllTimers();
  jest.useRealTimers();
});

it('delivers commands called synchronously in the first ready callback', async () => {
  const player = new YoutubePlayer('AbZH7XWDW_k');
  const onReady = jest.fn(() => {
    player.seekTo(60);
    player.play();
    player.setPlaybackRate(1.5);
  });
  await render(player, onReady);

  await message(ready);

  expect(onReady).toHaveBeenCalledTimes(1);
  expect(commands()).toEqual(
    expect.arrayContaining([
      { command: 'seekTo', args: [60, true] },
      { command: 'play', args: [] },
      { command: 'setPlaybackRate', args: [1.5] },
    ]),
  );
});

it('resolves a getter called in ready after the render effects have flushed', async () => {
  const player = new YoutubePlayer('AbZH7XWDW_k');
  let result: ReturnType<YoutubePlayer['getCurrentTime']>;
  await render(player, () => {
    result = player.getCurrentTime();
  });

  await message(ready);

  expect(result).toBeInstanceOf(Promise);
  const command = commands().find(({ command }) => command === 'getCurrentTime')!;
  await message({ type: 'commandResult', id: command.id, result: 60 });
  await expect(result).resolves.toBe(60);
});

it('preserves pending getters and delivers repeated ready events', async () => {
  const player = new YoutubePlayer('AbZH7XWDW_k');
  const onReady = jest.fn();
  await render(player, onReady);
  await message(ready);
  const result = player.getCurrentTime();
  const command = commands().find(({ command }) => command === 'getCurrentTime')!;

  await message(ready);
  await message({ type: 'commandResult', id: command.id, result: 60 });

  expect(onReady).toHaveBeenCalledTimes(2);
  await expect(result).resolves.toBe(60);
});

it('binds a replacement player with the same video and options without another ready', async () => {
  const player = new YoutubePlayer('AbZH7XWDW_k', { muted: true });
  await render(player);
  await message(ready);
  const replacement = new YoutubePlayer('AbZH7XWDW_k', { muted: true });

  await render(replacement);
  mockInjectJavaScript.mockClear();
  replacement.seekTo(90);

  expect(commands()).toEqual([{ command: 'seekTo', args: [90, true] }]);
});

it('initializes a replacement video document before its ready callback', async () => {
  await render(new YoutubePlayer('AbZH7XWDW_k'));
  await message(ready);
  const replacement = new YoutubePlayer('dQw4w9WgXcQ');
  let result: ReturnType<YoutubePlayer['getCurrentTime']>;
  let commandsAtReady: Command[] = [];
  const onReady = jest.fn(() => {
    commandsAtReady = commands();
    replacement.seekTo(60);
    result = replacement.getCurrentTime();
  });
  await render(replacement, onReady);
  const pendingResult = replacement.getCurrentTime();
  const pendingCommand = commands().find(({ command }) => command === 'getCurrentTime')!;
  // Commands sent before the replacement document is ready may reach the old document.
  mockInjectJavaScript.mockClear();

  await message(ready);

  expect(commandsAtReady).toEqual([
    { command: 'setMutedTrackingEnabled', args: [true] },
    { command: 'updateProgressInterval', args: [250] },
  ]);
  expect(commands()).toContainEqual({ command: 'seekTo', args: [60, true] });
  expect(result).toBeInstanceOf(Promise);
  const command = commands().find(({ command }) => command === 'getCurrentTime')!;
  expect(command.id).not.toBe(pendingCommand.id);
  await message({ type: 'commandResult', id: pendingCommand.id, result: 30 });
  await message({ type: 'commandResult', id: command.id, result: 60 });
  await expect(pendingResult).resolves.toBe(30);
  await expect(result).resolves.toBe(60);
  const commandsAfterReady = commands();
  onReady.mockImplementation(() => {});
  await message(ready);
  expect(onReady).toHaveBeenCalledTimes(2);
  expect(commands()).toEqual(commandsAfterReady);
});

it('preserves both getters when ready arrives twice before effects flush', async () => {
  const player = new YoutubePlayer('AbZH7XWDW_k');
  const results: ReturnType<YoutubePlayer['getCurrentTime']>[] = [];
  await render(player, () => {
    results.push(player.getCurrentTime());
  });

  await act(async () => {
    const event = { nativeEvent: { data: JSON.stringify(ready) } } as WebViewMessageEvent;
    mockOnMessage(event);
    mockOnMessage(event);
  });

  expect(results).toHaveLength(2);
  expect(results.every((result) => result instanceof Promise)).toBe(true);
  const getters = commands().filter(({ command }) => command === 'getCurrentTime');
  expect(getters).toHaveLength(2);
  expect(new Set(getters.map(({ id }) => id)).size).toBe(2);
  await act(async () => {
    for (const command of getters) {
      mockOnMessage({
        nativeEvent: {
          data: JSON.stringify({ type: 'commandResult', id: command.id, result: 60 }),
        },
      } as WebViewMessageEvent);
    }
  });
  await expect(Promise.all(results)).resolves.toEqual([60, 60]);
});

it('initializes progress and mute tracking before ready callbacks exactly once', async () => {
  const player = new YoutubePlayer('AbZH7XWDW_k');
  const initialCommands = [
    { command: 'setMutedTrackingEnabled', args: [true] },
    { command: 'updateProgressInterval', args: [250] },
  ];
  let commandsAtReady: Command[] = [];
  await render(player, () => {
    commandsAtReady = commands();
  });

  await message(ready);

  expect(commandsAtReady).toEqual(initialCommands);
  expect(commands()).toEqual(initialCommands);
  await message(ready);
  expect(commands()).toEqual(initialCommands);
});
