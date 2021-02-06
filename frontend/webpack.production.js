import * as path from "path";
import * as url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default {
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
  },
  resolve: {
    // Add .ts and .tsx as a resolvable extension.
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          "ts-loader",
          path.resolve(__dirname, "ts-loader-preparation.cjs"),
        ],
      },
      {
        test: /\.js?$/,
        include: [
          path.resolve(__dirname, "app"),
        ],
        loader: "babel-loader",
        options: {
          presets: [
            "@babel/preset-react",
          ],
          plugins: [
            // we need these two plugins because webpack does not support
            // that syntax yet, even though Chrome does already.
            ["@babel/plugin-proposal-class-properties"],
            ["@babel/plugin-proposal-private-methods"],
          ],
          cacheDirectory: true,
          cacheCompression: false,
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
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
  },
  watchOptions: {
    ignored: /node_modules/,
  },
};
