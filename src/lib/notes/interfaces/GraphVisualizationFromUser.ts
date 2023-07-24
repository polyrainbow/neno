import NodePositionUpdate from "./NodePositionUpdate.js";
import NodePosition from "./NodePosition.js";
import ScreenPosition from "./ScreenPosition.js";

export default interface GraphVisualizationFromUser {
  nodePositionUpdates: NodePositionUpdate[],
  screenPosition: ScreenPosition,
  initialNodePosition: NodePosition,
}
