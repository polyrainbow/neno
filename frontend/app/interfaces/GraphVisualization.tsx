import GraphVisualizationNode
  from "../../../lib/notes/interfaces/GraphVisualizationNode";
import NodePosition from "../../../lib/notes/interfaces/NodePosition";
import ScreenPosition from "../../../lib/notes/interfaces/ScreenPosition";

/*
  In the frontend, we resolve the note ids inside the links to actual note
  objects.
*/

export type GraphVisualizationLink
  = [GraphVisualizationNode, GraphVisualizationNode];

interface GraphVisualization {
  nodes: GraphVisualizationNode[],
  links: GraphVisualizationLink[],
  screenPosition: ScreenPosition,
  initialNodePosition: NodePosition,
}

export default GraphVisualization;
