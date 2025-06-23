module.exports = (api) => {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            'react-native-youtube-bridge': '../packages/react-native-youtube-bridge/src/index',
            '@react-native-youtube-bridge/core': '../packages/core/src/index',
            '@react-native-youtube-bridge/react': '../packages/react/src/index',
          },
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        },
      ],
    ],
  };
};
