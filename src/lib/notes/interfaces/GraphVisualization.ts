import NodePosition from "./NodePosition.js";
import GraphNode from "./GraphVisualizationNode.js";
import { Link } from "./Link.js";
import ScreenPosition from "./ScreenPosition.js";

export interface BaseGraphVisualization {
  nodes: GraphNode[],
  screenPosition: ScreenPosition,
  initialNodePosition: NodePosition,
}

export default interface GraphVisualization extends BaseGraphVisualization {
  links: Link[],
}
