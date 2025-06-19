import { forwardRef, useImperativeHandle } from 'react';
import { useWindowDimensions } from 'react-native';
import YoutubePlayerWrapper from './YoutubePlayerWrapper';
import useYouTubePlayer from './hooks/useYoutubePlayer';
import type { PlayerControls, YoutubePlayerProps } from './types/youtube';

const YoutubePlayer = forwardRef<PlayerControls, YoutubePlayerProps>((props, ref) => {
  const { containerRef, controls } = useYouTubePlayer(props);
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
