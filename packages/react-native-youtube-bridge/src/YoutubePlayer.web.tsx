import type { PlayerControls } from '@react-native-youtube-bridge/core';
import { useYouTubePlayer, useYouTubeVideoId } from '@react-native-youtube-bridge/react';
import { forwardRef, useImperativeHandle } from 'react';
import { useWindowDimensions } from 'react-native';
import YoutubePlayerWrapper from './YoutubePlayerWrapper';
import type { YoutubePlayerProps } from './types/youtube';

const YoutubePlayer = forwardRef<PlayerControls, YoutubePlayerProps>((props, ref) => {
  const videoId = useYouTubeVideoId(props.source);
  const { containerRef, controls } = useYouTubePlayer({ ...props, videoId });
  const { width: screenWidth } = useWindowDimensions();

  useImperativeHandle(ref, () => controls, [controls]);

  return (
    <YoutubePlayerWrapper width={props.width ?? screenWidth} height={props.height ?? 200} style={props.style}>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          ...props.iframeStyle,
        }}
      />
    </YoutubePlayerWrapper>
  );
});

export default YoutubePlayer;
