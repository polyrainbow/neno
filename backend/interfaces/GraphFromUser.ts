import DatabaseNote from "./DatabaseNote";
import GraphNodePositionUpdate from "./GraphNodePositionUpdate";
import { Link } from "./Link.js";
import ScreenPosition from "./ScreenPosition.js";

export default interface GraphFromUser {
    nodes: GraphNodePositionUpdate[],
    links: Link[],
    screenPosition: ScreenPosition,
};