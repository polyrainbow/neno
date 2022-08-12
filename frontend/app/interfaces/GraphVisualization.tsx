import GraphVisualizationNode
  from "../../../lib/notes/interfaces/GraphVisualizationNode";
import NodePosition from "../../../lib/notes/interfaces/NodePosition";
import ScreenPosition from "../../../lib/notes/interfaces/ScreenPosition";

/*
  In the frontend, we resolve the note ids inside the links to actual note
  objects.
*/

export enum GraphVisualizationMode {
  DEFAULT = "DEFAULT",
  NO_LABELS = "NO_LABELS",
  HUBS_ONLY = "HUBS_ONLY",
}

export type GraphVisualizationLink
  = [GraphVisualizationNode, GraphVisualizationNode];

interface GraphVisualization {
  nodes: GraphVisualizationNode[],
  links: GraphVisualizationLink[],
  screenPosition: ScreenPosition,
  initialNodePosition: NodePosition,
}

export default GraphVisualization;
