import BackendGraphVisualization
  from "../lib/notes/interfaces/GraphVisualization";
import { GraphVisualizationMode } from "./GraphVisualization";
import { Slug } from "../lib/notes/interfaces/Slug";

export interface HighlightDetails {
  active: boolean,
  type?: string,
  titles?: string[],
  title?: string,
}

interface GraphVisualizerConfig {
  parent: HTMLElement,
  graphObject: BackendGraphVisualization,
  onHighlight: (highlightDetails: HighlightDetails) => void,
  onChange?: () => void,
  initialFocusNoteSlug?: Slug,
  openNote: (slug: Slug) => void,
  initialMode?: GraphVisualizationMode,
}

export default GraphVisualizerConfig;
