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
const shortenText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.trim().substring(0, maxLength) + "…";
  } else {
    return text;
  }
};

var CanonicalNoteHeader = /* @__PURE__ */ ((CanonicalNoteHeader2) => {
  CanonicalNoteHeader2["CREATED_AT"] = "created-at";
  CanonicalNoteHeader2["UPDATED_AT"] = "updated-at";
  CanonicalNoteHeader2["FLAGS"] = "neno-flags";
  return CanonicalNoteHeader2;
})(CanonicalNoteHeader || {});

const cleanSerializedNote = (serializedNote) => {
  return serializedNote.replace(/\r/g, "");
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
const splitHeadersAndContent = (serializedNote) => {
  const cleaned = cleanSerializedNote(serializedNote);
  const headers = parseGraphFileHeaders(cleaned);
  const canonicalMeta = {};
  const additionalHeaders = {};
  for (const [key, value] of headers.entries()) {
    const modifier = canonicalHeaderKeys.get(key);
    if (modifier) {
      modifier(canonicalMeta, value);
    } else {
      additionalHeaders[key] = value;
    }
  }
  const content = headers.size > 0 ? cleaned.substring(cleaned.indexOf("\n\n") + 2) : cleaned;
  return { canonicalMeta, additionalHeaders, content };
};
const parseSerializedNewNote = (serializedNote) => {
  const { canonicalMeta, additionalHeaders, content } = splitHeadersAndContent(serializedNote);
  const meta = {
    flags: canonicalMeta.flags ?? [],
    additionalHeaders
  };
  return { content, meta };
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

var SpanType = /* @__PURE__ */ ((SpanType2) => {
  SpanType2["NORMAL_TEXT"] = "NORMAL_TEXT";
  SpanType2["HYPERLINK"] = "HYPERLINK";
  SpanType2["SLASHLINK"] = "SLASHLINK";
  SpanType2["WIKILINK"] = "WIKILINK";
  return SpanType2;
})(SpanType || {});

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

const isWhiteSpace = (string) => {
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
    if ((typeof lastChar !== "string" || isWhiteSpace(lastChar)) && char === "h" && (iterator.peek(5).join("") === "ttp:/" || iterator.peek(6).join("") === "ttps:/")) {
      if (currentSpanType) {
        spans.push({
          type: currentSpanType,
          text: currentSpanText
        });
      }
      currentSpanText = "";
      currentSpanType = SpanType.HYPERLINK;
    } else if ((typeof lastChar !== "string" || isWhiteSpace(lastChar)) && char === "/" && currentSpanType !== SpanType.WIKILINK && /^[\p{L}\d_]$/u.test(iterator.peek(1).join("")) && (typeof iterator.charsUntil(" ") === "string" && /^[\p{L}\d_]$/u.test(iterator.charsUntil(" ").slice(-1)) || iterator.charsUntil(" ") === null && /^[\p{L}\d_]$/u.test(iterator.getRest().slice(-1)))) {
      if (currentSpanType) {
        spans.push({
          type: currentSpanType,
          text: currentSpanText
        });
      }
      currentSpanText = "";
      currentSpanType = SpanType.SLASHLINK;
    } else if (isWhiteSpace(char) && currentSpanType !== SpanType.NORMAL_TEXT && currentSpanType !== SpanType.WIKILINK) {
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
const KEY_VALUE_PAIR_REGEX = /^\$[\p{L}\p{M}\d\-_]+(\s(.*)?)?$/u;
const ORDERED_LIST_ITEM_REGEX = /^\d+\./;
const parseHeading = (line) => ({
  type: BlockType.HEADING,
  data: {
    whitespace: line.substring(1).match(/^\s*/g)?.[0] ?? "",
    text: parseText(line.substring(1).trimStart())
  }
});
const parseKeyValuePair = (line) => ({
  type: BlockType.KEY_VALUE_PAIR,
  data: {
    key: line.substring(1).match(/^[^\s]+/)?.[0] ?? "",
    whitespace: line.substring(1).match(/\s+/g)?.[0] ?? "",
    value: parseText(
      Array.from(line.matchAll(/^[^\s]+\s*(.*)$/g))[0][1] ?? ""
    )
  }
});
const parseUnorderedListItem = (line) => ({
  type: BlockType.UNORDERED_LIST_ITEM,
  data: {
    whitespace: line.substring(1).match(/^\s*/g)?.[0] ?? "",
    text: parseText(line.substring(1).trimStart())
  }
});
const parseQuote = (line) => ({
  type: BlockType.QUOTE,
  data: {
    whitespace: line.substring(1).match(/^\s*/g)?.[0] ?? "",
    text: parseText(line.substring(1).trimStart())
  }
});
const parseOrderedListItem = (line) => ({
  type: BlockType.ORDERED_LIST_ITEM,
  data: {
    index: line.match(/^\d+/)?.[0] ?? "0",
    whitespace: line.match(/^\d+\.(\s*)/)?.[1] ?? "",
    text: parseText(line.match(/^\d+\.\s*(.*)/)?.[1] ?? "")
  }
});
const parseCode = (line) => ({
  type: BlockType.CODE,
  data: {
    code: "",
    contentType: line.substring(CODE_SIGIL.length).trim(),
    whitespace: line.substring(3).match(/^\s*/g)?.[0] ?? ""
  }
});
const parseEmpty = (line) => ({
  type: BlockType.EMPTY,
  data: { whitespace: line }
});
const parseParagraph = (line) => ({
  type: BlockType.PARAGRAPH,
  data: { text: parseText(line) }
});
const BLOCK_MATCHERS = [
  { match: (l) => l.startsWith(HEADING_SIGIL), parse: parseHeading },
  { match: (l) => KEY_VALUE_PAIR_REGEX.test(l), parse: parseKeyValuePair },
  { match: (l) => l.startsWith("- "), parse: parseUnorderedListItem },
  { match: (l) => l.startsWith(QUOTE_SIGIL), parse: parseQuote },
  {
    match: (l) => ORDERED_LIST_ITEM_REGEX.test(l),
    parse: parseOrderedListItem
  },
  { match: (l) => l.startsWith(CODE_SIGIL), parse: parseCode },
  { match: (l) => l.trim().length === 0, parse: parseEmpty }
];
const parse = (input) => {
  const lines = input.replaceAll("\r", "").split("\n");
  let withinBlock = false;
  let codeBlockJustStarted = false;
  return lines.reduce((blocks, line) => {
    if (withinBlock) {
      const currentBlock = blocks[blocks.length - 1];
      if (currentBlock.type !== BlockType.CODE) {
        throw new Error(
          "Subwaytext parser: Within unknown block: " + currentBlock.type
        );
      }
      if (line.trimEnd() === CODE_SIGIL) {
        withinBlock = false;
        return blocks;
      }
      const lineValue = line.trimEnd() === "\\" + CODE_SIGIL ? line.substring(1) : line;
      if (codeBlockJustStarted) {
        currentBlock.data.code += lineValue;
        codeBlockJustStarted = false;
      } else {
        currentBlock.data.code += "\n" + lineValue;
      }
      return blocks;
    }
    const matched = BLOCK_MATCHERS.find((m) => m.match(line));
    const newBlock = matched ? matched.parse(line) : parseParagraph(line);
    blocks.push(newBlock);
    if (newBlock.type === BlockType.CODE) {
      withinBlock = true;
      codeBlockJustStarted = true;
    }
    return blocks;
  }, []);
};
if (
  // @ts-ignore
  typeof DedicatedWorkerGlobalScope !== "undefined" && self instanceof DedicatedWorkerGlobalScope
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

function serializeInlineText(spans) {
  return spans.reduce((acc, span) => {
    return acc + span.text;
  }, "");
}

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
const getInlineSpans = (block) => {
  switch (block.type) {
    case BlockType.PARAGRAPH:
    case BlockType.HEADING:
    case BlockType.QUOTE:
    case BlockType.ORDERED_LIST_ITEM:
    case BlockType.UNORDERED_LIST_ITEM:
      return block.data.text;
    case BlockType.KEY_VALUE_PAIR:
      return block.data.value;
    default:
      return null;
  }
};
const getAllInlineSpans = (blocks) => {
  const spans = [];
  for (const block of blocks) {
    const blockSpans = getInlineSpans(block);
    if (blockSpans) spans.push(...blockSpans);
  }
  return spans;
};
const getKeyValuesFromBlocks = (blocks) => {
  const keyValues = /* @__PURE__ */ new Map();
  for (const block of blocks) {
    if (block.type === BlockType.KEY_VALUE_PAIR) {
      keyValues.set(block.data.key, serializeInlineText(block.data.value));
    }
  }
  return keyValues;
};

const trimSlug = (slug) => {
  return slug.replace(/^-+/, "").replace(/-+$/, "");
};
const INVALID_SLUG_CHARS = /[^\p{L}\p{M}\d\-_]+/gu;
const INVALID_SLUG_CHARS_KEEP_DOTS = /[^\p{L}\p{M}\d\-._]+/gu;
const INVALID_SLUG_CHARS_KEEP_SLASHES = /[^\p{L}\p{M}\d\-_/]+/gu;
const normalizeSlugBase = (text, options = {}) => {
  const invalidChars = options.keepSlashes ? INVALID_SLUG_CHARS_KEEP_SLASHES : options.keepDots ? INVALID_SLUG_CHARS_KEEP_DOTS : INVALID_SLUG_CHARS;
  return text.normalize("NFC").trim().replace(/['’]+/g, "").replace(invalidChars, "-");
};
const collapseDashesAndLowercase = (s) => {
  return trimSlug(s.replace(/-+/g, "-").toLowerCase());
};
const sluggifyWikilinkText = (text) => {
  const withSlashes = normalizeSlugBase(text, { keepSlashes: true }).replace(/(?<!\/)\/(?!\/)/g, "-").replace(/\/\/+/g, "/");
  return collapseDashesAndLowercase(withSlashes);
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
      return span.text.substring(1).normalize("NFC");
    } else {
      return sluggifyWikilinkText(span.text.substring(2, span.text.length - 2));
    }
  });
};

class NotesProviderProxy {
  /* STATIC — pure functions, no worker needed */
  static getExtensionFromFilename = getExtensionFromFilename;
  static parseSerializedNewNote = parseSerializedNewNote;
  static serializeNewNote = serializeNewNote;
  static isValidSlug = isValidSlug;
  static isValidSlugOrEmpty = isValidSlugOrEmpty;
  static isValidNoteSlugOrEmpty = isValidNoteSlugOrEmpty;
  #target;
  #pendingCalls = /* @__PURE__ */ new Map();
  #nextId = 0;
  #listeners = /* @__PURE__ */ new Set();
  constructor(target) {
    this.#target = target;
    const handler = (event) => {
      const data = event.data;
      if (!data || typeof data !== "object") return;
      if ("event" in data) {
        for (const listener of this.#listeners) {
          listener(data);
        }
        return;
      }
      const { id, result, error } = data;
      if (id === void 0) return;
      const pending = this.#pendingCalls.get(id);
      if (!pending) return;
      this.#pendingCalls.delete(id);
      if (error) {
        pending.reject(new Error(error));
      } else {
        pending.resolve(result);
      }
    };
    target.addEventListener("message", handler);
    if ("start" in target) {
      target.start();
    }
  }
  subscribe(listener) {
    this.#listeners.add(listener);
  }
  unsubscribe(listener) {
    this.#listeners.delete(listener);
  }
  #call(method, args) {
    const id = this.#nextId++;
    const transferables = [];
    for (const arg of args) {
      if (arg instanceof ReadableStream) {
        transferables.push(arg);
      }
    }
    return new Promise((resolve, reject) => {
      this.#pendingCalls.set(id, { resolve, reject });
      this.#target.postMessage(
        { id, method, args },
        transferables
      );
    });
  }
  async reIndexGraph() {
    await this.#call("reIndexGraph", []);
  }
  async get(slug, options) {
    return await this.#call("get", [slug, options]);
  }
  async getRandom() {
    return await this.#call("getRandom", []);
  }
  async getRawNote(slug) {
    return await this.#call("getRawNote", [slug]);
  }
  async getNotesList(query) {
    return await this.#call("getNotesList", [query]);
  }
  async getStats(options) {
    return await this.#call("getStats", [options]);
  }
  async put(noteSaveRequest) {
    return await this.#call("put", [noteSaveRequest]);
  }
  async remove(slug) {
    await this.#call("remove", [slug]);
  }
  async addFile(readable, namespace, originalFilename) {
    return await this.#call(
      "addFile",
      [readable, namespace, originalFilename]
    );
  }
  async updateFile(readable, slug) {
    return await this.#call("updateFile", [readable, slug]);
  }
  async renameFileSlug(oldSlug, newSlug, updateReferences) {
    return await this.#call(
      "renameFileSlug",
      [oldSlug, newSlug, updateReferences]
    );
  }
  async deleteFile(slug) {
    await this.#call("deleteFile", [slug]);
  }
  async getFiles() {
    return await this.#call("getFiles", []);
  }
  async getSlugsOfDanglingFiles() {
    return await this.#call("getSlugsOfDanglingFiles", []);
  }
  async getReadableArbitraryGraphFileStream(slug, range) {
    return await this.#call(
      "getReadableArbitraryGraphFileStream",
      [slug, range]
    );
  }
  async getFileInfo(slug) {
    return await this.#call("getFileInfo", [slug]);
  }
  async getPins() {
    return await this.#call("getPins", []);
  }
  async pin(slug) {
    return await this.#call("pin", [slug]);
  }
  async movePinPosition(slug, offset) {
    return await this.#call(
      "movePinPosition",
      [slug, offset]
    );
  }
  async unpin(slugToRemove) {
    return await this.#call("unpin", [slugToRemove]);
  }
  async getGraph() {
    return await this.#call("getGraph", []);
  }
  async graphExistsInStorage() {
    return await this.#call("graphExistsInStorage", []);
  }
  async getCommitHistory(options) {
    return await this.#call(
      "getCommitHistory",
      [options]
    );
  }
  async getCommitDiff(oid) {
    return await this.#call("getCommitDiff", [oid]);
  }
  setGitAuthor(author) {
    this.#target.postMessage({
      action: "setGitAuthor",
      author
    });
  }
}

function createModuleLoader(deps) {
  const cache = /* @__PURE__ */ new Map();
  const stack = /* @__PURE__ */ new Set();
  const use = (slug) => {
    if (stack.has(slug)) {
      return Promise.reject(
        new Error("Module cycle detected: " + slug)
      );
    }
    const cached = cache.get(slug);
    if (cached) return cached;
    stack.add(slug);
    const promise = (async () => {
      try {
        let raw;
        try {
          raw = await deps.getRawNote(slug);
        } catch {
          throw new Error(
            'Error in use() call: Slug "' + slug + '" not found'
          );
        }
        const blocks = parse(raw);
        const modBlock = blocks.find(
          (b) => b.type === BlockType.CODE && b.data.contentType.trim() === "mod"
        );
        if (!modBlock) {
          throw new Error(
            'Note "' + slug + '" has no mod block'
          );
        }
        const previous = deps.getThisNote();
        deps.setThisNote({
          slug,
          content: raw,
          blocks,
          keyValues: getKeyValuesFromBlocks(blocks)
        });
        try {
          return await deps.runModule(modBlock.data.code);
        } finally {
          deps.setThisNote(previous);
        }
      } finally {
        stack.delete(slug);
      }
    })();
    cache.set(slug, promise);
    return promise;
  };
  const reset = () => {
    cache.clear();
    stack.clear();
  };
  return { use, reset };
}

globalThis.getNoteTitle = getNoteTitle;
globalThis.getAllInlineSpans = getAllInlineSpans;
globalThis.getSlugsFromInlineText = getSlugsFromInlineText;
globalThis.sluggifyWikilinkText = sluggifyWikilinkText;
const AsyncFunction = Object.getPrototypeOf(
  async function() {
  }
).constructor;
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
  "Intl",
  "JSON",
  "Math",
  "NaN",
  "undefined",
  "Map",
  "Set",
  "Promise",
  "ReadableStream",
  "Worker",
  // notes provider utils
  "getNoteTitle",
  "getSlugsFromInlineText",
  "getAllInlineSpans",
  "sluggifyWikilinkText",
  // programmable notes
  "thisNote",
  "use"
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
globalThis.output = [];
globalThis.print = (val, padStart, padEnd, padString) => {
  let value = val;
  if (padStart !== void 0) value = value.padStart(padStart, padString);
  if (padEnd !== void 0) value = value.padEnd(padEnd, padString);
  globalThis.output.push({ type: "text", value });
};
globalThis.println = (val) => {
  globalThis.output.push({ type: "text", value: (val ?? "") + "\n" });
};
globalThis.printNoteTitle = (title, padStart, padEnd, padString) => {
  if (padStart !== void 0 && title.length < padStart) {
    globalThis.output.push({
      type: "text",
      value: "".padStart(padStart - title.length, padString)
    });
  }
  globalThis.output.push({
    type: "noteLink",
    title,
    slug: sluggifyWikilinkText(title)
  });
  if (padEnd !== void 0 && title.length < padEnd) {
    globalThis.output.push({
      type: "text",
      value: "".padEnd(padEnd - title.length, padString)
    });
  }
};
const moduleLoader = createModuleLoader({
  getRawNote: (slug) => globalThis.notesProvider.getRawNote(slug),
  runModule: (code) => new AsyncFunction(code)(),
  getThisNote: () => globalThis.thisNote,
  setThisNote: (note) => {
    globalThis.thisNote = note;
  }
});
globalThis.use = moduleLoader.use;
let initialized = false;
onmessage = async (event) => {
  const eventData = event.data;
  if (eventData.action === "initialize") {
    const port = event.ports[0];
    globalThis.notesProvider = new NotesProviderProxy(port);
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
    moduleLoader.reset();
    globalThis.graph = await globalThis.notesProvider.getGraph();
    if (eventData.noteContent !== void 0) {
      const blocks = parse(eventData.noteContent);
      globalThis.thisNote = {
        slug: eventData.noteSlug || "",
        content: eventData.noteContent,
        blocks,
        keyValues: getKeyValuesFromBlocks(blocks)
      };
    }
    try {
      await new AsyncFunction(eventData.script)();
    } catch (e) {
      globalThis.println(e.toString());
    }
    postMessage({
      type: "EVALUATION_COMPLETED",
      output: globalThis.output
    });
    globalThis.output = [];
  }
};
