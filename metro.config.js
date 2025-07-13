const { getDefaultConfig } = require('expo/metro-config'); // Para Expo
// const { getDefaultConfig } = require('metro-config'); // Para React Native CLI puro
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
// ou @type {import('metro-config').MetroConfig} para React Native CLI
const config = getDefaultConfig(__dirname);

// Mapeia 'tslib' para sua versão ES6
const ALIASES = {
  'tslib': path.resolve(__dirname, "node_modules/tslib/tslib.es6.js"),
};

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Se o módulo for 'tslib', usa o alias, caso contrário, usa a resolução padrão
  return context.resolveRequest(
    context,
    ALIASES[moduleName] ?? moduleName,
    platform
  );
};

module.exports = config;