import type { ReactNode } from 'react';
import { type DimensionValue, type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

type YoutubePlayerWrapperProps = {
  children: ReactNode;
  width?: DimensionValue;
  height?: DimensionValue;
  style?: StyleProp<ViewStyle>;
};

function YoutubePlayerWrapper({ children, width, height, style }: YoutubePlayerWrapperProps) {
  return <View style={[styles.container, { width, height }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    overflow: 'hidden',
  },
});

export default YoutubePlayerWrapper;
