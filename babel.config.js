module.exports = {
  overrides: [
    {
      exclude: /\/node_modules\//,
      presets: ['module:react-native-builder-bob/babel-preset'],
    },
    {
      include: /\/node_modules\//,
      presets: ['module:@react-native/babel-preset'],
    },
    {
      plugins: [
        [
          require.resolve('babel-plugin-module-resolver'),
          {
            root: ['./src'],
            alias: {
              '@': './src',
            },
          },
        ],
      ],
    },
  ],
};
