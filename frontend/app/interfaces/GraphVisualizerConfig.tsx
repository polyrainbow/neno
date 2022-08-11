import { NoteId } from "../../../lib/notes/interfaces/NoteId";
import BackendGraphVisualization
  from "../../../lib/notes/interfaces/GraphVisualization";

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
  initialFocusNoteId?: NoteId,
  openNote: (noteId: NoteId) => void,
}

export default GraphVisualizerConfig;
