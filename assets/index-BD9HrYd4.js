class FileSystemAccessAPIStorageProvider {
  constructor(directoryHandle) {
    this.#directoryHandle = directoryHandle;
  }
  /** **************
    PRIVATE
  ****************/
  #MAX_OPEN_FILES = 512;
  #directoryHandle;
  #descendantFolderHandles = /* @__PURE__ */ new Map();
  #jobsInProgress = 0;
  #jobPromiseQueue = [];
  /*
    Ensures that there are no more than #MAX_OPEN_FILES files opened in
    parallel, as the OS might have an upper limit (e.g. 1024 on Fedora).
    Every function that opens a file descriptor should call this
    function before starting with the main logic.
    Exceptions are functions that are not closing the file descriptor before the
    function is finished, e.g. when it is returning a Readable that can be
    read after the function is finished. We currently cannot track them.
  */
  async #scheduleJob() {
    if (this.#jobsInProgress < this.#MAX_OPEN_FILES) {
      this.#jobsInProgress++;
    } else {
      const promiseWithResolvers = Promise.withResolvers();
      this.#jobPromiseQueue.push(promiseWithResolvers);
      await promiseWithResolvers.promise;
    }
  }
  /*
    Every function that reads from or writes to a file should call this
    function after it is finished reading, or after an error occured.
  */
  #declareJobDone() {
    if (this.#jobPromiseQueue.length > 0) {
      const jobPromise = this.#jobPromiseQueue.shift();
      jobPromise.resolve();
    } else {
      this.#jobsInProgress--;
    }
  }
  async #getSubFolderHandle(folderHandle, subDirName) {
    const subDir = await folderHandle.getDirectoryHandle(
      subDirName,
      {
        create: true
      }
    );
    return subDir;
  }
  async #getDescendantFolderHandle(folderHandle, descendantFolderPath) {
    if (!descendantFolderPath) {
      return folderHandle;
    }
    if (this.#descendantFolderHandles.has(descendantFolderPath)) {
      return this.#descendantFolderHandles.get(
        descendantFolderPath
      );
    }
    const pathSegments = descendantFolderPath.length > 0 ? this.#splitPath(descendantFolderPath) : [];
    let dirHandle = folderHandle;
    for (const pathSegment of pathSegments) {
      dirHandle = await this.#getSubFolderHandle(
        dirHandle,
        pathSegment
      );
    }
    this.#descendantFolderHandles.set(descendantFolderPath, dirHandle);
    return dirHandle;
  }
  async #getDescendantFileHandle(folderHandle, filePath, create) {
    const pathSegments = this.#splitPath(filePath);
    const folderPathSegments = pathSegments.slice(0, pathSegments.length - 1);
    const filename = pathSegments[pathSegments.length - 1];
    const destinationFolderHandle = folderPathSegments.length > 0 ? await this.#getDescendantFolderHandle(
      folderHandle,
      folderPathSegments.join(this.DS)
    ) : folderHandle;
    const fileHandle = await destinationFolderHandle.getFileHandle(
      filename,
      {
        create
      }
    );
    return fileHandle;
  }
  async #getFileHandle(requestPath, create) {
    return await this.#getDescendantFileHandle(
      this.#directoryHandle,
      requestPath,
      create
    );
  }
  /** **************
    PUBLIC
  ****************/
  DS = "/";
  async writeObject(requestPath, data) {
    await this.#scheduleJob();
    try {
      const fileHandle = await this.#getFileHandle(requestPath, true);
      const writable = await fileHandle.createWritable();
      await writable.write(data);
      await writable.close();
    } finally {
      this.#declareJobDone();
    }
  }
  async renameObject(oldRequestPath, newRequestPath) {
    const oldFolder = oldRequestPath.substring(
      0,
      oldRequestPath.lastIndexOf("/")
    );
    const newFolder = newRequestPath.substring(
      0,
      newRequestPath.lastIndexOf("/")
    );
    if (oldFolder === newFolder) {
      const fileHandle = await this.#getFileHandle(oldRequestPath, true);
      const newEntryName = newRequestPath.substring(
        newRequestPath.indexOf("/") + 1
      );
      await fileHandle.move(newEntryName);
    } else {
      await this.writeObjectFromReadable(
        newRequestPath,
        await this.getReadableStream(oldRequestPath)
      );
      await this.removeObject(oldRequestPath);
    }
  }
  async writeObjectFromReadable(requestPath, readableStream) {
    await this.#scheduleJob();
    try {
      const fileHandle = await this.#getFileHandle(requestPath, true);
      const writable = await fileHandle.createWritable();
      await readableStream.pipeTo(writable);
      const size = await this.getObjectSize(requestPath);
      return size;
    } finally {
      this.#declareJobDone();
    }
  }
  async readObjectAsString(requestPath) {
    await this.#scheduleJob();
    try {
      const fileHandle = await this.#getFileHandle(requestPath, false);
      const file = await fileHandle.getFile();
      const string = await file.text();
      return string;
    } finally {
      this.#declareJobDone();
    }
  }
  async getReadableStream(requestPath, _range) {
    const fileHandle = await this.#getFileHandle(requestPath, false);
    const file = await fileHandle.getFile();
    const readable = file.stream();
    return readable;
  }
  async removeObject(requestPath) {
    const folderPath = requestPath.substring(
      0,
      requestPath.lastIndexOf(this.DS)
    );
    const dir = await this.#getDescendantFolderHandle(
      this.#directoryHandle,
      folderPath
    );
    const filename = requestPath.substring(requestPath.lastIndexOf(this.DS) + 1);
    await dir.removeEntry(filename);
  }
  async listSubDirectories(requestPath) {
    const dirHandle = await this.#getDescendantFolderHandle(
      this.#directoryHandle,
      requestPath
    );
    const values = [];
    for await (const handle of dirHandle.values()) {
      values.push(handle);
    }
    const directoryNames = values.filter((value) => value.kind === "directory").map((dirHandle2) => dirHandle2.name);
    return directoryNames;
  }
  async #getFilenamesInFolder(folderPath) {
    const dirHandle = await this.#getDescendantFolderHandle(
      this.#directoryHandle,
      folderPath
    );
    const filenames = [];
    for await (const handle of dirHandle.values()) {
      if (handle.kind === "file") {
        filenames.push(handle.name);
      } else {
        const filesInSubFolder = await this.#getFilenamesInFolder(
          this.#joinPath(folderPath, handle.name)
        );
        const requestPaths = filesInSubFolder.map((filename) => {
          return this.#joinPath(handle.name, filename);
        });
        filenames.push(...requestPaths);
      }
    }
    return filenames;
  }
  async getAllObjectNames() {
    return this.#getFilenamesInFolder("");
  }
  #joinPath(...args) {
    return args.filter((arg) => arg.length > 0).join(this.DS);
  }
  #splitPath(path) {
    return path.split(this.DS);
  }
  async getObjectSize(requestPath) {
    const fileHandle = await this.#getFileHandle(requestPath, false);
    const file = await fileHandle.getFile();
    const size = file.size;
    return size;
  }
  async #getFolderSize(folderPath) {
    const folderHandle = await this.#getDescendantFolderHandle(
      this.#directoryHandle,
      folderPath
    );
    let sum = 0;
    for await (const handle of folderHandle.values()) {
      if (handle.kind === "file") {
        const file = await handle.getFile();
        const fileSize = file.size;
        sum += fileSize;
      } else {
        const folderSize = await this.#getFolderSize(
          this.#joinPath(folderPath, handle.name)
        );
        sum += folderSize;
      }
    }
    return sum;
  }
  async getTotalSize() {
    return this.#getFolderSize("");
  }
}

var ErrorMessage = /* @__PURE__ */ ((ErrorMessage2) => {
  ErrorMessage2["GRAPH_NOT_FOUND"] = "GRAPH_NOT_FOUND";
  ErrorMessage2["NOTE_NOT_FOUND"] = "NOTE_NOT_FOUND";
  ErrorMessage2["PINNED_NOTES_NOT_FOUND"] = "PINNED_NOTES_NOT_FOUND";
  ErrorMessage2["PINNED_NOTE_NOT_FOUND"] = "PINNED_NOTE_NOT_FOUND";
  ErrorMessage2["FILE_NOT_FOUND"] = "FILE_NOT_FOUND";
  ErrorMessage2["INVALID_MIME_TYPE"] = "INVALID_MIME_TYPE";
  ErrorMessage2["SLUG_EXISTS"] = "SLUG_EXISTS";
  ErrorMessage2["INVALID_NOTE_STRUCTURE"] = "INVALID_NOTE_STRUCTURE";
  ErrorMessage2["UNAUTHORIZED"] = "UNAUTHORIZED";
  ErrorMessage2["INVALID_FILENAME_EXTENSION"] = "INVALID_FILENAME_EXTENSION";
  ErrorMessage2["NOT_SUPPORTED_BY_STORAGE_PROVIDER"] = "NOT_SUPPORTED_BY_STORAGE_PROVIDER";
  ErrorMessage2["INVALID_SLUG"] = "INVALID_SLUG";
  ErrorMessage2["INVALID_ALIAS"] = "INVALID_ALIAS";
  ErrorMessage2["ALIAS_EXISTS"] = "ALIAS_EXISTS";
  return ErrorMessage2;
})(ErrorMessage || {});

var MediaType = /* @__PURE__ */ ((MediaType2) => {
  MediaType2["IMAGE"] = "image";
  MediaType2["PDF"] = "pdf";
  MediaType2["AUDIO"] = "audio";
  MediaType2["VIDEO"] = "video";
  MediaType2["TEXT"] = "text";
  MediaType2["OTHER"] = "other";
  return MediaType2;
})(MediaType || {});

var BlockType = /* @__PURE__ */ ((BlockType2) => {
  BlockType2["PARAGRAPH"] = "paragraph";
  BlockType2["HEADING"] = "heading";
  BlockType2["UNORDERED_LIST_ITEM"] = "unordered-list-item";
  BlockType2["ORDERED_LIST_ITEM"] = "ordered-list-item";
  BlockType2["CODE"] = "code";
  BlockType2["QUOTE"] = "quote";
  BlockType2["KEY_VALUE_PAIR"] = "key-value-pair";
  BlockType2["EMPTY"] = "empty";
  return BlockType2;
})(BlockType || {});

class CharIterator {
  #chars;
  #index;
  constructor(input) {
    this.#chars = Array.from(input);
    this.#index = -1;
  }
  next() {
    this.#index++;
    const done = this.#index === this.#chars.length;
    return done ? {
      done,
      value: null
    } : {
      done,
      value: this.#chars[this.#index]
    };
  }
  peek(numberOfChars) {
    return this.#chars.slice(this.#index + 1, this.#index + 1 + numberOfChars);
  }
  peekBack(numberOfChars) {
    return this.#chars[this.#index - (numberOfChars ?? 1)];
  }
  getRest() {
    return this.#chars.slice(this.#index).join("");
  }
  charsUntil(delimiter, offset) {
    const stringToAnalyse = this.#chars.slice(this.#index + (offset ?? 0)).join("");
    const delimiterIndex = stringToAnalyse.indexOf(delimiter, 0);
    if (delimiterIndex === -1) {
      return null;
    }
    const charsUntilDelimiter = stringToAnalyse.slice(0, delimiterIndex);
    return charsUntilDelimiter;
  }
}

var SpanType = /* @__PURE__ */ ((SpanType2) => {
  SpanType2["NORMAL_TEXT"] = "NORMAL_TEXT";
  SpanType2["HYPERLINK"] = "HYPERLINK";
  SpanType2["SLASHLINK"] = "SLASHLINK";
  SpanType2["WIKILINK"] = "WIKILINK";
  return SpanType2;
})(SpanType || {});

const isWhiteSpace$1 = (string) => {
  return string.trim().length === 0;
};
const parseText = (text) => {
  const spans = [];
  const iterator = new CharIterator(text);
  let currentSpanType = null;
  let currentSpanText = "";
  while (true) {
    const step = iterator.next();
    if (step.done) {
      if (currentSpanType) {
        spans.push({
          type: currentSpanType,
          text: currentSpanText
        });
      }
      break;
    }
    const char = step.value;
    const lastChar = iterator.peekBack();
    if ((typeof lastChar !== "string" || isWhiteSpace$1(lastChar)) && char === "h" && (iterator.peek(5).join("") === "ttp:/" || iterator.peek(6).join("") === "ttps:/")) {
      if (currentSpanType) {
        spans.push({
          type: currentSpanType,
          text: currentSpanText
        });
      }
      currentSpanText = "";
      currentSpanType = SpanType.HYPERLINK;
    } else if ((typeof lastChar !== "string" || isWhiteSpace$1(lastChar)) && char === "/" && currentSpanType !== SpanType.WIKILINK && /^[\p{L}\d_]$/u.test(iterator.peek(1).join("")) && (typeof iterator.charsUntil(" ") === "string" && /^[\p{L}\d_]$/u.test(iterator.charsUntil(" ").slice(-1)) || iterator.charsUntil(" ") === null && /^[\p{L}\d_]$/u.test(iterator.getRest().slice(-1)))) {
      if (currentSpanType) {
        spans.push({
          type: currentSpanType,
          text: currentSpanText
        });
      }
      currentSpanText = "";
      currentSpanType = SpanType.SLASHLINK;
    } else if (isWhiteSpace$1(char) && currentSpanType !== SpanType.NORMAL_TEXT && currentSpanType !== SpanType.WIKILINK) {
      if (currentSpanType) {
        spans.push({
          type: currentSpanType,
          text: currentSpanText
        });
      }
      currentSpanText = "";
      currentSpanType = SpanType.NORMAL_TEXT;
    } else if (char === "[" && iterator.peek(1).join("") === "[" && iterator.getRest().includes("]]") && !iterator.charsUntil("]]", 2)?.includes("[") && !iterator.charsUntil("]]", 2)?.includes("]")) {
      if (currentSpanType) {
        spans.push({
          type: currentSpanType,
          text: currentSpanText
        });
      }
      currentSpanText = "";
      currentSpanType = SpanType.WIKILINK;
    } else if (currentSpanType === SpanType.WIKILINK && lastChar === "]" && iterator.peekBack(2) === "]") {
      spans.push({
        type: currentSpanType,
        text: currentSpanText
      });
      currentSpanText = "";
      currentSpanType = SpanType.NORMAL_TEXT;
    } else if (!currentSpanType) {
      currentSpanType = SpanType.NORMAL_TEXT;
    }
    currentSpanText += char;
  }
  return spans;
};

const HEADING_SIGIL = "#";
const CODE_SIGIL = "```";
const QUOTE_SIGIL = ">";
const parse = (input) => {
  const lines = input.replaceAll("\r", "").split("\n");
  let withinBlock = false;
  let codeBlockJustStarted = false;
  const blocks = lines.reduce(
    (blocks2, line) => {
      if (withinBlock) {
        const currentBlock = blocks2[blocks2.length - 1];
        if (currentBlock.type === BlockType.CODE) {
          if (line.trimEnd() === CODE_SIGIL) {
            withinBlock = false;
            return blocks2;
          }
          const lineValue = line.trimEnd() === "\\" + CODE_SIGIL ? line.substring(1) : line;
          if (codeBlockJustStarted) {
            currentBlock.data.code += lineValue;
            codeBlockJustStarted = false;
          } else {
            currentBlock.data.code += "\n" + lineValue;
          }
          return blocks2;
        } else {
          throw new Error(
            "Subwaytext parser: Within unknown block: " + currentBlock.type
          );
        }
      } else {
        if (line.startsWith(HEADING_SIGIL)) {
          const newBlock = {
            type: BlockType.HEADING,
            data: {
              whitespace: line.substring(1).match(/^\s*/g)?.[0] ?? "",
              text: parseText(line.substring(1).trimStart())
            }
          };
          blocks2.push(newBlock);
          return blocks2;
        } else if (/^\$[\p{L}\p{M}\d\-_]+(\s(.*)?)?$/gu.test(line)) {
          const newBlock = {
            type: BlockType.KEY_VALUE_PAIR,
            data: {
              key: line.substring(1).match(/^[^\s]+/)?.[0] ?? "",
              whitespace: line.substring(1).match(/\s+/g)?.[0] ?? "",
              value: parseText(
                Array.from(line.matchAll(/^[^\s]+\s*(.*)$/g))[0][1] ?? ""
              )
            }
          };
          blocks2.push(newBlock);
          return blocks2;
        } else if (line.startsWith("- ")) {
          const newBlock = {
            type: BlockType.UNORDERED_LIST_ITEM,
            data: {
              whitespace: line.substring(1).match(/^\s*/g)?.[0] ?? "",
              text: parseText(line.substring(1).trimStart())
            }
          };
          blocks2.push(newBlock);
          return blocks2;
        } else if (line.startsWith(QUOTE_SIGIL)) {
          const newBlock = {
            type: BlockType.QUOTE,
            data: {
              whitespace: line.substring(1).match(/^\s*/g)?.[0] ?? "",
              text: parseText(line.substring(1).trimStart())
            }
          };
          blocks2.push(newBlock);
          return blocks2;
        } else if (line.match(/^\d+\./)) {
          const index = line.match(/^\d+/)?.[0] ?? "0";
          const whitespace = line.match(/^\d+\.(\s*)/)?.[1] ?? "";
          const textString = line.match(/^\d+\.\s*(.*)/)?.[1] ?? "";
          const newBlock = {
            type: BlockType.ORDERED_LIST_ITEM,
            data: {
              index,
              whitespace,
              text: parseText(textString)
            }
          };
          blocks2.push(newBlock);
          return blocks2;
        } else if (line.startsWith(CODE_SIGIL)) {
          withinBlock = true;
          codeBlockJustStarted = true;
          const newBlock = {
            type: BlockType.CODE,
            data: {
              code: "",
              contentType: line.substring(CODE_SIGIL.length).trim(),
              whitespace: line.substring(3).match(/^\s*/g)?.[0] ?? ""
            }
          };
          blocks2.push(newBlock);
          return blocks2;
        } else if (line.trim().length === 0) {
          const newBlock = {
            type: BlockType.EMPTY,
            data: {
              whitespace: line
            }
          };
          blocks2.push(newBlock);
          return blocks2;
        } else {
          const newBlock = {
            type: BlockType.PARAGRAPH,
            data: {
              text: parseText(line)
            }
          };
          blocks2.push(newBlock);
          return blocks2;
        }
      }
    },
    []
  );
  return blocks;
};
if (
  // @ts-ignore
  typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope
) {
  onmessage = (event) => {
    const eventData = event.data;
    if (eventData.action === "PARSE_NOTES") {
      const notes = eventData.notes;
      if (!Array.isArray(notes)) {
        throw new Error(
          "Subwaytext worker: Expected an array of notes, received " + typeof notes + " instead."
        );
      }
      const notesParsed = notes.map((note) => {
        return {
          id: note.id,
          parsedContent: parse(note.content)
        };
      });
      postMessage(notesParsed);
    }
  };
}

var CanonicalNoteHeader = /* @__PURE__ */ ((CanonicalNoteHeader2) => {
  CanonicalNoteHeader2["CREATED_AT"] = "created-at";
  CanonicalNoteHeader2["UPDATED_AT"] = "updated-at";
  CanonicalNoteHeader2["FLAGS"] = "neno-flags";
  return CanonicalNoteHeader2;
})(CanonicalNoteHeader || {});

const getExtensionFromFilename = (filename) => {
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
const removeExtensionFromFilename = (filename) => {
  const posOfDot = filename.lastIndexOf(".");
  if (posOfDot === -1) {
    return filename;
  }
  return filename.substring(0, posOfDot);
};
const getMediaTypeFromFilename = (filename) => {
  const map = new Map(Object.entries({
    "png": MediaType.IMAGE,
    "jpg": MediaType.IMAGE,
    "jpeg": MediaType.IMAGE,
    "webp": MediaType.IMAGE,
    "gif": MediaType.IMAGE,
    "svg": MediaType.IMAGE,
    "pdf": MediaType.PDF,
    "wav": MediaType.AUDIO,
    "mp3": MediaType.AUDIO,
    "m4a": MediaType.AUDIO,
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
    "opml": MediaType.TEXT
  }));
  const extension = getExtensionFromFilename(filename);
  if (!extension) {
    return MediaType.OTHER;
  }
  return map.has(extension) ? map.get(extension) : MediaType.OTHER;
};
const shortenText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.trim().substring(0, maxLength) + "…";
  } else {
    return text;
  }
};
const setsAreEqual = (a, b) => {
  return a.size === b.size && [...a].every((x) => b.has(x));
};
const getRandomKey = (collection) => {
  const index = Math.floor(Math.random() * collection.size);
  let cntr = 0;
  for (const key of collection.keys()) {
    if (cntr++ === index) {
      return key;
    }
  }
  return null;
};
const toISODateTime = (date) => {
  const timeZone = -date.getTimezoneOffset();
  const dif = timeZone >= 0 ? "+" : "-";
  const pad = (num) => {
    return num.toString().padStart(2, "0");
  };
  return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate()) + "T" + pad(date.getHours()) + ":" + pad(date.getMinutes()) + ":" + pad(date.getSeconds()) + dif + pad(Math.floor(Math.abs(timeZone) / 60)) + ":" + pad(Math.abs(timeZone) % 60);
};
const getCurrentISODateTime = () => {
  const date = /* @__PURE__ */ new Date();
  return toISODateTime(date);
};
const toUnixTimestamp = (date) => {
  return Math.floor(new Date(date).getTime() / 1e3);
};
const getCompareKeyForTimestamp = (dateRaw) => {
  if (!dateRaw) return 0;
  const date = new Date(dateRaw);
  return toUnixTimestamp(date);
};
const getEarliestISOTimestamp = (...timestamps) => {
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
const getLatestISOTimestamp = (...timestamps) => {
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
const getArbitraryFilePath = (fileInfo) => {
  const slug = fileInfo.slug;
  const lastSlashPos = slug.lastIndexOf("/");
  return lastSlashPos > -1 ? slug.substring(0, lastSlashPos + 1) + fileInfo.filename : fileInfo.filename;
};

const trimSlug = (slug) => {
  return slug.replace(/^-+/, "").replace(/-+$/, "");
};
const sluggifyWikilinkText = (text) => {
  const slug = text.trim().replace(/['’]+/g, "").replace(/[^\p{L}\p{M}\d\-_/]+/gu, "-").replace(/(?<!\/)\/(?!\/)/g, "-").replace(/\/\/+/g, "/").replace(/-+/g, "-").toLowerCase();
  return trimSlug(slug);
};
const sluggifyFilename = (text) => {
  const slug = text.trim().replace(/['’]+/g, "").replace(/[^\p{L}\p{M}\d\-._]+/gu, "-").replace(/-+/g, "-").replace(/^\./g, "").toLowerCase();
  return trimSlug(slug);
};
const sluggifyNoteText = (text) => {
  const slug = text.trim().replace(/['’]+/g, "").replace(/[^\p{L}\p{M}\d\-_]+/gu, "-").replace(/-+/g, "-").toLowerCase();
  return trimSlug(slug).substring(0, 200);
};
const isValidSlug = (slug) => {
  return slug.length > 0 && slug.length <= 200 && slug.match(
    // eslint-disable-next-line @stylistic/max-len
    /^[\p{L}\p{M}\d_][\p{L}\p{M}\d\-._]*((?<!\.)\/[\p{L}\p{M}\d\-_][\p{L}\p{M}\d\-._]*)*$/u
  ) !== null && !slug.includes("..") && !slug.endsWith(".");
};
const isValidNoteSlug = (slug) => {
  return isValidSlug(slug) && !slug.includes(".");
};
const isValidSlugOrEmpty = (slug) => {
  return isValidSlug(slug) || slug.length === 0;
};
const isValidNoteSlugOrEmpty = (slug) => {
  return isValidNoteSlug(slug) || slug.length === 0;
};
const getSlugsFromInlineText = (text) => {
  return text.filter(
    (span) => {
      return span.type === SpanType.SLASHLINK || span.type === SpanType.WIKILINK;
    }
  ).map((span) => {
    if (span.type === SpanType.SLASHLINK) {
      return span.text.substring(1);
    } else {
      return sluggifyWikilinkText(span.text.substring(2, span.text.length - 2));
    }
  });
};
const createSlug = (noteContent, existingSlugs) => {
  const title = getNoteTitle(noteContent);
  let slugStem = sluggifyNoteText(title);
  let n = 1;
  if (!slugStem) {
    slugStem = "new";
  }
  while (true) {
    const showIntegerSuffix = slugStem === "new" || n > 1;
    const slug = showIntegerSuffix ? `${slugStem}-${n}` : slugStem;
    if (!existingSlugs.includes(slug)) {
      return slug;
    }
    n++;
  }
};
const getSlugAndNameForNewArbitraryFile = (namespace, originalFilename, existingSlugs) => {
  const extension = getExtensionFromFilename(originalFilename);
  const originalFilenameWithoutExtension = removeExtensionFromFilename(
    originalFilename
  );
  const sluggifiedFileStem = sluggifyFilename(originalFilenameWithoutExtension);
  let n = 1;
  while (true) {
    const showIntegerSuffix = n > 1;
    const stemWithOptionalIntegerSuffix = showIntegerSuffix ? `${sluggifiedFileStem}-${n}` : sluggifiedFileStem;
    const filename = stemWithOptionalIntegerSuffix + (extension ? (stemWithOptionalIntegerSuffix ? "." : "") + extension.trim().toLowerCase() : "");
    const slug = `${namespace}/${filename}`;
    if (!existingSlugs.has(slug)) {
      return { slug, filename };
    }
    n++;
  }
};
const getAllUsedSlugsInGraph = (graph) => {
  return new Set(graph.files.keys()).union(new Set(graph.notes.keys())).union(new Set(graph.aliases.keys()));
};
const getLastSlugSegment = (slug) => {
  const posOfLastSlash = slug.lastIndexOf("/");
  if (posOfLastSlash > -1) {
    return slug.substring(posOfLastSlash + 1);
  } else {
    return slug;
  }
};

function serializeInlineText(spans) {
  return spans.reduce((acc, span) => {
    return acc + span.text;
  }, "");
}
function serializeParagraph(block) {
  return serializeInlineText(block.data.text);
}
function serializeHeading(block) {
  return "#" + block.data.whitespace + serializeInlineText(block.data.text);
}
function serializeKeyValuePair(block) {
  return "$" + block.data.key + block.data.whitespace + serializeInlineText(block.data.value);
}
function serializeQuote(block) {
  return ">" + block.data.whitespace + serializeInlineText(block.data.text);
}
function serializeEmpty(block) {
  return block.data.whitespace;
}
function serializeCodeString(code) {
  return code.replace(/^```(.*)/gm, "\\```$1");
}
function serializeCodeBlock(block) {
  return "```" + block.data.whitespace + block.data.contentType + "\n" + serializeCodeString(block.data.code) + "\n```";
}
function serializeUnorderedListItem(block) {
  return "-" + block.data.whitespace + serializeInlineText(block.data.text);
}
function serializeOrderedListItem(block) {
  return block.data.index + "." + block.data.whitespace + serializeInlineText(block.data.text);
}
function serialize(blocks) {
  return blocks.map((block) => {
    switch (block.type) {
      case BlockType.PARAGRAPH:
        return serializeParagraph(block);
      case BlockType.HEADING:
        return serializeHeading(block);
      case BlockType.UNORDERED_LIST_ITEM:
        return serializeUnorderedListItem(block);
      case BlockType.ORDERED_LIST_ITEM:
        return serializeOrderedListItem(block);
      case BlockType.CODE:
        return serializeCodeBlock(block);
      case BlockType.QUOTE:
        return serializeQuote(block);
      case BlockType.KEY_VALUE_PAIR:
        return serializeKeyValuePair(block);
      case BlockType.EMPTY:
        return serializeEmpty(block);
    }
  }).join("\n");
}

const removeSlugFromIndexes = (graph, slug) => {
  graph.indexes.blocks.delete(slug);
  graph.indexes.outgoingLinks.delete(slug);
  graph.indexes.backlinks.delete(slug);
  graph.indexes.backlinks.forEach((backlinks) => {
    backlinks.delete(slug);
  });
};
const updateBacklinksIndex = (graph, ourSlug, ourOutgoingLinks) => {
  let ourBacklinks;
  if (graph.indexes.backlinks.has(ourSlug)) {
    ourBacklinks = graph.indexes.backlinks.get(ourSlug);
  } else {
    ourBacklinks = /* @__PURE__ */ new Set();
    graph.indexes.backlinks.set(ourSlug, ourBacklinks);
  }
  const ourAliases = getAliasesOfSlug(graph, ourSlug);
  for (const someExistingSlug of graph.notes.keys()) {
    if (someExistingSlug === ourSlug) {
      continue;
    }
    if (ourOutgoingLinks.includes(someExistingSlug)) {
      graph.indexes.backlinks.get(someExistingSlug).add(ourSlug);
    } else {
      graph.indexes.backlinks.get(someExistingSlug).delete(ourSlug);
    }
    const aliasesOfSomeExistingSlug = getAliasesOfSlug(graph, someExistingSlug);
    if (ourOutgoingLinks.some((outgoingLink) => {
      return aliasesOfSomeExistingSlug.has(outgoingLink);
    })) {
      graph.indexes.backlinks.get(someExistingSlug).add(ourSlug);
    }
    const theirOutgoingLinks = graph.indexes.outgoingLinks.get(
      someExistingSlug
    );
    if (theirOutgoingLinks.has(ourSlug) || [...ourAliases].some((alias) => {
      return theirOutgoingLinks.has(alias);
    })) {
      ourBacklinks.add(someExistingSlug);
    }
  }
};
const updateBlockIndex = (graph, existingNote) => {
  const blocks = parse(existingNote.content);
  graph.indexes.blocks.set(
    existingNote.meta.slug,
    blocks
  );
  return blocks;
};
const updateOutgoingLinksIndex = (graph, existingNote, blocks) => {
  const ourSlug = existingNote.meta.slug;
  const ourOutgoingLinks = getSlugsFromParsedNote(blocks);
  graph.indexes.outgoingLinks.set(ourSlug, new Set(ourOutgoingLinks));
  return ourOutgoingLinks;
};
const updateIndexes = (graph, existingNote) => {
  const blocks = updateBlockIndex(graph, existingNote);
  const ourOutgoingLinks = updateOutgoingLinksIndex(
    graph,
    existingNote,
    blocks
  );
  updateBacklinksIndex(graph, existingNote.meta.slug, ourOutgoingLinks);
};

const parseGraphFileHeaders = (note) => {
  const headerContentDelimiter = "\n\n";
  const headerContentDelimiterPos = note.indexOf(headerContentDelimiter);
  const headerSection = headerContentDelimiterPos > -1 ? note.substring(0, headerContentDelimiterPos) : note;
  const regex = /^:([^:]*):(.*)$/gm;
  const headers = /* @__PURE__ */ new Map();
  for (const [_match, key, value] of headerSection.matchAll(regex)) {
    headers.set(key, value);
  }
  return headers;
};
const serializeNoteHeaders = (headers) => {
  return Array.from(headers.entries()).map(([key, value]) => {
    return ":" + key + ":" + value;
  }).join("\n");
};
const canonicalHeaderKeys = /* @__PURE__ */ new Map([
  [
    CanonicalNoteHeader.CREATED_AT,
    (meta, val) => {
      meta.createdAt = val;
    }
  ],
  [
    CanonicalNoteHeader.UPDATED_AT,
    (meta, val) => {
      meta.updatedAt = val;
    }
  ],
  [
    CanonicalNoteHeader.FLAGS,
    (meta, val) => {
      meta.flags = val.trim().length > 0 ? val.trim().split(",") : [];
    }
  ]
]);
const cleanSerializedNote = (serializedNote) => {
  return serializedNote.replace(/\r/g, "");
};
const parseSerializedExistingGraphFile = (serializedNote, slug) => {
  const serializedNoteCleaned = cleanSerializedNote(serializedNote);
  const headers = parseGraphFileHeaders(serializedNoteCleaned);
  const partialMeta = {};
  const additionalHeaders = {};
  for (const [key, value] of headers.entries()) {
    if (canonicalHeaderKeys.has(key)) {
      canonicalHeaderKeys.get(key)(
        partialMeta,
        value
      );
    } else {
      additionalHeaders[key] = value;
    }
  }
  const meta = {
    slug,
    createdAt: partialMeta.createdAt,
    updatedAt: partialMeta.updatedAt,
    flags: partialMeta.flags ?? [],
    additionalHeaders
  };
  const note = {
    content: headers.size > 0 ? serializedNoteCleaned.substring(
      serializedNoteCleaned.indexOf("\n\n") + 2
    ) : serializedNoteCleaned,
    meta
  };
  return note;
};
const parseSerializedNewNote = (serializedNote) => {
  const serializedNoteCleaned = cleanSerializedNote(serializedNote);
  const headers = parseGraphFileHeaders(serializedNoteCleaned);
  const partialMeta = {};
  const additionalHeaders = {};
  for (const [key, value] of headers.entries()) {
    if (canonicalHeaderKeys.has(key)) {
      canonicalHeaderKeys.get(key)(
        partialMeta,
        value
      );
    } else {
      additionalHeaders[key] = value;
    }
  }
  const meta = {
    flags: partialMeta.flags ?? [],
    additionalHeaders
  };
  const note = {
    content: headers.size > 0 ? serializedNoteCleaned.substring(
      serializedNoteCleaned.indexOf("\n\n") + 2
    ) : serializedNoteCleaned,
    meta
  };
  return note;
};
const serializeNote = (note) => {
  const headersToSerialize = /* @__PURE__ */ new Map();
  if (note.meta.createdAt) {
    headersToSerialize.set(
      CanonicalNoteHeader.CREATED_AT,
      note.meta.createdAt.toString()
    );
  }
  if (note.meta.updatedAt) {
    headersToSerialize.set(
      CanonicalNoteHeader.UPDATED_AT,
      note.meta.updatedAt.toString()
    );
  }
  if (note.meta.flags.length > 0) {
    headersToSerialize.set(
      CanonicalNoteHeader.FLAGS,
      note.meta.flags.join(",")
    );
  }
  for (const key in note.meta.additionalHeaders) {
    if (Object.hasOwn(note.meta.additionalHeaders, key)) {
      headersToSerialize.set(key, note.meta.additionalHeaders[key]);
    }
  }
  return serializeNoteHeaders(headersToSerialize) + "\n\n" + note.content;
};
const serializeNewNote = (note) => {
  const headers = /* @__PURE__ */ new Map([
    [
      CanonicalNoteHeader.FLAGS,
      note.meta.flags.join(",")
    ]
  ]);
  return serializeNoteHeaders(headers) + "\n\n" + note.content;
};
const getNumberOfCharacters = (note) => {
  return note.content.length;
};
const removeWikilinkPunctuation = (text) => {
  return text.replace(/(\[\[)|(]])/g, "");
};
const removeHeadingSigil = (text) => {
  return text.replace(/^#+\s*/, "");
};
const removeQuoteBlockSigil = (text) => {
  return text.replace(/^>\s*/, "");
};
const getNoteTitle = (noteContent, maxLength = 800) => {
  const lines = noteContent.split("\n");
  const firstContentLine = lines.find((line) => line.trim().length > 0);
  if (!firstContentLine) {
    return "";
  }
  const textNormalized = removeWikilinkPunctuation(
    removeHeadingSigil(removeQuoteBlockSigil(firstContentLine))
  );
  const titleShortened = shortenText(textNormalized, maxLength).trim();
  return titleShortened;
};
const getOutgoingLinksToOtherNotes = (graph, slug) => {
  if (!graph.indexes.outgoingLinks.has(slug)) {
    throw new Error("Could not determine outgoing links of " + slug);
  }
  const slugs = graph.indexes.outgoingLinks.get(slug);
  const validNoteSlugs = Array.from(slugs).filter((outgoingSlug) => {
    return graph.notes.has(outgoingSlug) && outgoingSlug !== slug || graph.aliases.has(outgoingSlug) && graph.aliases.get(outgoingSlug) !== slug;
  }).map((outgoingSlug) => {
    return graph.aliases.has(outgoingSlug) ? graph.aliases.get(outgoingSlug) : outgoingSlug;
  });
  return new Set(validNoteSlugs);
};
const getAliasesOfSlug = (graph, slug) => {
  return new Set(
    Array.from(graph.aliases.entries()).filter((entry) => {
      return entry[1] === slug;
    }).map((entry) => {
      return entry[0];
    })
  );
};
const getNotePreview = (graph, slug) => {
  if (!graph.notes.has(slug)) {
    throw new Error("Could not generate note preview of " + slug);
  }
  const note = graph.notes.get(slug);
  return {
    content: note.content,
    slug,
    aliases: getAliasesOfSlug(graph, slug),
    title: getNoteTitle(note.content),
    createdAt: note.meta.createdAt,
    updatedAt: note.meta.updatedAt
  };
};
const getBacklinks = (graph, slug) => {
  const backlinkSlugs = graph.indexes.backlinks.get(slug);
  if (!backlinkSlugs) {
    throw new Error("Could not determine backlinks for slug " + slug);
  }
  return Array.from(backlinkSlugs).map((slug2) => {
    const note = graph.notes.get(slug2);
    const backlink = {
      slug: note.meta.slug,
      aliases: getAliasesOfSlug(graph, note.meta.slug),
      title: getNoteTitle(note.content),
      createdAt: note.meta.createdAt,
      updatedAt: note.meta.updatedAt
    };
    return backlink;
  });
};
const getNumberOfLinkedNotes = (graph, slug) => {
  const outgoingLinks = getOutgoingLinksToOtherNotes(graph, slug);
  const backlinks = getBacklinks(graph, slug);
  return {
    outgoing: outgoingLinks.size,
    back: backlinks.length,
    sum: outgoingLinks.size + backlinks.length
  };
};
const getNumberOfUnlinkedNotes = (graph) => {
  return Array.from(graph.notes.keys()).filter((slug) => {
    return getNumberOfLinkedNotes(graph, slug).sum === 0;
  }).length;
};
const getAllInlineSpans = (blocks) => {
  const spans = [];
  blocks.forEach((block) => {
    if (block.type === BlockType.PARAGRAPH) {
      spans.push(...block.data.text);
    } else if (block.type === BlockType.HEADING) {
      spans.push(...block.data.text);
    } else if (block.type === BlockType.QUOTE) {
      spans.push(...block.data.text);
    } else if (block.type === BlockType.ORDERED_LIST_ITEM) {
      spans.push(...block.data.text);
    } else if (block.type === BlockType.UNORDERED_LIST_ITEM) {
      spans.push(...block.data.text);
    } else if (block.type === BlockType.KEY_VALUE_PAIR) {
      spans.push(...block.data.value);
    }
  });
  return spans;
};
const getFileSlugsReferencedInNote = (graph, noteSlug) => {
  const blocks = graph.indexes.blocks.get(noteSlug);
  const allInlineSpans = getAllInlineSpans(blocks);
  const allReferencedSlugs = getSlugsFromInlineText(allInlineSpans);
  return new Set(allReferencedSlugs.filter((s) => graph.files.has(s)));
};
const getFileInfosForFilesLinkedInNote = (graph, slugOfNote) => {
  const fileSlugs = getFileSlugsReferencedInNote(graph, slugOfNote);
  return new Set(
    fileSlugs.values().map((fileSlug) => graph.files.get(fileSlug))
  );
};
const getBlocks = (note, blockIndex) => {
  const slug = note.meta.slug;
  let parsedContent = blockIndex.get(slug);
  if (!parsedContent) {
    parsedContent = parse(note.content);
    blockIndex.set(slug, parsedContent);
  }
  return parsedContent;
};
const createNoteToTransmit = async (existingNote, graph, includeParsedContent) => {
  const blocks = getBlocks(existingNote, graph.indexes.blocks);
  const noteToTransmit = {
    content: existingNote.content,
    meta: existingNote.meta,
    outgoingLinks: Array.from(
      getOutgoingLinksToOtherNotes(graph, existingNote.meta.slug)
    ).map((slug) => {
      const notePreview = getNotePreview(graph, slug);
      return notePreview;
    }),
    backlinks: getBacklinks(graph, existingNote.meta.slug),
    numberOfCharacters: getNumberOfCharacters(existingNote),
    numberOfBlocks: blocks.length,
    files: getFileInfosForFilesLinkedInNote(graph, existingNote.meta.slug),
    aliases: getAliasesOfSlug(graph, existingNote.meta.slug)
  };
  if (includeParsedContent) {
    noteToTransmit.parsedContent = blocks;
  }
  return noteToTransmit;
};
const mapInlineSpans = (blocks, mapper) => {
  return blocks.map((block) => {
    if (block.type === BlockType.PARAGRAPH) {
      block.data.text = block.data.text.map(mapper);
    } else if (block.type === BlockType.HEADING) {
      block.data.text = block.data.text.map(mapper);
    } else if (block.type === BlockType.QUOTE) {
      block.data.text = block.data.text.map(mapper);
    } else if (block.type === BlockType.ORDERED_LIST_ITEM) {
      block.data.text = block.data.text.map(mapper);
    } else if (block.type === BlockType.UNORDERED_LIST_ITEM) {
      block.data.text = block.data.text.map(mapper);
    } else if (block.type === BlockType.KEY_VALUE_PAIR) {
      block.data.value = block.data.value.map(mapper);
    }
    return block;
  });
};
const getNoteFeatures = (note, graph) => {
  const blocks = graph.indexes.blocks.get(note.meta.slug);
  const spans = getAllInlineSpans(blocks);
  const containsWeblink = spans.some((span) => span.type === SpanType.HYPERLINK);
  const containsCode = blocks.some((block) => block.type === BlockType.CODE);
  let containsImages = false;
  let containsDocuments = false;
  let containsAudio = false;
  let containsVideo = false;
  const fileInfos = getFileInfosForFilesLinkedInNote(graph, note.meta.slug);
  fileInfos.forEach((fileInfo) => {
    const mediaType = getMediaTypeFromFilename(fileInfo.filename);
    if (mediaType === MediaType.IMAGE) {
      containsImages = true;
    } else if (mediaType === MediaType.PDF) {
      containsDocuments = true;
    } else if (mediaType === MediaType.AUDIO) {
      containsAudio = true;
    } else if (mediaType === MediaType.VIDEO) {
      containsVideo = true;
    }
  });
  const features = {
    containsWeblink,
    containsCode,
    containsImages,
    containsDocuments,
    containsAudio,
    containsVideo
  };
  return features;
};
const getNumberOfFiles = (graph, noteSlug) => {
  return getFileSlugsReferencedInNote(graph, noteSlug).size;
};
const createNoteListItem = (note, graph) => {
  const noteListItem = {
    slug: note.meta.slug,
    aliases: getAliasesOfSlug(graph, note.meta.slug),
    title: getNoteTitle(note.content),
    createdAt: note.meta.createdAt,
    updatedAt: note.meta.updatedAt,
    features: getNoteFeatures(note, graph),
    linkCount: getNumberOfLinkedNotes(graph, note.meta.slug),
    numberOfCharacters: getNumberOfCharacters(note),
    numberOfFiles: getNumberOfFiles(graph, note.meta.slug)
  };
  return noteListItem;
};
const createNoteListItems = (existingNotes, graph) => {
  const noteListItems = existingNotes.map((existingNote) => {
    return createNoteListItem(
      existingNote,
      graph
    );
  });
  return noteListItems;
};
const getURLsOfNote = (noteContent) => {
  const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=,]*)/g;
  return [...noteContent.matchAll(regex)].map((match) => match[0]);
};
const changeSlugReferencesInNote = (content, oldSlug, newSlug, newSluggifiableTitle) => {
  return mapInlineSpans(content, (span) => {
    if (span.type === SpanType.SLASHLINK && span.text.substring(1) === oldSlug) {
      span.text = "/" + newSlug;
    } else if (span.type === SpanType.WIKILINK && sluggifyWikilinkText(
      span.text.substring(2, span.text.length - 2)
    ) === oldSlug) {
      span.text = "[[" + (newSluggifiableTitle ?? newSlug) + "]]";
    }
    return span;
  });
};
const getSlugsFromParsedNote = (note) => {
  const inlineSpans = getAllInlineSpans(note);
  const slugs = getSlugsFromInlineText(inlineSpans);
  return slugs;
};
const handleExistingNoteUpdate = async (noteSaveRequest, io) => {
  const graph = await io.getGraph();
  const noteFromUser = noteSaveRequest.note;
  const existingNote = graph.notes.get(noteFromUser.meta.slug) || null;
  if (existingNote === null) {
    throw new Error(ErrorMessage.NOTE_NOT_FOUND);
  }
  existingNote.content = noteFromUser.content;
  existingNote.meta.updatedAt = noteSaveRequest.disableTimestampUpdate ? noteFromUser.meta.updatedAt : getCurrentISODateTime();
  existingNote.meta.flags = noteFromUser.meta.flags;
  existingNote.meta.additionalHeaders = noteFromUser.meta.additionalHeaders;
  const canonicalSlugShouldChange = "changeSlugTo" in noteSaveRequest && typeof noteSaveRequest.changeSlugTo === "string";
  const aliasesToUpdate = /* @__PURE__ */ new Set();
  if (noteSaveRequest.aliases) {
    for (const [alias, canonicalSlug] of graph.aliases.entries()) {
      if (canonicalSlug === existingNote.meta.slug && !noteSaveRequest.aliases.has(alias)) {
        graph.aliases.delete(alias);
        const updateAliasOnDisk = !("changeSlugTo" in noteSaveRequest && typeof noteSaveRequest.changeSlugTo === "string" && noteSaveRequest.changeSlugTo === alias);
        if (updateAliasOnDisk) {
          aliasesToUpdate.add(alias);
        }
      }
    }
    noteSaveRequest.aliases.forEach((alias) => {
      if (!isValidNoteSlug(alias)) {
        throw new Error(ErrorMessage.INVALID_ALIAS);
      }
      if (alias === existingNote.meta.slug) {
        if (!canonicalSlugShouldChange) {
          throw new Error(ErrorMessage.ALIAS_EXISTS);
        }
      } else if (graph.notes.has(alias)) {
        throw new Error(ErrorMessage.SLUG_EXISTS);
      }
      if (graph.aliases.has(alias) && graph.aliases.get(alias) !== existingNote.meta.slug) {
        throw new Error(ErrorMessage.ALIAS_EXISTS);
      }
      if (graph.aliases.has(alias) && graph.aliases.get(alias) === existingNote.meta.slug) {
        return;
      }
      graph.aliases.set(alias, existingNote.meta.slug);
      aliasesToUpdate.add(alias);
    });
  }
  if ("changeSlugTo" in noteSaveRequest && typeof noteSaveRequest.changeSlugTo === "string") {
    if (!isValidNoteSlug(noteSaveRequest.changeSlugTo)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }
    if (graph.notes.has(noteSaveRequest.changeSlugTo)) {
      throw new Error(ErrorMessage.SLUG_EXISTS);
    }
    if (graph.files.has(noteSaveRequest.changeSlugTo)) {
      throw new Error(ErrorMessage.SLUG_EXISTS);
    }
    if (graph.aliases.has(noteSaveRequest.changeSlugTo)) {
      throw new Error(ErrorMessage.ALIAS_EXISTS);
    }
    const oldSlug = existingNote.meta.slug;
    const newSlug = noteSaveRequest.changeSlugTo;
    const notesReferencingOurNoteBeforeChange = Array.from(graph.indexes.backlinks.get(oldSlug)).map((slug) => {
      return graph.notes.get(slug);
    });
    graph.notes.delete(oldSlug);
    removeSlugFromIndexes(graph, oldSlug);
    let flushPins = false;
    for (let i = 0; i < graph.pinnedNotes.length; i++) {
      if (graph.pinnedNotes[i] === oldSlug) {
        graph.pinnedNotes[i] = newSlug;
        flushPins = true;
      }
    }
    const aliasesToUpdate2 = /* @__PURE__ */ new Set();
    for (const [alias, canonicalSlug] of graph.aliases.entries()) {
      if (canonicalSlug === oldSlug) {
        graph.aliases.delete(alias);
        graph.aliases.set(alias, newSlug);
        aliasesToUpdate2.add(alias);
      }
    }
    await io.flushChanges(
      graph,
      flushPins,
      /* @__PURE__ */ new Set([oldSlug]),
      aliasesToUpdate2,
      /* @__PURE__ */ new Set()
    );
    existingNote.meta.slug = newSlug;
    graph.notes.set(newSlug, existingNote);
    if ("updateReferences" in noteSaveRequest && noteSaveRequest.updateReferences) {
      updateIndexes(graph, existingNote);
      for (const thatNote of notesReferencingOurNoteBeforeChange) {
        const blocks = graph.indexes.blocks.get(
          thatNote.meta.slug
        );
        const noteTitle = getNoteTitle(existingNote.content);
        const newSluggifiableTitle = sluggifyNoteText(noteTitle) === newSlug ? noteTitle : newSlug;
        const newBlocks = changeSlugReferencesInNote(
          blocks,
          oldSlug,
          newSlug,
          newSluggifiableTitle
        );
        thatNote.content = serialize(newBlocks);
        graph.indexes.blocks.set(thatNote.meta.slug, newBlocks);
        updateIndexes(graph, thatNote);
        await io.flushChanges(
          graph,
          flushPins,
          /* @__PURE__ */ new Set([thatNote.meta.slug]),
          /* @__PURE__ */ new Set(),
          /* @__PURE__ */ new Set()
        );
      }
    }
  } else {
    graph.notes.set(existingNote.meta.slug, existingNote);
  }
  updateIndexes(graph, existingNote);
  await io.flushChanges(
    graph,
    false,
    /* @__PURE__ */ new Set([existingNote.meta.slug]),
    aliasesToUpdate,
    /* @__PURE__ */ new Set()
  );
  const noteToTransmit = await createNoteToTransmit(existingNote, graph);
  return noteToTransmit;
};
const isExistingNoteSaveRequest = (noteSaveRequest) => {
  return "slug" in noteSaveRequest.note.meta;
};
const handleNewNoteSaveRequest = async (noteSaveRequest, io) => {
  const graph = await io.getGraph();
  const noteFromUser = noteSaveRequest.note;
  const existingSlugs = [
    ...Array.from(graph.notes.keys()),
    ...Array.from(graph.aliases.keys())
  ];
  let slug;
  if ("changeSlugTo" in noteSaveRequest && typeof noteSaveRequest.changeSlugTo === "string") {
    if (!isValidNoteSlug(noteSaveRequest.changeSlugTo)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }
    if (graph.notes.has(noteSaveRequest.changeSlugTo) || graph.aliases.has(noteSaveRequest.changeSlugTo)) {
      throw new Error(ErrorMessage.SLUG_EXISTS);
    }
    if (graph.files.has(noteSaveRequest.changeSlugTo)) {
      throw new Error(ErrorMessage.SLUG_EXISTS);
    }
    slug = noteSaveRequest.changeSlugTo;
  } else {
    slug = createSlug(
      noteFromUser.content,
      existingSlugs
    );
  }
  const aliasesToUpdate = /* @__PURE__ */ new Set();
  noteSaveRequest.aliases?.forEach((alias) => {
    if (!isValidNoteSlug(alias)) {
      throw new Error(ErrorMessage.INVALID_ALIAS);
    }
    if (graph.aliases.has(alias) && graph.aliases.get(alias) !== slug) {
      throw new Error(ErrorMessage.ALIAS_EXISTS);
    }
    if (graph.notes.has(alias)) {
      throw new Error(ErrorMessage.SLUG_EXISTS);
    }
    graph.aliases.set(alias, slug);
    aliasesToUpdate.add(alias);
  });
  const newNote = {
    meta: {
      slug,
      createdAt: getCurrentISODateTime(),
      updatedAt: getCurrentISODateTime(),
      additionalHeaders: {},
      flags: noteFromUser.meta.flags
    },
    content: noteFromUser.content
  };
  graph.notes.set(slug, newNote);
  updateIndexes(graph, newNote);
  await io.flushChanges(
    graph,
    false,
    /* @__PURE__ */ new Set([newNote.meta.slug]),
    aliasesToUpdate,
    /* @__PURE__ */ new Set()
  );
  const noteToTransmit = await createNoteToTransmit(newNote, graph);
  return noteToTransmit;
};

var subwaytextWorkerUrl = "/neno/assets/index-Uf3Es3Q3.js";

class DatabaseIO {
  #storageProvider;
  #loadedGraph = null;
  #graphRetrievalInProgress = null;
  #finishedObtainingGraph = () => {
  };
  static #PINS_FILENAME = ".pins.neno";
  static #GRAPH_FILE_EXTENSION = ".subtext";
  static #ALIAS_HEADER_KEY = "alias-of";
  static #ARBITRARY_FILE_HEADER_KEY = "file";
  static #ARBITRARY_FILE_SIZE_HEADER_KEY = "size";
  // Block parsing is CPU intensive, so we use a web worker pool to parse
  // multiple notes in parallel.
  static #workerPool = [];
  // Returns the filename for a graph file with the given slug.
  static getSubtextGraphFilenameForSlug(slug) {
    if (slug.length === 0) {
      throw new Error("Cannot get filename for empty slug");
    }
    return `${slug}${DatabaseIO.#GRAPH_FILE_EXTENSION}`;
  }
  static getSlugFromGraphFilename(filename) {
    if (!filename.endsWith(DatabaseIO.#GRAPH_FILE_EXTENSION)) {
      throw new Error(
        "Filename does not end with default note filename extension"
      );
    }
    return filename.slice(0, -DatabaseIO.#GRAPH_FILE_EXTENSION.length);
  }
  static getArbitraryGraphFilepath(slug, filename) {
    const lastSlashPos = slug.lastIndexOf("/");
    return lastSlashPos > -1 ? slug.substring(0, lastSlashPos + 1) + filename : filename;
  }
  static parsePinsFile(pinsSerialized) {
    if (pinsSerialized.length === 0) {
      return [];
    }
    return pinsSerialized.split("\n");
  }
  async getGraphFilenamesFromStorageProvider() {
    const objectNames = await this.#storageProvider.getAllObjectNames();
    return objectNames.filter(
      (filename) => {
        return filename.endsWith(DatabaseIO.#GRAPH_FILE_EXTENSION) && isValidSlug(DatabaseIO.getSlugFromGraphFilename(filename));
      }
    );
  }
  async parseGraph(serializedGraphFiles, pinsSerialized) {
    const parsedNotes = /* @__PURE__ */ new Map();
    const aliases = /* @__PURE__ */ new Map();
    const files = /* @__PURE__ */ new Map();
    for (const [slug, serializedGraphFile] of serializedGraphFiles) {
      try {
        const serializedGraphFileCleaned = cleanSerializedNote(
          serializedGraphFile
        );
        const headers = parseGraphFileHeaders(serializedGraphFileCleaned);
        if (headers.has(DatabaseIO.#ALIAS_HEADER_KEY)) {
          const targetSlug = headers.get(DatabaseIO.#ALIAS_HEADER_KEY);
          aliases.set(slug, targetSlug);
        } else if (headers.has(DatabaseIO.#ARBITRARY_FILE_HEADER_KEY) && headers.has(DatabaseIO.#ARBITRARY_FILE_SIZE_HEADER_KEY)) {
          const fileInfo = {
            slug,
            size: parseInt(
              headers.get(DatabaseIO.#ARBITRARY_FILE_SIZE_HEADER_KEY)
            ),
            filename: headers.get(DatabaseIO.#ARBITRARY_FILE_HEADER_KEY),
            createdAt: headers.get("created-at")
          };
          files.set(slug, fileInfo);
        } else {
          const parsedNote = parseSerializedExistingGraphFile(
            serializedGraphFile,
            slug
          );
          parsedNotes.set(slug, parsedNote);
        }
      } catch (_e) {
        continue;
      }
    }
    let pinnedNotes;
    if (typeof pinsSerialized === "string") {
      pinnedNotes = DatabaseIO.parsePinsFile(pinsSerialized);
    } else {
      pinnedNotes = [];
      await this.writePinsFile(pinnedNotes);
    }
    const blockIndex = await DatabaseIO.createBlockIndex(
      Array.from(parsedNotes.values())
    );
    const outgoingLinkIndex = DatabaseIO.createOutgoingLinkIndex(blockIndex);
    const backlinkIndex = DatabaseIO.createBacklinkIndex(
      outgoingLinkIndex,
      new Set(parsedNotes.keys()),
      aliases
    );
    const parsedGraphObject = {
      notes: parsedNotes,
      aliases,
      files,
      pinnedNotes,
      indexes: {
        blocks: blockIndex,
        outgoingLinks: outgoingLinkIndex,
        backlinks: backlinkIndex
      }
    };
    return parsedGraphObject;
  }
  async readAndParseGraphFromDisk() {
    let pinsSerialized;
    try {
      pinsSerialized = await this.#storageProvider.readObjectAsString(
        DatabaseIO.#PINS_FILENAME
      );
    } catch (_e) {
      pinsSerialized = void 0;
    }
    const noteFilenames = await this.getGraphFilenamesFromStorageProvider();
    const serializedNotes = new Map(
      await Promise.all(
        noteFilenames.map(
          async (filename) => {
            const slug = DatabaseIO.getSlugFromGraphFilename(filename);
            const serializedNote = await this.#storageProvider.readObjectAsString(
              filename
            );
            return [slug, serializedNote];
          }
        )
      )
    );
    return this.parseGraph(serializedNotes, pinsSerialized);
  }
  /*
    The outgoing link index contains all links that are referenced in a note,
    including links to files, no matter if the link target exists or not.
  */
  static createOutgoingLinkIndex(blockIndex) {
    const outgoingLinkIndex = /* @__PURE__ */ new Map();
    for (const [slug, blocks] of blockIndex) {
      const outgoingLinks = getSlugsFromParsedNote(blocks);
      outgoingLinkIndex.set(slug, new Set(outgoingLinks));
    }
    return outgoingLinkIndex;
  }
  /*
    The backlinks index only contains slugs of existing notes that
    reference a note or one of its aliases.
  */
  static createBacklinkIndex(outgoingLinks, existingNoteSlugs, aliases) {
    const backlinkIndex = /* @__PURE__ */ new Map();
    for (const [slug, links] of outgoingLinks) {
      if (!backlinkIndex.has(slug)) {
        backlinkIndex.set(slug, /* @__PURE__ */ new Set());
      }
      for (const link of links) {
        if (existingNoteSlugs.has(link)) {
          if (!backlinkIndex.has(link)) {
            backlinkIndex.set(link, /* @__PURE__ */ new Set());
          }
          backlinkIndex.get(link).add(slug);
        }
        if (aliases.has(link)) {
          const canonicalSlug = aliases.get(link);
          if (!backlinkIndex.has(canonicalSlug)) {
            backlinkIndex.set(canonicalSlug, /* @__PURE__ */ new Set());
          }
          backlinkIndex.get(canonicalSlug).add(slug);
        }
      }
    }
    return backlinkIndex;
  }
  static createBlockIndex(notes) {
    const concurrency = navigator.hardwareConcurrency || 2;
    if (DatabaseIO.#workerPool.length === 0) {
      for (let t = 0; t < concurrency; t++) {
        const worker = new Worker(
          subwaytextWorkerUrl,
          { type: "module" }
        );
        this.#workerPool.push(worker);
      }
    }
    return new Promise((resolve, reject) => {
      const blockIndex = /* @__PURE__ */ new Map();
      for (let t = 0; t < concurrency; t++) {
        const notesPerThread = Math.ceil(notes.length / concurrency);
        const start = t * notesPerThread;
        const end = Math.min((t + 1) * notesPerThread, notes.length);
        const notesForThread = notes.slice(start, end).map((note) => {
          return {
            id: note.meta.slug,
            content: note.content
          };
        });
        const worker = DatabaseIO.#workerPool[t];
        worker.onmessage = (event) => {
          const notesParsed = event.data;
          for (const noteParsed of notesParsed) {
            blockIndex.set(noteParsed.id, noteParsed.parsedContent);
          }
          if (blockIndex.size === notes.length) {
            resolve(blockIndex);
            return;
          }
        };
        worker.onerror = (event) => {
          reject(event.error);
        };
        worker.postMessage({
          "action": "PARSE_NOTES",
          "notes": notesForThread
        });
      }
    });
  }
  async writePinsFile(pins) {
    await this.#storageProvider.writeObject(
      DatabaseIO.#PINS_FILENAME,
      pins.join("\n")
    );
  }
  /**
    PUBLIC
  **/
  constructor(config) {
    this.#storageProvider = config.storageProvider;
  }
  async getRawNote(slug) {
    const rawNote = await this.#storageProvider.readObjectAsString(
      DatabaseIO.getSubtextGraphFilenameForSlug(slug)
    );
    if (!rawNote) {
      throw new Error(ErrorMessage.GRAPH_NOT_FOUND);
    }
    return rawNote;
  }
  /*
    Retrieves the graph object. If forceDiskRead is true, the graph will be
    read from disk even if it is already loaded in memory.
    This is useful when you want to make sure you have the latest data from
    disk, e.g., after an external modification.
  */
  async getGraph(forceDiskRead = false) {
    if (this.#graphRetrievalInProgress) {
      await this.#graphRetrievalInProgress;
    }
    this.#graphRetrievalInProgress = new Promise((resolve) => {
      this.#finishedObtainingGraph = () => {
        this.#graphRetrievalInProgress = null;
        resolve();
      };
    });
    if (this.#loadedGraph && !forceDiskRead) {
      this.#finishedObtainingGraph();
      return this.#loadedGraph;
    }
    const graphFromDisk = await this.readAndParseGraphFromDisk();
    this.#loadedGraph = graphFromDisk;
    this.#finishedObtainingGraph();
    return graphFromDisk;
  }
  // flushChanges makes sure that the changes applied to the graph object are
  // written to the disk and thus are persistent. It should always be called
  // after any operation on the internal graph representation
  // has been performed.
  // Beware that "all" won't delete abandoned graph files. So if a note is to
  // be deleted, its slug must be provided explicitly.
  async flushChanges(graph, flushPins, canonicalNoteSlugsToFlush, aliasesToFlush, arbitraryFilesToFlush) {
    this.#loadedGraph = graph;
    if (canonicalNoteSlugsToFlush instanceof Set) {
      await Promise.all(
        Array.from(canonicalNoteSlugsToFlush).map(async (slug) => {
          const filename = DatabaseIO.getSubtextGraphFilenameForSlug(slug);
          if (!graph.notes.has(slug)) {
            await this.#storageProvider.removeObject(filename);
          } else {
            await this.#storageProvider.writeObject(
              filename,
              serializeNote(graph.notes.get(slug))
            );
          }
        })
      );
    } else {
      for (const [slug, note] of graph.notes) {
        const filename = DatabaseIO.getSubtextGraphFilenameForSlug(slug);
        await this.#storageProvider.writeObject(
          filename,
          serializeNote(note)
        );
      }
    }
    if (aliasesToFlush instanceof Set) {
      await Promise.all(Array.from(aliasesToFlush).map(async (alias) => {
        const filename = DatabaseIO.getSubtextGraphFilenameForSlug(alias);
        if (!graph.aliases.has(alias)) {
          await this.#storageProvider.removeObject(filename);
        } else {
          const canonicalSlug = graph.aliases.get(alias);
          await this.#storageProvider.writeObject(
            filename,
            serializeNoteHeaders(/* @__PURE__ */ new Map([[
              DatabaseIO.#ALIAS_HEADER_KEY,
              canonicalSlug
            ]]))
          );
        }
      }));
    } else {
      for (const [alias, canonicalSlug] of graph.aliases) {
        const filename = DatabaseIO.getSubtextGraphFilenameForSlug(alias);
        await this.#storageProvider.writeObject(
          filename,
          serializeNoteHeaders(/* @__PURE__ */ new Map([[
            DatabaseIO.#ALIAS_HEADER_KEY,
            canonicalSlug
          ]]))
        );
      }
    }
    if (arbitraryFilesToFlush instanceof Set) {
      await Promise.all(Array.from(arbitraryFilesToFlush).map(async (slug) => {
        const sgfFilepath = DatabaseIO.getSubtextGraphFilenameForSlug(slug);
        if (!graph.files.has(slug)) {
          await this.#storageProvider.removeObject(sgfFilepath);
        } else {
          const fileInfo = graph.files.get(slug);
          const sizeHeaderValue = fileInfo.size.toString();
          const noteHeaders = /* @__PURE__ */ new Map([
            [DatabaseIO.#ARBITRARY_FILE_HEADER_KEY, fileInfo.filename],
            [DatabaseIO.#ARBITRARY_FILE_SIZE_HEADER_KEY, sizeHeaderValue]
          ]);
          if (fileInfo.createdAt) {
            noteHeaders.set(
              CanonicalNoteHeader.CREATED_AT,
              fileInfo.createdAt?.toString()
            );
          }
          if (fileInfo.updatedAt) {
            noteHeaders.set(
              CanonicalNoteHeader.UPDATED_AT,
              fileInfo.updatedAt?.toString()
            );
          }
          const data = serializeNoteHeaders(noteHeaders);
          await this.#storageProvider.writeObject(
            sgfFilepath,
            data
          );
        }
      }));
    } else {
      for (const [slug, fileInfo] of graph.files) {
        const filename = DatabaseIO.getSubtextGraphFilenameForSlug(slug);
        const size = fileInfo.size;
        const data = serializeNoteHeaders(/* @__PURE__ */ new Map([
          [DatabaseIO.#ARBITRARY_FILE_HEADER_KEY, fileInfo.filename],
          [DatabaseIO.#ARBITRARY_FILE_SIZE_HEADER_KEY, size.toString()]
        ]));
        await this.#storageProvider.writeObject(
          filename,
          data
        );
      }
    }
    if (flushPins) {
      await this.writePinsFile(graph.pinnedNotes);
    }
  }
  /*
    Caution: We don't do any overwrite checks here. Last write wins.
  */
  async addFile(slug, source) {
    if (!isValidSlug(slug)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }
    const size = await this.#storageProvider.writeObjectFromReadable(
      slug,
      source
    );
    return size;
  }
  async moveArbitraryGraphFile(oldSlug, newSlug) {
    if (oldSlug !== newSlug) {
      await this.#storageProvider.renameObject(
        oldSlug,
        newSlug
      );
    }
  }
  async deleteArbitraryGraphFile(relativeFilePath) {
    await this.#storageProvider.removeObject(relativeFilePath);
  }
  async getReadableArbitraryGraphFileStream(slug, filename, range) {
    const filepath = DatabaseIO.getArbitraryGraphFilepath(slug, filename);
    const stream = await this.#storageProvider.getReadableStream(
      filepath,
      range
    );
    return stream;
  }
  async getFileSize(slug) {
    if (!isValidSlug(slug)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }
    const fileSize = await this.#storageProvider.getObjectSize(slug);
    return fileSize;
  }
  async getSizeOfNotes() {
    const noteFilenames = await this.getGraphFilenamesFromStorageProvider();
    const noteSizes = [];
    for (const noteFilename of noteFilenames) {
      const noteSize = await this.#storageProvider.getObjectSize(noteFilename);
      noteSizes.push(noteSize);
    }
    return noteSizes.reduce((a, b) => a + b, 0);
  }
  async getTotalStorageSize() {
    return this.#storageProvider.getTotalSize();
  }
  async graphExistsInStorage() {
    const noteFilenamesInStorage = await this.getGraphFilenamesFromStorageProvider();
    return noteFilenamesInStorage.length > 0;
  }
}

var NoteListSortMode = /* @__PURE__ */ ((NoteListSortMode2) => {
  NoteListSortMode2["CREATION_DATE_ASCENDING"] = "CREATION_DATE_ASCENDING";
  NoteListSortMode2["CREATION_DATE_DESCENDING"] = "CREATION_DATE_DESCENDING";
  NoteListSortMode2["UPDATE_DATE_ASCENDING"] = "UPDATE_DATE_ASCENDING";
  NoteListSortMode2["UPDATE_DATE_DESCENDING"] = "UPDATE_DATE_DESCENDING";
  NoteListSortMode2["TITLE_ASCENDING"] = "TITLE_ASCENDING";
  NoteListSortMode2["TITLE_DESCENDING"] = "TITLE_DESCENDING";
  NoteListSortMode2["NUMBER_OF_LINKS_ASCENDING"] = "NUMBER_OF_LINKS_ASCENDING";
  NoteListSortMode2["NUMBER_OF_LINKS_DESCENDING"] = "NUMBER_OF_LINKS_DESCENDING";
  NoteListSortMode2["NUMBER_OF_FILES_ASCENDING"] = "NUMBER_OF_FILES_ASCENDING";
  NoteListSortMode2["NUMBER_OF_FILES_DESCENDING"] = "NUMBER_OF_FILES_DESCENDING";
  NoteListSortMode2["NUMBER_OF_CHARACTERS_ASCENDING"] = "NUMBER_OF_CHARACTERS_ASCENDING";
  NoteListSortMode2["NUMBER_OF_CHARACTERS_DESCENDING"] = "NUMBER_OF_CHARACTERS_DESCENDING";
  return NoteListSortMode2;
})(NoteListSortMode || {});

const getSortKeyForTitle = (title) => {
  return title.toLowerCase().replace(/(["'.“”„‘’—\-»#*[\]/])/g, "").trim();
};
const getSortFunction = (sortMode) => {
  const sortFunctions = {
    [NoteListSortMode.CREATION_DATE_ASCENDING]: (a, b) => {
      return getCompareKeyForTimestamp(a.createdAt) - getCompareKeyForTimestamp(b.createdAt);
    },
    [NoteListSortMode.CREATION_DATE_DESCENDING]: (a, b) => {
      return getCompareKeyForTimestamp(b.createdAt) - getCompareKeyForTimestamp(a.createdAt);
    },
    [NoteListSortMode.UPDATE_DATE_ASCENDING]: (a, b) => {
      return getCompareKeyForTimestamp(a.updatedAt) - getCompareKeyForTimestamp(b.updatedAt);
    },
    [NoteListSortMode.UPDATE_DATE_DESCENDING]: (a, b) => {
      return getCompareKeyForTimestamp(b.updatedAt) - getCompareKeyForTimestamp(a.updatedAt);
    },
    [NoteListSortMode.TITLE_ASCENDING]: (a, b) => {
      const aNormalized = getSortKeyForTitle(a.title);
      const bNormalized = getSortKeyForTitle(b.title);
      return aNormalized.localeCompare(bNormalized);
    },
    [NoteListSortMode.TITLE_DESCENDING]: (a, b) => {
      const aNormalized = getSortKeyForTitle(a.title);
      const bNormalized = getSortKeyForTitle(b.title);
      return bNormalized.localeCompare(aNormalized);
    },
    [NoteListSortMode.NUMBER_OF_LINKS_ASCENDING]: (a, b) => {
      return a.linkCount.sum - b.linkCount.sum;
    },
    [NoteListSortMode.NUMBER_OF_LINKS_DESCENDING]: (a, b) => {
      return b.linkCount.sum - a.linkCount.sum;
    },
    [NoteListSortMode.NUMBER_OF_FILES_ASCENDING]: (a, b) => {
      return a.numberOfFiles - b.numberOfFiles;
    },
    [NoteListSortMode.NUMBER_OF_FILES_DESCENDING]: (a, b) => {
      return b.numberOfFiles - a.numberOfFiles;
    },
    [NoteListSortMode.NUMBER_OF_CHARACTERS_ASCENDING]: (a, b) => {
      return a.numberOfCharacters - b.numberOfCharacters;
    },
    [NoteListSortMode.NUMBER_OF_CHARACTERS_DESCENDING]: (a, b) => {
      return b.numberOfCharacters - a.numberOfCharacters;
    }
  };
  return sortFunctions[sortMode] ?? sortFunctions.UPDATE_DATE_ASCENDING;
};
const getNoteSortFunction = (sortMode) => {
  const sortFunctions = /* @__PURE__ */ new Map([
    [
      NoteListSortMode.CREATION_DATE_ASCENDING,
      (a, b) => {
        return getCompareKeyForTimestamp(a.meta.createdAt) - getCompareKeyForTimestamp(b.meta.createdAt);
      }
    ],
    [
      NoteListSortMode.CREATION_DATE_DESCENDING,
      (a, b) => {
        return getCompareKeyForTimestamp(b.meta.createdAt) - getCompareKeyForTimestamp(a.meta.createdAt);
      }
    ],
    [
      NoteListSortMode.UPDATE_DATE_ASCENDING,
      (a, b) => {
        return getCompareKeyForTimestamp(a.meta.updatedAt) - getCompareKeyForTimestamp(b.meta.updatedAt);
      }
    ],
    [
      NoteListSortMode.UPDATE_DATE_DESCENDING,
      (a, b) => {
        return getCompareKeyForTimestamp(b.meta.updatedAt) - getCompareKeyForTimestamp(a.meta.updatedAt);
      }
    ],
    [
      NoteListSortMode.NUMBER_OF_CHARACTERS_ASCENDING,
      (a, b) => {
        return a.content.length - b.content.length;
      }
    ],
    [
      NoteListSortMode.NUMBER_OF_CHARACTERS_DESCENDING,
      (a, b) => {
        return b.content.length - a.content.length;
      }
    ]
  ]);
  return sortFunctions.get(sortMode) ?? sortFunctions.get(
    NoteListSortMode.UPDATE_DATE_ASCENDING
  );
};
const breadthFirstSearch = (nodes, links, root) => {
  const queue = [];
  const discovered = [];
  discovered.push(root);
  queue.push(root);
  while (queue.length > 0) {
    const v = queue.shift();
    const connectedNodes = links.filter((link) => {
      return link[0] === v.meta.slug || link[1] === v.meta.slug;
    }).map((link) => {
      const linkedNoteId = link[0] === v.meta.slug ? link[1] : link[0];
      return nodes.find(
        (n) => n.meta.slug === linkedNoteId
      );
    }).filter((n) => {
      return n !== void 0;
    });
    for (let i = 0; i < connectedNodes.length; i++) {
      const w = connectedNodes[i];
      if (!discovered.includes(w)) {
        discovered.push(w);
        queue.push(w);
      }
    }
  }
  return discovered;
};
const getGraphLinks = (graph) => {
  return Array.from(graph.notes.keys()).reduce(
    (links, slug) => {
      if (!graph.indexes.outgoingLinks.has(slug)) {
        throw new Error(
          "Could not determine outgoing links for " + slug
        );
      }
      const linksFromThisSlug = Array.from(
        graph.indexes.outgoingLinks.get(slug)
      ).filter((targetSlug) => {
        return graph.notes.has(targetSlug) || graph.aliases.has(targetSlug);
      }).map((targetSlug) => {
        const canonicalTargetSlug = graph.aliases.get(targetSlug) ?? targetSlug;
        return [slug, canonicalTargetSlug];
      });
      return [
        ...links,
        ...linksFromThisSlug
      ];
    },
    []
  );
};
const getNumberOfComponents = (graph) => {
  const nodes = Array.from(graph.notes.values());
  const links = getGraphLinks(graph);
  let totallyDiscovered = [];
  let numberOfComponents = 0;
  let i = 0;
  while (totallyDiscovered.length < nodes.length) {
    let root = nodes[i];
    while (totallyDiscovered.includes(root)) {
      i++;
      root = nodes[i];
    }
    const inComponent = breadthFirstSearch(nodes, links, root);
    totallyDiscovered = [
      ...totallyDiscovered,
      ...inComponent
    ];
    numberOfComponents++;
    i++;
  }
  return numberOfComponents;
};
const getGraphCreationTimestamp = (graph) => {
  return getEarliestISOTimestamp(
    ...Array.from(graph.notes.values()).map((note) => note.meta.createdAt).filter((createdAt) => {
      return typeof createdAt === "string";
    })
  );
};
const getGraphUpdateTimestamp = (graph) => {
  return getLatestISOTimestamp(
    ...Array.from(graph.notes.values()).map((note) => note.meta.updatedAt).filter((createdAt) => {
      return typeof createdAt === "string";
    })
  );
};

const getNotesWithDuplicateUrls = (notes) => {
  const urlIndex = /* @__PURE__ */ new Map();
  notes.forEach((note) => {
    const urls = getURLsOfNote(note.content);
    urls.forEach((url) => {
      if (urlIndex.has(url)) {
        urlIndex.get(url).add(note);
      } else {
        urlIndex.set(url, /* @__PURE__ */ new Set([note]));
      }
    });
  });
  const duplicates = /* @__PURE__ */ new Set();
  for (const notesWithUrl of urlIndex.values()) {
    if (notesWithUrl.size > 1) {
      notesWithUrl.forEach((note) => {
        duplicates.add(note);
      });
    }
  }
  return Array.from(duplicates);
};
const getNotesWithDuplicateTitles = (notes) => {
  const titleIndex = /* @__PURE__ */ new Map();
  notes.forEach((note) => {
    const noteTitle = getNoteTitle(note.content);
    if (titleIndex.has(noteTitle)) {
      titleIndex.get(noteTitle).add(note);
    } else {
      titleIndex.set(noteTitle, /* @__PURE__ */ new Set([note]));
    }
  });
  const duplicates = /* @__PURE__ */ new Set();
  for (const notesWithOneTitle of titleIndex.values()) {
    if (notesWithOneTitle.size > 1) {
      notesWithOneTitle.forEach((note) => {
        duplicates.add(note);
      });
    }
  }
  return Array.from(duplicates);
};
const getNotesByTitle = (notes, query, caseSensitive) => {
  return notes.filter((note) => {
    const title = getNoteTitle(note.content);
    return title.toLowerCase() === query.toLowerCase();
  });
};
const getNotesWithUrl = (notes, url) => {
  return notes.filter((note) => {
    return note.content.includes(url) && !note.content[note.content.indexOf(url) + url.length]?.trim();
  });
};
const getNotesWithKeyValue = (notes, graph, key, value) => {
  return notes.filter((note) => {
    return getBlocks(note, graph.indexes.blocks).some((block) => {
      return block.type === BlockType.KEY_VALUE_PAIR && block.data.key === key && (value.length === 0 || serializeInlineText(block.data.value).includes(value));
    });
  });
};
const getNotesWithFile = (notes, graph, fileSlug) => {
  return notes.filter((note) => {
    const fileSlugs = getFileSlugsReferencedInNote(graph, note.meta.slug);
    return fileSlugs.has(fileSlug);
  });
};
const getNotesWithFlag = (notes, flag) => {
  return notes.filter((note) => {
    return note.meta.flags.includes(flag);
  });
};
const getNotesWithTitleSlugOrAliasContainingToken = (notes, token, caseSensitive, aliases) => {
  const fittingNoteSlugs = /* @__PURE__ */ new Set();
  for (const [alias, target] of aliases.entries()) {
    if (caseSensitive && alias.includes(token) || alias.includes(token.toLowerCase())) {
      fittingNoteSlugs.add(target);
    }
  }
  return Array.from(notes).filter((note) => {
    if (token.length === 0) {
      return true;
    }
    if (fittingNoteSlugs.has(note.meta.slug)) {
      return true;
    }
    if (caseSensitive) {
      return getNoteTitle(note.content).includes(token) || note.meta.slug.includes(token);
    } else {
      return getNoteTitle(note.content).toLowerCase().includes(
        token.toLowerCase()
      ) || note.meta.slug.toLowerCase().includes(token.toLowerCase());
    }
  });
};
const getNotesThatContainTokens = (notes, query, caseSensitive) => {
  const queryTokens = query.split(" ");
  return notes.filter((note) => {
    const noteContent = note.content;
    return queryTokens.every((queryToken) => {
      return caseSensitive ? noteContent.includes(queryToken) : noteContent.toLowerCase().includes(queryToken.toLowerCase());
    });
  });
};
const getNotesWithBlocksOfTypes = (notes, graph, types, notesMustContainAllBlockTypes) => {
  return notesMustContainAllBlockTypes ? notes.filter((note) => {
    return types.every((type) => {
      return getBlocks(note, graph.indexes.blocks).some((block) => block.type === type);
    });
  }) : notes.filter((note) => {
    return getBlocks(note, graph.indexes.blocks).some((block) => types.includes(block.type));
  });
};
const getNotesWithMediaTypes = (notes, graph, requiredMediaTypes, everyNoteMustContainAllMediaTypes) => {
  return everyNoteMustContainAllMediaTypes ? notes.filter((note) => {
    const files = getFileInfosForFilesLinkedInNote(graph, note.meta.slug);
    const includedMediaTypes = new Set(
      files.values().map((file) => getMediaTypeFromFilename(file.filename))
    );
    return setsAreEqual(requiredMediaTypes, includedMediaTypes);
  }) : notes.filter((note) => {
    const files = getFileInfosForFilesLinkedInNote(graph, note.meta.slug);
    const includedMediaTypes = new Set(
      files.values().map((file) => getMediaTypeFromFilename(file.filename))
    );
    return Array.from(requiredMediaTypes).some((requiredMediaType) => {
      return includedMediaTypes.has(requiredMediaType);
    });
  });
};
const getNotesWithLinkToSlug = (notes, graph, fileSlug) => {
  if (!graph.indexes.backlinks.has(fileSlug)) {
    return [];
  }
  return notes.filter((note) => {
    return graph.indexes.backlinks.get(fileSlug).has(note.meta.slug);
  });
};

const getPagedMatches = (allMatches, page, rows) => {
  const startIndex = (page - 1) * rows;
  if (allMatches.length < startIndex) {
    return [];
  } else {
    const allMatchesFromThisPageOn = allMatches.slice(startIndex);
    if (allMatchesFromThisPageOn.length > rows) {
      return allMatches.slice(startIndex, startIndex + rows);
    } else {
      return allMatchesFromThisPageOn;
    }
  }
};

const NUMBER_OF_RESULTS_PER_NOTE_LIST_PAGE = 50;

const isWhiteSpace = (string) => {
  return string.trim().length === 0;
};
const parseToken = (token) => {
  if (token.length > 1 && token.indexOf(':"') > -1 && token.lastIndexOf('"') === token.length - 1) {
    return [
      token.substring(0, token.indexOf(':"')),
      token.substring(token.indexOf(':"') + 2, token.length - 1)
    ];
  } else if (token[0] === '"' && token[token.length - 1] === '"') {
    return [
      "",
      token.substring(1, token.length - 1)
    ];
  } else if (token.includes(":")) {
    const pos = token.indexOf(":");
    return [
      token.substring(0, pos),
      token.substring(pos + 1)
    ];
  } else {
    return ["", token];
  }
};
const getRawTokensFromQueryString = (queryString) => {
  const rawTokens = [];
  const iterator = new CharIterator(queryString);
  let mode = "whitespace";
  let withinQuote = false;
  let collector = "";
  while (true) {
    const step = iterator.next();
    if (step.done) {
      if (mode === "token") {
        mode = "whitespace";
        rawTokens.push(collector);
        collector = "";
      }
      break;
    }
    const value = step.value;
    if (mode === "whitespace") {
      if (isWhiteSpace(value)) {
        continue;
      } else {
        if (value === '"') {
          withinQuote = !withinQuote;
        }
        mode = "token";
        collector += value;
      }
    } else if (mode === "token") {
      if (value === '"') {
        withinQuote = !withinQuote;
      }
      if (!withinQuote && isWhiteSpace(value)) {
        mode = "whitespace";
        rawTokens.push(collector);
        collector = "";
      } else {
        collector += value;
      }
    }
  }
  return rawTokens;
};
const parseQueryString = (queryString) => {
  return getRawTokensFromQueryString(queryString).map(parseToken);
};
const search = async (graph, query) => {
  const searchString = query.searchString || "";
  const caseSensitive = query.caseSensitive || false;
  const page = query.page ? Math.max(query.page, 1) : 1;
  const sortMode = query.sortMode || NoteListSortMode.CREATION_DATE_DESCENDING;
  const limit = query.limit || 0;
  let matchingNotes = Array.from(graph.notes.values());
  const tokens = parseQueryString(searchString);
  for (let t = 0; t < tokens.length; t++) {
    if (matchingNotes.length === 0) break;
    const [key, value] = tokens[t];
    if (key === "duplicates") {
      if (value === "url") {
        matchingNotes = getNotesWithDuplicateUrls(matchingNotes);
      } else if (value === "title") {
        matchingNotes = getNotesWithDuplicateTitles(matchingNotes);
      } else {
        matchingNotes = [];
      }
    } else if (key === "exact") {
      matchingNotes = getNotesByTitle(matchingNotes, value);
    } else if (key === "has-url") {
      matchingNotes = getNotesWithUrl(matchingNotes, value);
    } else if (key === "has-file") {
      matchingNotes = getNotesWithFile(matchingNotes, graph, value);
    } else if (key === "links-to") {
      matchingNotes = getNotesWithLinkToSlug(matchingNotes, graph, value);
    } else if (key === "has-flag") {
      matchingNotes = getNotesWithFlag(matchingNotes, value);
    } else if (key === "has-block") {
      const types = value.split("|");
      matchingNotes = getNotesWithBlocksOfTypes(matchingNotes, graph, types, false);
    } else if (key === "has-media") {
      const types = value.split("|");
      matchingNotes = getNotesWithMediaTypes(
        matchingNotes,
        graph,
        new Set(types),
        false
      );
    } else if (key === "ft") {
      matchingNotes = getNotesThatContainTokens(
        matchingNotes,
        value,
        caseSensitive
      );
    } else if (key.startsWith("$")) {
      matchingNotes = getNotesWithKeyValue(
        matchingNotes,
        graph,
        key.substring(1),
        value
      );
    } else {
      matchingNotes = getNotesWithTitleSlugOrAliasContainingToken(
        matchingNotes,
        value,
        caseSensitive,
        graph.aliases
      );
    }
  }
  const SIMPLE_SORT_MODES = [
    NoteListSortMode.CREATION_DATE_ASCENDING,
    NoteListSortMode.CREATION_DATE_DESCENDING,
    NoteListSortMode.UPDATE_DATE_ASCENDING,
    NoteListSortMode.UPDATE_DATE_DESCENDING,
    NoteListSortMode.NUMBER_OF_CHARACTERS_ASCENDING,
    NoteListSortMode.NUMBER_OF_CHARACTERS_DESCENDING
  ];
  if (SIMPLE_SORT_MODES.includes(sortMode)) {
    matchingNotes = matchingNotes.sort(getNoteSortFunction(sortMode));
    if (limit > 0 && limit < matchingNotes.length) {
      matchingNotes = matchingNotes.slice(0, limit);
    }
    const pagedMatches = getPagedMatches(
      matchingNotes,
      page,
      NUMBER_OF_RESULTS_PER_NOTE_LIST_PAGE
    );
    return {
      results: createNoteListItems(pagedMatches, graph),
      numberOfResults: matchingNotes.length
    };
  } else {
    const noteListItems = createNoteListItems(
      matchingNotes,
      graph
    ).sort(getSortFunction(sortMode));
    const pagedMatches = getPagedMatches(
      noteListItems,
      page,
      NUMBER_OF_RESULTS_PER_NOTE_LIST_PAGE
    );
    return {
      results: pagedMatches,
      numberOfResults: matchingNotes.length
    };
  }
};

class NotesProvider {
  /* STATIC */
  static getExtensionFromFilename = getExtensionFromFilename;
  static parseSerializedNewNote = parseSerializedNewNote;
  static serializeNewNote = serializeNewNote;
  static isValidSlug = isValidSlug;
  static isValidSlugOrEmpty = isValidSlugOrEmpty;
  static isValidNoteSlugOrEmpty = isValidNoteSlugOrEmpty;
  #io;
  constructor(storageProvider) {
    this.#io = new DatabaseIO({ storageProvider });
  }
  /*
    Forces re-indexing of the entire graph. This is useful when you suspect
    that the indexes are out of sync with the actual notes, e.g., after an
    external modification of the note files.
  */
  async reIndexGraph() {
    await this.#io.getGraph(true);
  }
  async get(slug, options) {
    const graph = await this.#io.getGraph();
    const canonicalSlug = graph.aliases.get(slug) || slug;
    if (!graph.notes.has(canonicalSlug)) {
      throw new Error(ErrorMessage.NOTE_NOT_FOUND);
    }
    const noteFromDB = graph.notes.get(canonicalSlug);
    const noteToTransmit = await createNoteToTransmit(
      noteFromDB,
      graph,
      options?.includeParsedContent
    );
    return noteToTransmit;
  }
  async getRandom() {
    const graph = await this.#io.getGraph();
    const noteFromDB = graph.notes.size > 0 ? graph.notes.get(getRandomKey(graph.notes)) : null;
    if (!noteFromDB) {
      throw new Error(ErrorMessage.NOTE_NOT_FOUND);
    }
    const noteToTransmit = await createNoteToTransmit(noteFromDB, graph);
    return noteToTransmit;
  }
  /*
    Returns the unparsed note as saved in the file system.
  */
  async getRawNote(slug) {
    const graph = await this.#io.getGraph();
    const canonicalSlug = graph.aliases.get(slug) || slug;
    return this.#io.getRawNote(canonicalSlug);
  }
  async getNotesList(query) {
    const graph = await this.#io.getGraph();
    return search(graph, query);
  }
  async getStats(options) {
    const graph = await this.#io.getGraph();
    const numberOfUnlinkedNotes = getNumberOfUnlinkedNotes(graph);
    const stats = {
      numberOfAllNotes: graph.notes.size,
      numberOfLinks: getGraphLinks(graph).length,
      numberOfFiles: graph.files.size,
      numberOfPins: graph.pinnedNotes.length,
      numberOfAliases: graph.aliases.size,
      numberOfUnlinkedNotes
    };
    if (options.includeMetadata) {
      stats.metadata = {
        createdAt: getGraphCreationTimestamp(graph),
        updatedAt: getGraphUpdateTimestamp(graph),
        size: {
          total: await this.#io.getTotalStorageSize(),
          notes: await this.#io.getSizeOfNotes(),
          files: Array.from(graph.files.values()).reduce((a, b) => {
            return a + b.size;
          }, 0)
        }
      };
    }
    if (options.includeAnalysis) {
      const numberOfComponents = getNumberOfComponents(graph);
      stats.analysis = {
        numberOfComponents,
        numberOfComponentsWithMoreThanOneNode: numberOfComponents - numberOfUnlinkedNotes
      };
    }
    return stats;
  }
  async put(noteSaveRequest) {
    const noteFromUser = noteSaveRequest.note;
    if (!noteFromUser || typeof noteFromUser.content !== "string") {
      throw new Error(ErrorMessage.INVALID_NOTE_STRUCTURE);
    }
    if (isExistingNoteSaveRequest(noteSaveRequest)) {
      return handleExistingNoteUpdate(
        noteSaveRequest,
        this.#io
      );
    } else {
      return handleNewNoteSaveRequest(
        noteSaveRequest,
        this.#io
      );
    }
  }
  async remove(slug) {
    const graph = await this.#io.getGraph();
    if (!graph.notes.has(slug)) {
      throw new Error(ErrorMessage.NOTE_NOT_FOUND);
    }
    graph.notes.delete(slug);
    const aliasesToRemove = /* @__PURE__ */ new Set();
    for (const [alias, canonicalSlug] of graph.aliases.entries()) {
      if (canonicalSlug === slug) {
        graph.aliases.delete(alias);
        aliasesToRemove.add(alias);
      }
    }
    let flushPins = false;
    graph.pinnedNotes = graph.pinnedNotes.filter((s) => {
      if (s === slug) {
        flushPins = true;
      }
      return s !== slug;
    });
    removeSlugFromIndexes(graph, slug);
    await this.#io.flushChanges(
      graph,
      flushPins,
      /* @__PURE__ */ new Set([slug]),
      aliasesToRemove,
      /* @__PURE__ */ new Set()
    );
  }
  #fileAdditionInProgress = null;
  #finishedAddingFile = () => {
  };
  async addFile(readable, namespace, originalFilename) {
    if (this.#fileAdditionInProgress) {
      await this.#fileAdditionInProgress;
    }
    this.#fileAdditionInProgress = new Promise((resolve) => {
      this.#finishedAddingFile = () => {
        this.#fileAdditionInProgress = null;
        resolve();
      };
    });
    try {
      const graph = await this.#io.getGraph();
      const { slug, filename } = getSlugAndNameForNewArbitraryFile(
        namespace,
        originalFilename,
        getAllUsedSlugsInGraph(graph)
      );
      const size = await this.#io.addFile(slug, readable);
      const fileInfo = {
        slug,
        filename,
        size,
        createdAt: getCurrentISODateTime(),
        updatedAt: getCurrentISODateTime()
      };
      graph.files.set(slug, fileInfo);
      await this.#io.flushChanges(
        graph,
        false,
        /* @__PURE__ */ new Set(),
        /* @__PURE__ */ new Set(),
        /* @__PURE__ */ new Set([slug])
      );
      return fileInfo;
    } finally {
      this.#finishedAddingFile();
    }
  }
  async updateFile(readable, slug) {
    const graph = await this.#io.getGraph();
    const fileInfo = graph.files.get(slug);
    if (!fileInfo) {
      throw new Error(ErrorMessage.FILE_NOT_FOUND);
    }
    const size = await this.#io.addFile(slug, readable);
    fileInfo.size = size;
    await this.#io.flushChanges(
      graph,
      false,
      /* @__PURE__ */ new Set(),
      /* @__PURE__ */ new Set(),
      /* @__PURE__ */ new Set([slug])
    );
    return fileInfo;
  }
  async renameFileSlug(oldSlug, newSlug, updateReferences) {
    const graph = await this.#io.getGraph();
    const fileInfo = graph.files.get(oldSlug);
    if (!fileInfo) {
      throw new Error(ErrorMessage.FILE_NOT_FOUND);
    }
    if (!isValidSlug(newSlug)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }
    const extension = getExtensionFromFilename(fileInfo.filename);
    if (typeof extension === "string" && !newSlug.endsWith(`.${extension}`)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }
    if (graph.notes.has(newSlug) || graph.aliases.has(newSlug) || graph.files.has(newSlug)) {
      throw new Error(ErrorMessage.SLUG_EXISTS);
    }
    await this.#io.moveArbitraryGraphFile(
      oldSlug,
      newSlug
    );
    fileInfo.updatedAt = getCurrentISODateTime();
    fileInfo.slug = newSlug;
    fileInfo.filename = getLastSlugSegment(newSlug);
    graph.files.delete(oldSlug);
    graph.files.set(newSlug, fileInfo);
    const notesThatNeedUpdate = /* @__PURE__ */ new Set();
    if (updateReferences) {
      for (const [noteSlug, outgoingLinks] of graph.indexes.outgoingLinks) {
        if (outgoingLinks.has(oldSlug)) {
          notesThatNeedUpdate.add(noteSlug);
          const note = graph.notes.get(noteSlug);
          if (!note) {
            throw new Error(
              "Note from index is undefined. This should not happen."
            );
          }
          const blocks = graph.indexes.blocks.get(
            noteSlug
          );
          const newBlocks = changeSlugReferencesInNote(
            blocks,
            oldSlug,
            newSlug,
            newSlug
          );
          note.content = serialize(newBlocks);
          graph.indexes.blocks.set(note.meta.slug, newBlocks);
          updateIndexes(graph, note);
        }
      }
    }
    await this.#io.flushChanges(
      graph,
      false,
      notesThatNeedUpdate,
      /* @__PURE__ */ new Set(),
      /* @__PURE__ */ new Set([oldSlug, newSlug])
    );
    return fileInfo;
  }
  async deleteFile(slug) {
    const graph = await this.#io.getGraph();
    if (!graph.files.has(slug)) {
      throw new Error(ErrorMessage.FILE_NOT_FOUND);
    }
    const fileInfo = graph.files.get(slug);
    const agfPath = getArbitraryFilePath(fileInfo);
    await this.#io.deleteArbitraryGraphFile(agfPath);
    graph.files.delete(slug);
    await this.#io.flushChanges(
      graph,
      false,
      /* @__PURE__ */ new Set(),
      /* @__PURE__ */ new Set(),
      /* @__PURE__ */ new Set([slug])
    );
  }
  async getFiles() {
    const graph = await this.#io.getGraph();
    return Array.from(graph.files.values());
  }
  // get files not used in any note
  async getSlugsOfDanglingFiles() {
    const graph = await this.#io.getGraph();
    const allBlocks = Array.from(graph.indexes.blocks.values()).flat();
    const allInlineSpans = getAllInlineSpans(allBlocks);
    const allUsedSlugs = getSlugsFromInlineText(allInlineSpans);
    const allUsedFileSlugs = allUsedSlugs.filter(isValidSlug);
    return Array.from(graph.files.keys()).filter((slug) => {
      return !allUsedFileSlugs.includes(slug);
    });
  }
  async getReadableArbitraryGraphFileStream(slug, range) {
    const graph = await this.#io.getGraph();
    if (!graph.files.has(slug)) {
      throw new Error(ErrorMessage.FILE_NOT_FOUND);
    }
    const filename = graph.files.get(slug).filename;
    const stream = await this.#io.getReadableArbitraryGraphFileStream(
      slug,
      filename,
      range
    );
    return stream;
  }
  async getFileInfo(slug) {
    const graph = await this.#io.getGraph();
    const fileInfo = graph.files.get(slug);
    if (!fileInfo) {
      throw new Error(ErrorMessage.FILE_NOT_FOUND);
    }
    return fileInfo;
  }
  async getPins() {
    const graph = await this.#io.getGraph();
    const pinnedNotes = (await Promise.allSettled(
      graph.pinnedNotes.map((slug) => {
        return this.get(slug);
      })
    )).filter((result) => {
      return result.status === "fulfilled";
    }).map((result) => result.value);
    return pinnedNotes;
  }
  async pin(slug) {
    const graph = await this.#io.getGraph();
    if (!graph.notes.has(slug)) {
      throw new Error(ErrorMessage.NOTE_NOT_FOUND);
    }
    const oldLength = graph.pinnedNotes.length;
    graph.pinnedNotes = Array.from(
      /* @__PURE__ */ new Set([...graph.pinnedNotes, slug])
    );
    const newLength = graph.pinnedNotes.length;
    const updatePins = oldLength !== newLength;
    await this.#io.flushChanges(
      graph,
      updatePins,
      /* @__PURE__ */ new Set(),
      /* @__PURE__ */ new Set(),
      /* @__PURE__ */ new Set()
    );
    return this.getPins();
  }
  async movePinPosition(slug, offset) {
    const graph = await this.#io.getGraph();
    const oldPins = graph.pinnedNotes;
    if (!oldPins.includes(slug)) {
      throw new Error(ErrorMessage.PINNED_NOTE_NOT_FOUND);
    }
    const oldIndex = oldPins.indexOf(slug);
    const newIndex = oldIndex + offset;
    const newPins = oldPins.toSpliced(oldIndex, 1).toSpliced(newIndex, 0, slug);
    graph.pinnedNotes = newPins;
    const updatePins = offset !== 0;
    await this.#io.flushChanges(
      graph,
      updatePins,
      /* @__PURE__ */ new Set(),
      /* @__PURE__ */ new Set(),
      /* @__PURE__ */ new Set()
    );
    return this.getPins();
  }
  async unpin(slugToRemove) {
    const graph = await this.#io.getGraph();
    let updatePins = false;
    graph.pinnedNotes = graph.pinnedNotes.filter((s) => {
      if (s === slugToRemove) {
        updatePins = true;
      }
      return s !== slugToRemove;
    });
    await this.#io.flushChanges(
      graph,
      updatePins,
      /* @__PURE__ */ new Set(),
      /* @__PURE__ */ new Set(),
      /* @__PURE__ */ new Set()
    );
    return this.getPins();
  }
  async getGraph() {
    const graph = await this.#io.getGraph();
    return graph;
  }
  async graphExistsInStorage() {
    return this.#io.graphExistsInStorage();
  }
}

globalThis.getNoteTitle = getNoteTitle;
globalThis.getAllInlineSpans = getAllInlineSpans;
globalThis.getSlugsFromInlineText = getSlugsFromInlineText;
const enabledInterfaces = /* @__PURE__ */ new Set([
  "self",
  "onmessage",
  "postMessage",
  "global",
  "globalThis",
  "console",
  "enabledInterfaces",
  "eval",
  "Array",
  "Boolean",
  "Date",
  "Function",
  "Number",
  "Object",
  "RegExp",
  "String",
  "Error",
  "EvalError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "TypeError",
  "URIError",
  "decodeURI",
  "decodeURIComponent",
  "encodeURI",
  "encodeURIComponent",
  "isFinite",
  "isNaN",
  "parseFloat",
  "parseInt",
  "Infinity",
  "JSON",
  "Math",
  "NaN",
  "undefined",
  "Map",
  "Set",
  "Promise",
  "Worker",
  // notes provider utils
  "getNoteTitle",
  "getSlugsFromInlineText",
  "getAllInlineSpans"
]);
Object.getOwnPropertyNames(globalThis).forEach(function(prop) {
  if (!enabledInterfaces.has(prop)) {
    Object.defineProperty(globalThis, prop, {
      get: function() {
        throw "Security Exception: cannot access " + prop;
      },
      configurable: false
    });
  }
});
globalThis.notesProvider = null;
globalThis.output = "";
globalThis.println = (val) => {
  globalThis.output += val + "\n";
};
let initialized = false;
onmessage = async (event) => {
  const eventData = event.data;
  if (eventData.action === "initialize") {
    const storageProvider = new FileSystemAccessAPIStorageProvider(
      eventData.folderHandle
    );
    globalThis.notesProvider = new NotesProvider(storageProvider);
    globalThis.storageProvider = storageProvider;
    initialized = true;
    postMessage({
      type: "INITIALIZED"
    });
  } else if (eventData.action === "evaluate") {
    if (!initialized) {
      postMessage({
        type: "ERROR",
        message: "Worker has not been initialized yet."
      });
      return;
    }
    globalThis.graph = await globalThis.notesProvider.getGraph();
    try {
      await Object.getPrototypeOf(
        async function() {
        }
      ).constructor(eventData.script)();
    } catch (e) {
      globalThis.println(e.toString());
    }
    postMessage({
      type: "EVALUATION_COMPLETED",
      output: globalThis.output
    });
    globalThis.output = "";
  }
};
