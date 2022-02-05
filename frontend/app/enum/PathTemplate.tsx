export enum PathTemplate {
  EDITOR = "editor",
  EDITOR_WITH_NOTE = "editor/%NOTE_ID%",
  EDITOR_WITH_NEW_NOTE = "editor/new",
  LIST = "list",
  GRAPH = "graph",
  GRAPH_WITH_FOCUS_NOTE = "graph?focusNote=%FOCUS_NOTE_ID%",
  LOGIN = "login",
  STATS = "stats",
  FILES = "files",
  FILE = "files/%FILE_ID%",
}
