import GraphNodePositionUpdate from "./GraphNodePositionUpdate.js";
import { Link } from "./Link.js";
import NodePosition from "./NodePosition.js";
import ScreenPosition from "./ScreenPosition.js";

export default interface GraphFromUser {
    nodePositionUpdates: GraphNodePositionUpdate[],
    links: Link[],
    screenPosition: ScreenPosition,
    initialNodePosition: NodePosition,
}