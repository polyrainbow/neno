import { merge } from "webpack-merge";
import commonConfig from "./webpack.common.js";

const config = {
  mode: "production",
};

export default merge(commonConfig, config);
