export enum PathTemplate {
  UNSELECTED_NOTE = "graph/%GRAPH_ID%/note",
  EXISTING_NOTE = "graph/%GRAPH_ID%/note/%SLUG%",
  NEW_NOTE = "graph/%GRAPH_ID%/note/new",
  LIST = "graph/%GRAPH_ID%/list",
  VISUAL = "graph/%GRAPH_ID%/visual",
  VISUAL_WITH_FOCUS_NOTE
  = "graph/%GRAPH_ID%/visual?focusNote=%FOCUS_NOTE_SLUG%",
  LOGIN = "login",
  STATS = "graph/%GRAPH_ID%/stats",
  FILES = "graph/%GRAPH_ID%/files",
  FILE = "graph/%GRAPH_ID%/files/%FILE_ID%",
  SETTINGS = "settings",
}
