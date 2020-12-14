import GraphNodePositionUpdate from "./GraphNodePositionUpdate";
import { Link } from "./Link.js";
import ScreenPosition from "./ScreenPosition.js";

export default interface GraphFromUser {
    nodePositionUpdates: GraphNodePositionUpdate[],
    links: Link[],
    screenPosition: ScreenPosition,
};