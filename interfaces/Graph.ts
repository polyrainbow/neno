import DatabaseNote from "./DatabaseNote";
import GraphNode from "./GraphNode";
import { Link } from "./Link";
import ScreenPosition from "./ScreenPosition";

export default interface Graph {
    nodes: GraphNode[],
    links: Link[],
    screenPosition: ScreenPosition,
};