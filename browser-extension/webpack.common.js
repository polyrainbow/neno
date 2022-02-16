import * as path from "path";
import * as url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default {
  mode: "development",
  entry: {
    popup: path.join(__dirname, "popup", "index.tsx"),
    options: path.join(__dirname, "options", "index.tsx"),
  },
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
          plugins: [],
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
  watchOptions: {
    ignored: /node_modules/,
  },
  // https://stackoverflow.com/questions/48047150/chrome-extension-compiled-by-webpack-throws-unsafe-eval-error
  devtool: "cheap-module-source-map",
  experiments: {
    topLevelAwait: true,
  },
};
