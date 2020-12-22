import NodePosition from "./NodePosition.js";
import GraphNode from "./GraphNode.js";
import { Link } from "./Link.js";
import ScreenPosition from "./ScreenPosition.js";

export default interface Graph {
    nodes: GraphNode[],
    links: Link[],
    screenPosition: ScreenPosition,
    initialNodePosition: NodePosition,
}