import NodePositionUpdate from "./NodePositionUpdate.js";
import { Link } from "./Link.js";
import NodePosition from "./NodePosition.js";
import ScreenPosition from "./ScreenPosition.js";

export default interface GraphVisualizationFromUser {
    nodePositionUpdates: NodePositionUpdate[],
    links: Link[],
    screenPosition: ScreenPosition,
    initialNodePosition: NodePosition,
}