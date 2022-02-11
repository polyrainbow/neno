import { merge } from "webpack-merge";
import commonConfig from "./webpack.common.js";

const config = {
  mode: "development",
  watch: true,
};

export default merge(commonConfig, config);
