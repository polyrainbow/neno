import NodePosition from "./NodePosition.js";
import GraphNode from "./GraphVisualizationNode.js";
import { Link } from "./Link.js";
import ScreenPosition from "./ScreenPosition.js";

export default interface GraphVisualization {
  nodes: GraphNode[],
  links: Link[],
  screenPosition: ScreenPosition,
  initialNodePosition: NodePosition,
}