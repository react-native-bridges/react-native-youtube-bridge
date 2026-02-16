import type { ReactNode } from 'react';
import {
  type DimensionValue,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';

type YoutubeViewWrapperProps = {
  children: ReactNode;
  width?: DimensionValue;
  height?: DimensionValue;
  style?: StyleProp<ViewStyle>;
};

function YoutubeViewWrapper({ children, width, height, style }: YoutubeViewWrapperProps) {
  const safeStyles = StyleSheet.flatten([styles.container, { width, height }, style]);

  return <View style={safeStyles}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    overflow: 'hidden',
  },
});

export default YoutubeViewWrapper;
