import * as path from "path";
import * as url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default {
  entry: path.join(__dirname, "app", "index.tsx"),
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
  devServer: {
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
    allowedHosts: "all",
    static: {
      directory: __dirname,
    },
    port: 8080,
  },
  watchOptions: {
    ignored: /node_modules/,
  },
  experiments: {
    topLevelAwait: true,
  },
};
