import { serializeNoteHeaders } from "../noteUtils";
import { CanonicalNoteHeader } from "../types/CanonicalNoteHeader";
import { FileInfo } from "../types/FileInfo";
import { Slug } from "../types/Slug";
import StorageProvider from "../types/StorageProvider";

const createPinsFile = async (
  pinnedNotes: Slug[],
  storageProvider: StorageProvider,
) => {
  await storageProvider.writeObject(".pins.neno", pinnedNotes.join("\n"));
};

const getSidecarFileContent = (fileInfo: FileInfo): string => {
  const headers = new Map<string, string>([
    ["size", fileInfo.size.toString()],
    ["file", fileInfo.slug],
  ]);

  if (fileInfo.createdAt) {
    headers.set(CanonicalNoteHeader.CREATED_AT, fileInfo.createdAt);
  }

  return serializeNoteHeaders(headers);
};

const createSidecarFiles = async (
  fileInfos: FileInfo[],
  storageProvider: StorageProvider,
) => {
  for (const fileInfo of fileInfos) {
    const sidecarFileContent = getSidecarFileContent(fileInfo);
    await storageProvider.writeObject(
      fileInfo.slug + ".subtext",
      sidecarFileContent,
    );
  }
};

export default async (storageProvider: StorageProvider): Promise<void> => {
  const METADATA_FILENAME = ".graph.json";
  try {
    const metadataFile = await storageProvider.readObjectAsString(
      METADATA_FILENAME,
    );
    const metadata = JSON.parse(metadataFile);

    if (metadata.version === "5") {
      await createPinsFile(metadata.pinnedNotes, storageProvider);
      await createSidecarFiles(metadata.files, storageProvider);
      await storageProvider.removeObject(METADATA_FILENAME);
    }
  // eslint-disable-next-line no-empty
  } catch (_e) {}
};
