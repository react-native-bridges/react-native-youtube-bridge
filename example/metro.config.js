const path = require('node:path');
const { getDefaultConfig } = require('@expo/metro-config');

function createMonorepoMetroConfig(dirname, options = {}) {
  const projectRoot = dirname;
  const workspaceRoot = path.resolve(projectRoot, '..');
  const { extraNodeModules = {}, packageName } = options;

  const config = getDefaultConfig(projectRoot);

  config.watchFolders = [workspaceRoot];

  config.resolver.blockList = [
    ...Array.from(config.resolver.blockList ?? []),
    new RegExp(`${workspaceRoot}/node_modules/react/`),
    new RegExp(`${workspaceRoot}/node_modules/react-native/`),
  ];

  config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(workspaceRoot, 'node_modules'),
  ];

  config.resolver.extraNodeModules = {
    ...(packageName && { [packageName]: workspaceRoot }),
    ...extraNodeModules,
  };

  config.transformer.getTransformOptions = async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  });

  return config;
}

module.exports = createMonorepoMetroConfig(__dirname);
