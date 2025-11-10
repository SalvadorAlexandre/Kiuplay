const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const { resolve } = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Adiciona a regra para corrigir o import.meta.url nos módulos da essentia.js
   // --- ADICIONE ESTA NOVA REGRA ---
  config.module.rules.push({
    test: /\.js$/,
    // Use 'exclude' para garantir que não atrapalhe seus próprios arquivos
    exclude: /node_modules\/(?!essentia.js\/)/, 
    use: {
      loader: 'import-meta-webpack-loader',
    }
  });

  // Se você tiver uma regra para seus próprios workers (como tentamos antes), 
  // pode mantê-la ou usar a abordagem new URL().

  return config;
};