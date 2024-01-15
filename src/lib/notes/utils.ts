import { MediaType } from "./types/MediaType.js";

const getExtensionFromFilename = (filename: string): string | null => {
  const posOfDot = filename.lastIndexOf(".");
  if (posOfDot === -1) {
    return null;
  }

  const extension = filename.substring(posOfDot + 1).toLowerCase();
  if (extension.length === 0) {
    return null;
  }

  return extension;
};


const removeExtensionFromFilename = (filename: string): string => {
  const posOfDot = filename.lastIndexOf(".");
  if (posOfDot === -1) {
    return filename;
  }

  return filename.substring(0, posOfDot);
};


const getMediaTypeFromFilename = (
  filename: string,
): MediaType => {
  const map = new Map<string, MediaType>(Object.entries({
    "png": MediaType.IMAGE,
    "jpg": MediaType.IMAGE,
    "jpeg": MediaType.IMAGE,
    "webp": MediaType.IMAGE,
    "gif": MediaType.IMAGE,
    "svg": MediaType.IMAGE,

    "pdf": MediaType.PDF,

    "wav": MediaType.AUDIO,
    "mp3": MediaType.AUDIO,
    "ogg": MediaType.AUDIO,
    "flac": MediaType.AUDIO,

    "mp4": MediaType.VIDEO,
    "webm": MediaType.VIDEO,

    "html": MediaType.TEXT,
    "css": MediaType.TEXT,
    "js": MediaType.TEXT,
    "json": MediaType.TEXT,
    "c": MediaType.TEXT,
    "cpp": MediaType.TEXT,
    "rs": MediaType.TEXT,
    "txt": MediaType.TEXT,
    "md": MediaType.TEXT,
    "xq": MediaType.TEXT,
    "xql": MediaType.TEXT,
    "xqm": MediaType.TEXT,
    "opml": MediaType.TEXT,
  }));

  const extension = getExtensionFromFilename(filename);
  if (!extension) {
    return MediaType.TEXT;
  }

  return map.has(extension)
    ? map.get(extension) as MediaType
    : MediaType.OTHER;
};


const shortenText = (text: string, maxLength: number): string => {
  if (text.length > maxLength) {
    return text.trim().substring(0, maxLength) + "…";
  } else {
    return text;
  }
};


const setsAreEqual = <T>(a: Set<T>, b: Set<T>) => {
  return a.size === b.size
    && [...a].every((x) => b.has(x));
};

// returns random key from Set or Map
const getRandomKey = <K>(collection: Map<K, unknown>): K | null => {
  const index = Math.floor(Math.random() * collection.size);
  let cntr = 0;
  for (const key of collection.keys()) {
    if (cntr++ === index) {
      return key;
    }
  }
  return null;
};

export {
  getExtensionFromFilename,
  removeExtensionFromFilename,
  getMediaTypeFromFilename,
  shortenText,
  setsAreEqual,
  getRandomKey,
};
