/*eslint-env node */

module.exports = {
  mode: "production",
  node: false,
  optimization: {
    concatenateModules: false,
    minimize: false,
    namedModules: true,
  },
  entry: "./src/background.js",
  output: {
    path: __dirname,
    filename: "background.js"
  }
};
