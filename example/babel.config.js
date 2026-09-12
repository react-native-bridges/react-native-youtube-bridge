module.exports = (api) => {
  api.cache(true);

  return {
    presets: [require.resolve('babel-preset-expo')],
  };
};
