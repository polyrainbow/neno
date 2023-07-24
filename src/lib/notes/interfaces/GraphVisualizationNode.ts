import NodePosition from "./NodePosition.js";
import SparseNoteInfo from "./SparseNoteInfo.js";

export default interface GraphVisualizationNode extends SparseNoteInfo {
  position: NodePosition,
}
