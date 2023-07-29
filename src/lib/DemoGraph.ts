import { ROOT_PATH } from "../config";

export const createDemoGraph = async (
  folderHandle: FileSystemDirectoryHandle,
): Promise<void> => {
  const DEMO_GRAPH_PATH = `${ROOT_PATH}assets/demo-graph/`;

  const demoNoteSlugs = [
    "welcome-to-neno",
    "i-like-pizza",
    "2023-07-27",
  ];

  const demoFiles = [
    "9f6917da-9396-4e6f-b683-d117505ee5a7.jpg",
  ];

  for (const demoNoteSlug of demoNoteSlugs) {
    const response = await fetch(
      `${DEMO_GRAPH_PATH}${demoNoteSlug}.subtext`,
    );

    const readable = response.body;

    const fileHandle = await folderHandle.getFileHandle(
      demoNoteSlug + ".subtext",
      { create: true },
    );

    const writable = await fileHandle.createWritable();

    if (!readable) {
      throw new Error("Could not get readable stream");
    }

    await readable.pipeTo(writable);
  }

  const filesDir
    = await folderHandle.getDirectoryHandle("files", { create: true });

  for (const demoFile of demoFiles) {
    const response = await fetch(
      `${DEMO_GRAPH_PATH}files/${demoFile}`,
    );

    const readable = response.body;

    const fileHandle = await filesDir.getFileHandle(
      demoFile,
      { create: true },
    );

    const writable = await fileHandle.createWritable();

    if (!readable) {
      throw new Error("Could not get readable stream");
    }

    await readable.pipeTo(writable);
  }

  const response = await fetch(
    `${DEMO_GRAPH_PATH}.graph.json`,
  );

  const readable = response.body;

  if (!readable) {
    throw new Error("Could not get readable stream");
  }

  const fileHandle = await folderHandle.getFileHandle(
    ".graph.json",
    { create: true },
  );

  const writable = await fileHandle.createWritable();

  await readable.pipeTo(writable);
};

export const folderHasGraph = async (
  folderHandle: FileSystemDirectoryHandle,
): Promise<boolean> => {
  try {
    await folderHandle.getFileHandle(".graph.json");
    return true;
  } catch (error) {
    return false;
  }
};
