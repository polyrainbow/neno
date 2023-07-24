import GraphVisualizationNode
  from "../lib/notes/interfaces/GraphVisualizationNode";
import {
  BaseGraphVisualization,
} from "../lib/notes/interfaces/GraphVisualization";

/*
  In the frontend, we resolve the note ids inside the links to actual note
  objects.
*/

export enum GraphVisualizationMode {
  DEFAULT = "DEFAULT",
  NO_LABELS = "NO_LABELS",
  HUBS_ONLY = "HUBS_ONLY",
  VORONOY = "VORONOY",
  VORONOY_HUBS = "VORONOY_HUBS",
}

export type GraphVisualizationLink
  = [GraphVisualizationNode, GraphVisualizationNode];

interface GraphVisualization extends BaseGraphVisualization {
  links: GraphVisualizationLink[],
}

export default GraphVisualization;
