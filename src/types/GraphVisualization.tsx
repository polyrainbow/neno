import GraphVisualizationNode
  from "../lib/notes/interfaces/GraphVisualizationNode";
import {
  BaseGraphVisualization,
} from "../lib/notes/interfaces/GraphVisualization";

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
