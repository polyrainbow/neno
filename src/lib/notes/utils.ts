import { FileInfo } from "./types/FileInfo.js";
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
    return MediaType.OTHER;
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

const toISODateTime = (date: Date): string => {
  const timeZone = -date.getTimezoneOffset();
  const dif = timeZone >= 0 ? "+" : "-";
  const pad = (num: number): string => {
    return num.toString().padStart(2, "0");
  };

  return date.getFullYear()
    + "-" + pad(date.getMonth() + 1)
    + "-" + pad(date.getDate())
    + "T" + pad(date.getHours())
    + ":" + pad(date.getMinutes())
    + ":" + pad(date.getSeconds())
    + dif + pad(Math.floor(Math.abs(timeZone) / 60))
    + ":" + pad(Math.abs(timeZone) % 60);
};


const getCurrentISODateTime = () => {
  const date = new Date();
  return toISODateTime(date);
};


const toUnixTimestamp = (date: Date): number => {
  return Math.floor(new Date(date).getTime() / 1000);
};

const getCompareKeyForTimestamp = (dateRaw: string | undefined): number => {
  if (!dateRaw) return 0;
  const date = new Date(dateRaw);
  return toUnixTimestamp(date);
};

const unixToISOTimestamp = (unixTimestamp: number) => {
  return toISODateTime(new Date(unixTimestamp));
};


const getEarliestISOTimestamp = (...timestamps: string[]): string => {
  let earliest = timestamps[0];
  let earliestUNIX = toUnixTimestamp(new Date(earliest));

  for (let i = 1; i < timestamps.length; i++) {
    const unixTimestamp = toUnixTimestamp(new Date(timestamps[i]));
    if (unixTimestamp < earliestUNIX) {
      earliest = timestamps[i];
      earliestUNIX = unixTimestamp;
    }
  }

  return earliest;
};


const getLatestISOTimestamp = (...timestamps: string[]): string => {
  let latest = timestamps[0];
  let latestUNIX = toUnixTimestamp(new Date(latest));

  for (let i = 1; i < timestamps.length; i++) {
    const unixTimestamp = toUnixTimestamp(new Date(timestamps[i]));
    if (unixTimestamp > latestUNIX) {
      latest = timestamps[i];
      latestUNIX = unixTimestamp;
    }
  }

  return latest;
};


const getArbitraryFilePath = (fileInfo: FileInfo): string => {
  const slug = fileInfo.slug;
  const lastSlashPos = slug.lastIndexOf("/");

  return lastSlashPos > -1
    ? slug.substring(0, lastSlashPos + 1) + fileInfo.filename
    : fileInfo.filename;
};

export {
  getExtensionFromFilename,
  removeExtensionFromFilename,
  getMediaTypeFromFilename,
  shortenText,
  setsAreEqual,
  getRandomKey,
  getCurrentISODateTime,
  toUnixTimestamp,
  getCompareKeyForTimestamp,
  unixToISOTimestamp,
  getEarliestISOTimestamp,
  getLatestISOTimestamp,
  getArbitraryFilePath,
};
