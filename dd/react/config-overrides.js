const { override, fixBabelImports, addWebpackAlias } = require('customize-cra');
const {resolve} = require("path")
// module.exports = function override(config, env) {
//   // do stuff with the webpack config...
//   return config;
// };
module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css',
  }),
  addWebpackAlias({
    '#':resolve("src")
  })
);