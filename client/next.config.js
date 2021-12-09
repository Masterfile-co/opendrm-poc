const withTM = require("next-transpile-modules")(["nucypher-ts"]);

/** @type {import('next').NextConfig} */
module.exports = withTM({
  reactStrictMode: true,
  webpack(config, { isServer, dev }) {
    config.output.webassemblyModuleFilename =
      isServer && !dev ? "../static/wasm/[id].wasm" : "static/wasm/[id].wasm";
    config.experiments = { asyncWebAssembly: true };
    config.optimization.moduleIds = "named";
    return config;
  },
});
