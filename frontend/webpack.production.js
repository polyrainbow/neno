const path = require("path");

module.exports = {
  mode: "production",
  entry: path.join(__dirname, "app", "index.js"),
  output: {
    // `filename` provides a template for naming your bundles (remember to use
    // `[name]`)
    filename: "[name].bundle.js",
    // `chunkFilename` provides a template for naming code-split bundles
    // (optional)
    chunkFilename: "[name].bundle.js",
    // `path` is the folder where Webpack will place your bundles
    path: path.resolve(__dirname, "assets"),
    // `publicPath` is where Webpack will load your bundles from (optional)
    publicPath: "/assets/",
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        include: [
          path.resolve(__dirname, "app"),
          path.resolve(__dirname, "app", "lib"),
          path.resolve(__dirname, "..", "node_modules", "react"),
        ],
        loader: "babel-loader",
        options: {
          presets: [
            [
              "@babel/preset-react", {},
            ],
          ],
          plugins: [
            [
              "@babel/plugin-proposal-object-rest-spread",
              { useBuiltIns: true },
            ],
            ["transform-es2017-object-entries"],
            ["@babel/plugin-proposal-optional-chaining"],
          ],
          cacheDirectory: true,
          cacheCompression: false,
        },
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
    disableHostCheck: true,
    contentBase: __dirname,
    publicPath: "/assets/",
  },
  watchOptions: {
    ignored: /node_modules/,
  },
};
