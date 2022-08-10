const webpack = require("webpack");
// const path = require("path");

module.exports = function override(config) {
  // config.module.rules[1].oneOf[3].include = [config.module.rules[1].oneOf[3].include, path.resolve('../')]

  const fallback = config.resolve.fallback || {};

  Object.assign(fallback, {
    buffer: require.resolve("buffer"),
  });

  config.resolve.fallback = fallback;
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
  ]);

  return config;
};
