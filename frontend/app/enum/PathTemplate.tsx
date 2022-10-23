export enum PathTemplate {
  UNSELECTED_NOTE = "graph/%GRAPH_ID%/note",
  EXISTING_NOTE = "graph/%GRAPH_ID%/note/%NOTE_ID%",
  NEW_NOTE = "graph/%GRAPH_ID%/note/new",
  LIST = "graph/%GRAPH_ID%/list",
  GRAPH = "graph/%GRAPH_ID%/visual",
  GRAPH_WITH_FOCUS_NOTE = "graph/%GRAPH_ID%/visual?focusNote=%FOCUS_NOTE_ID%",
  LOGIN = "login",
  STATS = "graph/%GRAPH_ID%/stats",
  FILES = "graph/%GRAPH_ID%/files",
  FILE = "graph/%GRAPH_ID%/files/%FILE_ID%",
  SETTINGS = "graph/%GRAPH_ID%/settings",
}
