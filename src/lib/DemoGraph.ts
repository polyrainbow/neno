import { ROOT_PATH } from "../config";
import NotesProvider from "./notes";
import { NewNoteSaveRequest } from "./notes/types/NoteSaveRequest";

export const createDemoGraph = async (
  notesProvider: NotesProvider,
): Promise<void> => {
  const DEMO_GRAPH_ASSETS_PATH = `${ROOT_PATH}assets/demo-graph-assets/`;

  const demoNoteSlugs = [
    "welcome-to-neno",
  ];

  const demoFiles = [
    "beach.jpg",
  ];

  for (const demoNoteSlug of demoNoteSlugs) {
    const response = await fetch(
      `${DEMO_GRAPH_ASSETS_PATH}${demoNoteSlug}.subtext`,
    );
    const content = await response.text();

    const noteSaveRequest: NewNoteSaveRequest = {
      note: {
        content,
        meta: {
          flags: [],
          additionalHeaders: {},
        },
      },
      ignoreDuplicateTitles: false,
      changeSlugTo: demoNoteSlug,
    };

    await notesProvider.put(noteSaveRequest);
  }

  for (const demoFile of demoFiles) {
    const response = await fetch(
      `${DEMO_GRAPH_ASSETS_PATH}files/${demoFile}`,
    );

    const readable = response.body;

    if (!readable) {
      throw new Error("Could not get readable stream");
    }

    await notesProvider.addFile(readable, "files", demoFile);
  }
};
