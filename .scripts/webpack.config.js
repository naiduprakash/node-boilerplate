const webpack = require("webpack");
const path = require("path");
const copy = require("copy-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

module.exports = () => {
  return {
    mode: "production",
    entry: ["babel-polyfill", path.join(__dirname, "../app.js")],
    output: {
      path: path.resolve(__dirname, `../dist`),
      publicPath: "/",
      filename: `server.js`,
    },
    target: "node",
    node: {
      // Need this when working with express, otherwise the build fails
      __dirname: false, // if you don't put this is, __dirname
      __filename: false, // and __filename return blank or /
    },
    externals: [nodeExternals()], // Need this to avoid error when working with Express
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loaders: ["babel-loader", "eslint-loader"],
        },
      ],
    },
    plugins: [
      new webpack.ProgressPlugin(),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
        noInfo: false,
      }),
      new copy([
        {
          from: `./.scripts/.env.${process.env.BUILD_ENV}`,
          to: `../dist/.env`,
          toType: "file",
        },
        {
          from: `./.scripts/private.key`,
          to: `../dist/.scripts/private.key`,
          toType: "file",
        },
        {
          from: `./.scripts/public.key`,
          to: `../dist/.scripts/public.key`,
          toType: "file",
        },
      ]),
    ],
  };
};
