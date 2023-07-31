function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = []
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
import { j as jsxRuntimeExports, R as React, r as reactExports, s as set, g as get, u as useNavigate, a as useLocation, P as ParagraphNode, b as addClassNamesToElement, $ as $applyNodeReplacement, D as DecoratorNode, c as useLexicalComposerContext, A as AutoLinkNode, m as mergeRegister, T as TextNode, d as $isAutoLinkNode, e as $isLinkNode, f as $createAutoLinkNode, h as $createTextNode, i as $isTextNode, k as $isElementNode, l as $isLineBreakNode, n as $getSelection, o as $isRangeSelection, p as useLexicalTextEntity, q as $createParagraphNode, t as $isParagraphNode, v as DELETE_CHARACTER_COMMAND, C as COMMAND_PRIORITY_EDITOR, w as DELETE_WORD_COMMAND, x as DELETE_LINE_COMMAND, y as CONTROLLED_TEXT_INSERTION_COMMAND, z as $insertDataTransferForPlainText, B as REMOVE_TEXT_COMMAND, I as INSERT_LINE_BREAK_COMMAND, S as SELECT_ALL_COMMAND, E as $selectAll, F as INSERT_PARAGRAPH_COMMAND, K as KEY_ARROW_LEFT_COMMAND, G as $shouldOverrideDefaultCharacterSelection, H as $moveCharacter, J as KEY_ARROW_RIGHT_COMMAND, L as KEY_BACKSPACE_COMMAND, M as KEY_DELETE_COMMAND, N as KEY_ENTER_COMMAND, O as COPY_COMMAND, Q as CUT_COMMAND, U as PASTE_COMMAND, V as DROP_COMMAND, W as DRAGSTART_COMMAND, X as reactDomExports, Y as RootNode, Z as $setCompositionKey, _ as LineBreakNode, a0 as $isRootNode, a1 as $getRoot, a2 as CLEAR_HISTORY_COMMAND, a3 as LexicalComposer, a4 as ContentEditable, a5 as LexicalErrorBoundary, a6 as OnChangePlugin, a7 as HistoryPlugin, a8 as NodeEventPlugin, a9 as Link, aa as useParams, ab as useSearchParams, ac as createBrowserRouter, ad as Navigate, ae as RouterProvider, af as createRoot } from './vendor-CLDlbTh4.js';

true&&(function polyfill() {
    const relList = document.createElement('link').relList;
    if (relList && relList.supports && relList.supports('modulepreload')) {
        return;
    }
    for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
        processPreload(link);
    }
    new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type !== 'childList') {
                continue;
            }
            for (const node of mutation.addedNodes) {
                if (node.tagName === 'LINK' && node.rel === 'modulepreload')
                    processPreload(node);
            }
        }
    }).observe(document, { childList: true, subtree: true });
    function getFetchOpts(link) {
        const fetchOpts = {};
        if (link.integrity)
            fetchOpts.integrity = link.integrity;
        if (link.referrerPolicy)
            fetchOpts.referrerPolicy = link.referrerPolicy;
        if (link.crossOrigin === 'use-credentials')
            fetchOpts.credentials = 'include';
        else if (link.crossOrigin === 'anonymous')
            fetchOpts.credentials = 'omit';
        else
            fetchOpts.credentials = 'same-origin';
        return fetchOpts;
    }
    function processPreload(link) {
        if (link.ep)
            // ep marker = processed
            return;
        link.ep = true;
        // prepopulate the load record
        const fetchOpts = getFetchOpts(link);
        fetch(link.href, fetchOpts);
    }
}());

const Overlay = ({
  onClick,
  children
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      onClick,
      className: "overlay",
      children
    }
  );
};

const Dialog = ({
  children,
  onClickOnOverlay,
  className
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Overlay,
    {
      onClick: onClickOnOverlay,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "dialog",
        {
          className: "dialog-box " + (className ?? ""),
          onClick: (e) => e.stopPropagation(),
          children
        }
      )
    }
  );
};

const DialogActionBar = ({ children }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "dialog-action-bar",
      children
    }
  );
};

const ConfirmationDialog = ({
  params,
  onConfirm,
  onCancel
}) => {
  if (!params)
    return null;
  const {
    text,
    confirmText,
    cancelText,
    encourageConfirmation
  } = params;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Dialog,
    {
      onClickOnOverlay: onCancel,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "dialog-text",
            children: text
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogActionBar, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: onConfirm,
              autoFocus: encourageConfirmation,
              className: "default-button dialog-box-button " + (encourageConfirmation ? "default-action" : "dangerous-action"),
              children: confirmText
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: onCancel,
              autoFocus: !encourageConfirmation,
              className: "default-button dialog-box-button " + (!encourageConfirmation ? "default-action" : ""),
              children: cancelText
            }
          )
        ] })
      ]
    }
  );
};

const ConfirmationServiceContext = React.createContext(null);

const ConfirmationServiceProvider = ({
  children
}) => {
  const [
    confirmationState,
    setConfirmationState
  ] = React.useState(null);
  const awaitingPromiseRef = React.useRef();
  const openConfirmation = (params) => {
    setConfirmationState(params);
    return new Promise((resolve, reject) => {
      awaitingPromiseRef.current = { resolve, reject };
    });
  };
  const handleCancel = () => {
    if (!confirmationState) {
      return;
    }
    setConfirmationState(null);
  };
  const handleConfirm = () => {
    if (awaitingPromiseRef.current) {
      awaitingPromiseRef.current.resolve();
    }
    setConfirmationState(null);
  };
  reactExports.useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Escape") {
        handleCancel();
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [confirmationState]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmationDialog,
      {
        params: confirmationState,
        onConfirm: handleConfirm,
        onCancel: handleCancel
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmationServiceContext.Provider,
      {
        value: openConfirmation,
        children
      }
    )
  ] });
};

const UnsavedChangesContext = reactExports.createContext(
  [false, null]
);

const AppMenuContext = reactExports.createContext(
  null
);

var PathTemplate = /* @__PURE__ */ ((PathTemplate2) => {
  PathTemplate2["UNSELECTED_NOTE"] = "graph/%GRAPH_ID%/note";
  PathTemplate2["EXISTING_NOTE"] = "graph/%GRAPH_ID%/note/%SLUG%";
  PathTemplate2["NEW_NOTE"] = "graph/%GRAPH_ID%/note/new";
  PathTemplate2["LIST"] = "graph/%GRAPH_ID%/list";
  PathTemplate2["START"] = "start";
  PathTemplate2["STATS"] = "graph/%GRAPH_ID%/stats";
  PathTemplate2["FILES"] = "graph/%GRAPH_ID%/files";
  PathTemplate2["FILE"] = "graph/%GRAPH_ID%/files/%FILE_SLUG%";
  PathTemplate2["SETTINGS"] = "settings";
  return PathTemplate2;
})(PathTemplate || {});

const scriptRel = 'modulepreload';const assetsURL = function(dep) { return "/neno/"+dep };const seen = {};const __vitePreload = function preload(baseModule, deps, importerUrl) {
    let promise = Promise.resolve();
    // @ts-expect-error true will be replaced with boolean later
    if (true && deps && deps.length > 0) {
        const links = document.getElementsByTagName('link');
        promise = Promise.all(deps.map((dep) => {
            // @ts-expect-error assetsURL is declared before preload.toString()
            dep = assetsURL(dep);
            if (dep in seen)
                return;
            seen[dep] = true;
            const isCss = dep.endsWith('.css');
            const cssSelector = isCss ? '[rel="stylesheet"]' : '';
            const isBaseRelative = !!importerUrl;
            // check if the file is already preloaded by SSR markup
            if (isBaseRelative) {
                // When isBaseRelative is true then we have `importerUrl` and `dep` is
                // already converted to an absolute URL by the `assetsURL` function
                for (let i = links.length - 1; i >= 0; i--) {
                    const link = links[i];
                    // The `links[i].href` is an absolute URL thanks to browser doing the work
                    // for us. See https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflecting-content-attributes-in-idl-attributes:idl-domstring-5
                    if (link.href === dep && (!isCss || link.rel === 'stylesheet')) {
                        return;
                    }
                }
            }
            else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
                return;
            }
            const link = document.createElement('link');
            link.rel = isCss ? 'stylesheet' : scriptRel;
            if (!isCss) {
                link.as = 'script';
                link.crossOrigin = '';
            }
            link.href = dep;
            document.head.appendChild(link);
            if (isCss) {
                return new Promise((res, rej) => {
                    link.addEventListener('load', res);
                    link.addEventListener('error', () => rej(new Error(`Unable to preload CSS for ${dep}`)));
                });
            }
        }));
    }
    return promise
        .then(() => baseModule())
        .catch((err) => {
        const e = new Event('vite:preloadError', { cancelable: true });
        // @ts-expect-error custom payload
        e.payload = err;
        window.dispatchEvent(e);
        if (!e.defaultPrevented) {
            throw err;
        }
    });
};

const __variableDynamicImportRuntimeHelper = (glob, path) => {
    const v = glob[path];
    if (v) {
        return typeof v === 'function' ? v() : Promise.resolve(v);
    }
    return new Promise((_, reject) => {
        (typeof queueMicrotask === 'function' ? queueMicrotask : setTimeout)(reject.bind(null, new Error('Unknown variable dynamic import: ' + path)));
    });
};

const supportedLangs = [
  "en-US",
  "de-DE"
];
const defaultLang = "en-US";
let lang = defaultLang;
const localStorageValue = localStorage.getItem("language");
if (localStorageValue && supportedLangs.includes(localStorageValue)) {
  lang = localStorageValue;
} else if (supportedLangs.includes(navigator.language)) {
  lang = navigator.language;
}
localStorage.setItem("language", lang);
const langFile = (await __variableDynamicImportRuntimeHelper((/* #__PURE__ */ Object.assign({"../intl/de-DE.json": () => __vitePreload(() => import('./de-DE-BrVANCwf.js'),true?__vite__mapDeps([]):void 0),"../intl/en-US.json": () => __vitePreload(() => import('./en-US-BlB32n2_.js'),true?__vite__mapDeps([]):void 0)})), `../intl/${lang}.json`)).default;
function l(key, replacements) {
  if (typeof langFile[key] === "string") {
    let output = langFile[key];
    for (const replacement in replacements) {
      if (Object.prototype.hasOwnProperty.call(replacements, replacement)) {
        output = output.replace(`{${replacement}}`, replacements[replacement]);
      }
    }
    return output;
  } else {
    console.warn("Translation not available: " + key);
    return key;
  }
}
function lf(key, replacements) {
  const output = l(key, replacements);
  if (output.includes("%EXTERNAL_LINK")) {
    const nodes = [];
    const regex = /%EXTERNAL_LINK\[(?<label>[^\]]*)\]\((?<url>[^)]*)\)/gm;
    const outerParts = output.split(regex);
    let i = 0;
    for (const match of output.matchAll(regex)) {
      nodes.push(/* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          children: outerParts[i]
        },
        `translation_${key}_op_${match.groups?.label}`
      ));
      nodes.push(
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: match.groups?.url,
            target: "_blank",
            rel: "noreferrer noopener",
            children: match.groups?.label
          },
          `translation_${key}_match_${match.groups?.label}`
        )
      );
      i++;
    }
    nodes.push(outerParts[outerParts.length - 1]);
    return nodes;
  } else {
    return output;
  }
}
function getActiveLanguage() {
  return lang;
}
function setLanguage(language) {
  lang = language;
  localStorage.setItem("language", lang);
  location.reload();
}

const BASE_URL = "/neno/";

const VERSION = "v7.12.0";
const DEFAULT_NOTE_CONTENT = "";
const LOCAL_GRAPH_ID = "local";
const ROOT_PATH = BASE_URL;
const ASSETS_PATH = `${ROOT_PATH}assets/`;
const ICON_PATH = `${ASSETS_PATH}icons/`;
const MAX_WIDTH_SMALL_SCREEN = 1280;
const SEARCH_RESULTS_PER_PAGE = 50;
const DEFAULT_DOCUMENT_TITLE = "NENO";
const FILE_PICKER_ACCEPT_TYPES = [
  {
    description: "Media file",
    accept: {
      "audio/*": [".mp3", ".flac"],
      "video/*": [".mp4", ".webm"],
      "application/*": [".pdf", ".js"],
      "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"]
    }
  }
];
const SPAN_SEPARATOR = " · ";
const NOTE_FILE_EXTENSION = ".subtext";
const NOTE_MIME_TYPE = "text/subtext";
const DEFAULT_CONTENT_TYPE = NOTE_MIME_TYPE;
const NOTE_FILE_DESCRIPTION = "NENO subtext note";

class FileSystemAccessAPIStorageProvider {
  constructor(directoryHandle) {
    this.#directoryHandle = directoryHandle;
  }
  /** **************
    PRIVATE
  ****************/
  #directoryHandle;
  #descendantFolderHandles = /* @__PURE__ */ new Map();
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
    const pathSegments = descendantFolderPath.length > 0 ? this.splitPath(descendantFolderPath) : [];
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
    const pathSegments = this.splitPath(filePath);
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
    const fileHandle = await this.#getFileHandle(requestPath, true);
    const writable = await fileHandle.createWritable();
    await writable.write(data);
    await writable.close();
  }
  async renameFile(requestPath, newEntryName) {
    const fileHandle = await this.#getFileHandle(requestPath, true);
    await fileHandle.move(newEntryName);
  }
  async writeObjectFromReadable(requestPath, readableStream) {
    const fileHandle = await this.#getFileHandle(requestPath, true);
    const writable = await fileHandle.createWritable();
    await readableStream.pipeTo(writable);
    const size = await this.getFileSize(requestPath);
    return size;
  }
  async readObjectAsString(requestPath) {
    const fileHandle = await this.#getFileHandle(requestPath, false);
    const file = await fileHandle.getFile();
    const string = await file.text();
    return string;
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
  async listDirectory(requestPath) {
    const dirHandle = await this.#getDescendantFolderHandle(
      this.#directoryHandle,
      requestPath
    );
    const values = [];
    for await (const handle of dirHandle.values()) {
      values.push(handle);
    }
    const entryNames = values.map((dirHandle2) => dirHandle2.name);
    return entryNames;
  }
  joinPath(...args) {
    return args.filter((arg) => arg.length > 0).join(this.DS);
  }
  splitPath(path) {
    return path.split(this.DS);
  }
  async getFileSize(requestPath) {
    const fileHandle = await this.#getFileHandle(requestPath, false);
    const file = await fileHandle.getFile();
    const size = file.size;
    return size;
  }
  async getFolderSize(requestPath) {
    const folderHandle = await this.#getDescendantFolderHandle(
      this.#directoryHandle,
      requestPath
    );
    const values = [];
    for await (const handle of folderHandle.values()) {
      values.push(handle);
    }
    const entryNames = values.filter((value) => value.kind === "file");
    const filePromises = entryNames.map((fileHandle) => {
      return fileHandle.getFile();
    });
    const files = await Promise.all(filePromises);
    const fileSizes = files.map((file) => file.size);
    const folderSize = fileSizes.reduce((accumulator, size) => {
      return accumulator + size;
    }, 0);
    return folderSize;
  }
}

const MimeTypes = new Map(Object.entries({
  "png": "image/png",
  "jpg": "image/jpeg",
  "jpeg": "image/jpeg",
  "webp": "image/webp",
  "gif": "image/gif",
  "svg": "image/svg+xml",
  "pdf": "application/pdf",
  "js": "text/javascript",
  "json": "application/json",
  "mp3": "audio/mp3",
  "flac": "audio/flac",
  "mp4": "video/mp4",
  "webm": "video/webm",
  "md": "text/markdown"
}));

var ErrorMessage = /* @__PURE__ */ ((ErrorMessage2) => {
  ErrorMessage2["GRAPH_NOT_FOUND"] = "GRAPH_NOT_FOUND";
  ErrorMessage2["NOTE_NOT_FOUND"] = "NOTE_NOT_FOUND";
  ErrorMessage2["PINNED_NOTES_NOT_FOUND"] = "PINNED_NOTES_NOT_FOUND";
  ErrorMessage2["PINNED_NOTE_NOT_FOUND"] = "PINNED_NOTE_NOT_FOUND";
  ErrorMessage2["FILE_NOT_FOUND"] = "FILE_NOT_FOUND";
  ErrorMessage2["INVALID_MIME_TYPE"] = "INVALID_MIME_TYPE";
  ErrorMessage2["NOTE_WITH_SAME_TITLE_EXISTS"] = "NOTE_WITH_SAME_TITLE_EXISTS";
  ErrorMessage2["NOTE_WITH_SAME_SLUG_EXISTS"] = "NOTE_WITH_SAME_SLUG_EXISTS";
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
    const charsUntilDelimiter = stringToAnalyse.slice(this.#index, delimiterIndex);
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
    } else if ((typeof lastChar !== "string" || isWhiteSpace$1(lastChar)) && char === "/" && currentSpanType !== SpanType.WIKILINK && !isWhiteSpace$1(iterator.peek(1).join(""))) {
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
        } else if (line.startsWith("-")) {
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
  CanonicalNoteHeader2["CONTENT_TYPE"] = "content-type";
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
    return MediaType.TEXT;
  }
  return map.has(extension) ? map.get(extension) : MediaType.OTHER;
};
const shortenText$1 = (text, maxLength) => {
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

const NUMBER_OF_RESULTS_PER_NOTE_LIST_PAGE = 50;
const FILE_SLUG_PREFIX = "files/";

const isFileSlug = (slug) => {
  return slug.startsWith(FILE_SLUG_PREFIX);
};
const trimSlug = (slug) => {
  return slug.replace(/^-+/, "").replace(/-+$/, "");
};
const sluggify = (text) => {
  const slug = text.trim().replace(/['’]+/g, "").replace(/[^\p{L}\p{M}\d\-_]+/gu, "-").replace(/-+/g, "-").toLowerCase();
  return trimSlug(slug);
};
const sluggifyNoteText = (text) => {
  return sluggify(text).substring(0, 200);
};
const isValidSlug = (slug) => {
  return slug.length > 0 && slug.length <= 200 && slug.match(/^[\p{L}\d_][\p{L}\d\-/._]*$/u) !== null;
};
const isValidSlugOrEmpty = (slug) => {
  return isValidSlug(slug) || slug.length === 0;
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
      return sluggify(span.text.substring(2, span.text.length - 2));
    }
  });
};
const createSlug = (noteContent, existingSlugs) => {
  const title = inferNoteTitle(noteContent);
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
const getSlugFromFilename = (filename, existingFiles) => {
  const existingFileSlugs = existingFiles.map((file) => file.slug);
  const extension = getExtensionFromFilename(filename);
  const filenameWithoutExtension = removeExtensionFromFilename(filename);
  const sluggifiedFileStem = sluggify(filenameWithoutExtension);
  let n = 1;
  while (true) {
    const showIntegerSuffix = n > 1;
    const stemWithOptionalIntegerSuffix = showIntegerSuffix ? `${sluggifiedFileStem}-${n}` : sluggifiedFileStem;
    const slug = FILE_SLUG_PREFIX + stemWithOptionalIntegerSuffix + (extension ? (stemWithOptionalIntegerSuffix ? "." : "") + extension.trim().toLowerCase() : "");
    if (!existingFileSlugs.includes(slug)) {
      return slug;
    }
    n++;
  }
};
const getFilenameFromFileSlug = (fileSlug) => {
  if (!isFileSlug(fileSlug)) {
    throw new Error("Not a file slug: " + fileSlug);
  }
  return fileSlug.substring(FILE_SLUG_PREFIX.length);
};

var WriteGraphMetadataAction = /* @__PURE__ */ ((WriteGraphMetadataAction2) => {
  WriteGraphMetadataAction2["NONE"] = "NONE";
  WriteGraphMetadataAction2["WRITE"] = "WRITE";
  WriteGraphMetadataAction2["UPDATE_TIMESTAMP_AND_WRITE"] = "UPDATE_TIMESTAMP_AND_WRITE";
  return WriteGraphMetadataAction2;
})(WriteGraphMetadataAction || {});

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
const updateIndexes = (graph, existingNote) => {
  const blocks = parse(existingNote.content);
  graph.indexes.blocks.set(
    existingNote.meta.slug,
    blocks
  );
  const ourSlug = existingNote.meta.slug;
  graph.indexes.blocks.set(ourSlug, blocks);
  const ourOutgoingLinks = getSlugsFromParsedNote(blocks);
  graph.indexes.outgoingLinks.set(ourSlug, new Set(ourOutgoingLinks));
  updateBacklinksIndex(graph, ourSlug, ourOutgoingLinks);
};

const parseNoteHeaders = (note) => {
  const headerSection = note.substring(0, note.indexOf("\n\n"));
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
      meta.createdAt = parseInt(val);
    }
  ],
  [
    CanonicalNoteHeader.UPDATED_AT,
    (meta, val) => {
      meta.updatedAt = parseInt(val);
    }
  ],
  [
    CanonicalNoteHeader.FLAGS,
    (meta, val) => {
      meta.flags = val.trim().length > 0 ? val.trim().split(",") : [];
    }
  ],
  [
    CanonicalNoteHeader.CONTENT_TYPE,
    (meta, val) => {
      meta.contentType = val.trim();
    }
  ]
]);
const cleanSerializedNote = (serializedNote) => {
  return serializedNote.replace(/\r/g, "");
};
const parseSerializedExistingNote = (serializedNote, slug) => {
  const serializedNoteCleaned = cleanSerializedNote(serializedNote);
  const headers = parseNoteHeaders(serializedNoteCleaned);
  const partialMeta = {};
  const custom = {};
  for (const [key, value] of headers.entries()) {
    if (canonicalHeaderKeys.has(key)) {
      canonicalHeaderKeys.get(key)(
        partialMeta,
        value
      );
    } else {
      custom[key] = value;
    }
  }
  const meta = {
    slug,
    createdAt: partialMeta.createdAt,
    updatedAt: partialMeta.updatedAt,
    flags: partialMeta.flags ?? [],
    contentType: partialMeta.contentType ?? DEFAULT_CONTENT_TYPE,
    custom
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
  const headers = parseNoteHeaders(serializedNoteCleaned);
  const partialMeta = {};
  const custom = {};
  for (const [key, value] of headers.entries()) {
    if (canonicalHeaderKeys.has(key)) {
      canonicalHeaderKeys.get(key)(
        partialMeta,
        value
      );
    } else {
      custom[key] = value;
    }
  }
  const meta = {
    flags: partialMeta.flags ?? [],
    contentType: partialMeta.contentType ?? DEFAULT_CONTENT_TYPE,
    custom
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
  headersToSerialize.set(
    CanonicalNoteHeader.FLAGS,
    note.meta.flags.join(",")
  );
  headersToSerialize.set(
    CanonicalNoteHeader.CONTENT_TYPE,
    note.meta.contentType
  );
  for (const key in note.meta.custom) {
    if (Object.hasOwn(note.meta.custom, key)) {
      headersToSerialize.set(key, note.meta.custom[key]);
    }
  }
  return serializeNoteHeaders(headersToSerialize) + "\n\n" + note.content;
};
const serializeNewNote = (note) => {
  const headers = /* @__PURE__ */ new Map([
    [
      CanonicalNoteHeader.FLAGS,
      note.meta.flags.join(",")
    ],
    [
      CanonicalNoteHeader.CONTENT_TYPE,
      note.meta.contentType
    ]
  ]);
  for (const key in note.meta.custom) {
    if (Object.hasOwn(note.meta.custom, key)) {
      headers.set(key, note.meta.custom[key]);
    }
  }
  return serializeNoteHeaders(headers) + "\n\n" + note.content;
};
const getNumberOfCharacters = (note) => {
  return note.content.length;
};
const removeCustomMetadataWithEmptyKeys = (meta) => {
  return Object.fromEntries(
    Object.entries(meta).filter((entry) => {
      return entry[0].trim().length > 0;
    })
  );
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
const inferNoteTitle = (noteContent, maxLength = 800) => {
  const lines = noteContent.split("\n");
  const firstContentLine = lines.find((line) => line.trim().length > 0);
  if (!firstContentLine) {
    return "";
  }
  const textNormalized = removeWikilinkPunctuation(
    removeHeadingSigil(removeQuoteBlockSigil(firstContentLine))
  );
  const titleShortened = shortenText$1(textNormalized, maxLength).trim();
  return titleShortened;
};
const getNoteTitle = (note) => {
  if (note.meta.custom.title) {
    return note.meta.custom.title;
  } else {
    return inferNoteTitle(note.content);
  }
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
    title: getNoteTitle(note),
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
      title: getNoteTitle(note),
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
    }
  });
  return spans;
};
const getFileSlugsInNote = (graph, noteSlug) => {
  const blocks = graph.indexes.blocks.get(noteSlug);
  const allInlineSpans = getAllInlineSpans(blocks);
  const allUsedSlugs = getSlugsFromInlineText(allInlineSpans);
  return allUsedSlugs.filter(isFileSlug);
};
const getFileInfos = (graph, slug) => {
  const fileSlugs = getFileSlugsInNote(graph, slug);
  const files = graph.metadata.files.filter((file) => fileSlugs.includes(file.slug));
  return files;
};
const createNoteToTransmit = async (existingNote, graph) => {
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
    files: getFileInfos(graph, existingNote.meta.slug),
    aliases: getAliasesOfSlug(graph, existingNote.meta.slug)
  };
  return noteToTransmit;
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
  const fileSlugs = getFileSlugsInNote(graph, note.meta.slug);
  fileSlugs.forEach((fileSlug) => {
    const mediaType = getMediaTypeFromFilename(fileSlug);
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
  return getFileSlugsInNote(graph, noteSlug).length;
};
const createNoteListItem = (note, graph) => {
  const noteListItem = {
    slug: note.meta.slug,
    aliases: getAliasesOfSlug(graph, note.meta.slug),
    title: getNoteTitle(note),
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
    } else if (span.type === SpanType.WIKILINK && sluggify(span.text.substring(2, span.text.length - 2)) === oldSlug) {
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
  existingNote.meta.updatedAt = Date.now();
  existingNote.meta.flags = noteFromUser.meta.flags;
  existingNote.meta.contentType = noteFromUser.meta.contentType;
  existingNote.meta.custom = removeCustomMetadataWithEmptyKeys(
    noteFromUser.meta.custom
  );
  const aliasesToUpdate = [];
  for (const [alias, canonicalSlug] of graph.aliases.entries()) {
    if (canonicalSlug === existingNote.meta.slug) {
      graph.aliases.delete(alias);
      aliasesToUpdate.push(alias);
    }
  }
  noteSaveRequest.aliases.forEach((alias) => {
    if (!isValidSlug(alias)) {
      throw new Error(ErrorMessage.INVALID_ALIAS);
    }
    if (alias === existingNote.meta.slug) {
      throw new Error(ErrorMessage.ALIAS_EXISTS);
    }
    if (graph.aliases.has(alias) && graph.aliases.get(alias) !== existingNote.meta.slug) {
      throw new Error(ErrorMessage.ALIAS_EXISTS);
    }
    if (graph.notes.has(alias)) {
      throw new Error(ErrorMessage.NOTE_WITH_SAME_SLUG_EXISTS);
    }
    graph.aliases.set(alias, existingNote.meta.slug);
    aliasesToUpdate.push(alias);
  });
  if ("changeSlugTo" in noteSaveRequest && typeof noteSaveRequest.changeSlugTo === "string") {
    if (!isValidSlug(noteSaveRequest.changeSlugTo)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }
    if (graph.notes.has(noteSaveRequest.changeSlugTo)) {
      throw new Error(ErrorMessage.NOTE_WITH_SAME_SLUG_EXISTS);
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
    let flushMetadata = WriteGraphMetadataAction.NONE;
    for (let i = 0; i < graph.metadata.pinnedNotes.length; i++) {
      if (graph.metadata.pinnedNotes[i] === oldSlug) {
        graph.metadata.pinnedNotes[i] = newSlug;
        flushMetadata = WriteGraphMetadataAction.UPDATE_TIMESTAMP_AND_WRITE;
      }
    }
    const aliasesToUpdate2 = [];
    for (const [alias, canonicalSlug] of graph.aliases.entries()) {
      if (canonicalSlug === oldSlug) {
        graph.aliases.delete(alias);
        graph.aliases.set(alias, newSlug);
        aliasesToUpdate2.push(alias);
      }
    }
    await io.flushChanges(
      graph,
      flushMetadata,
      [oldSlug],
      aliasesToUpdate2
    );
    existingNote.meta.slug = newSlug;
    graph.notes.set(newSlug, existingNote);
    if ("updateReferences" in noteSaveRequest && noteSaveRequest.updateReferences) {
      updateIndexes(graph, existingNote);
      for (const thatNote of notesReferencingOurNoteBeforeChange) {
        const blocks = graph.indexes.blocks.get(
          thatNote.meta.slug
        );
        const noteTitle = getNoteTitle(existingNote);
        const newSluggifiableTitle = sluggify(noteTitle) === newSlug ? noteTitle : newSlug;
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
          WriteGraphMetadataAction.NONE,
          [thatNote.meta.slug],
          []
        );
      }
    }
  } else {
    graph.notes.set(existingNote.meta.slug, existingNote);
  }
  updateIndexes(graph, existingNote);
  await io.flushChanges(
    graph,
    WriteGraphMetadataAction.NONE,
    [existingNote.meta.slug],
    aliasesToUpdate
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
    if (!isValidSlug(noteSaveRequest.changeSlugTo)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }
    if (graph.notes.has(noteSaveRequest.changeSlugTo) || graph.aliases.has(noteSaveRequest.changeSlugTo)) {
      throw new Error(ErrorMessage.NOTE_WITH_SAME_SLUG_EXISTS);
    }
    slug = noteSaveRequest.changeSlugTo;
  } else {
    slug = createSlug(
      noteFromUser.content,
      existingSlugs
    );
  }
  const aliasesToUpdate = [];
  noteSaveRequest.aliases.forEach((alias) => {
    if (!isValidSlug(alias)) {
      throw new Error(ErrorMessage.INVALID_ALIAS);
    }
    if (graph.aliases.has(alias) && graph.aliases.get(alias) !== slug) {
      throw new Error(ErrorMessage.ALIAS_EXISTS);
    }
    if (graph.notes.has(alias)) {
      throw new Error(ErrorMessage.NOTE_WITH_SAME_SLUG_EXISTS);
    }
    graph.aliases.set(alias, slug);
    aliasesToUpdate.push(alias);
  });
  const newNote = {
    meta: {
      slug,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      custom: removeCustomMetadataWithEmptyKeys(
        noteFromUser.meta.custom
      ),
      flags: noteFromUser.meta.flags,
      contentType: noteFromUser.meta.contentType
    },
    content: noteFromUser.content
  };
  graph.notes.set(slug, newNote);
  updateIndexes(graph, newNote);
  await io.flushChanges(
    graph,
    WriteGraphMetadataAction.NONE,
    [newNote.meta.slug],
    aliasesToUpdate
  );
  const noteToTransmit = await createNoteToTransmit(newNote, graph);
  return noteToTransmit;
};

const subwaytextWorkerUrl = "/neno/assets/index-BuL9mqzE.js";

const migrateToV4 = async (metadata, storageProvider) => {
  const initialNodePosition = metadata.initialNodePosition;
  const screenPosition = metadata.screenPosition;
  const newMetadata = {
    createdAt: metadata.createdAt,
    updatedAt: metadata.updatedAt,
    pinnedNotes: metadata.pinnedNotes,
    files: metadata.files,
    version: "4"
  };
  const visualMetadata = {
    version: "1",
    initialNodePosition,
    screenPosition
  };
  await storageProvider.writeObject(
    ".neno-visual.json",
    JSON.stringify(visualMetadata, null, "  ")
  );
  return {
    metadata: newMetadata
  };
};

class DatabaseIO {
  #storageProvider;
  #loadedGraph = null;
  #graphRetrievalInProgress = null;
  #finishedObtainingGraph = () => {
  };
  #GRAPH_METADATA_FILENAME = ".graph.json";
  #NAME_OF_FILES_SUBDIRECTORY = "files";
  static #NOTE_FILE_EXTENSION = ".subtext";
  #ALIAS_HEADER = ":alias-of:";
  // Block parsing is CPU intensive, so we use a web worker pool to parse
  // multiple notes in parallel.
  static #workerPool = [];
  // Returns the filename for a note with the given slug.
  static getFilenameForNoteSlug(slug) {
    if (!slug) {
      throw new Error("Cannot get filename for empty slug");
    }
    return `${slug}${DatabaseIO.#NOTE_FILE_EXTENSION}`;
  }
  static getSlugsFromFilenames(filenames) {
    return filenames.filter((filename) => {
      return filename.endsWith(DatabaseIO.#NOTE_FILE_EXTENSION);
    }).map((filename) => {
      return filename.slice(0, -DatabaseIO.#NOTE_FILE_EXTENSION.length);
    });
  }
  async getNoteFilenamesFromGraphDirectory() {
    return (await this.#storageProvider.listDirectory()).filter((entry) => {
      return entry.endsWith(DatabaseIO.#NOTE_FILE_EXTENSION);
    });
  }
  async parseGraph(serializedNotesAndAliases, metadataSerialized) {
    let migrationPerformed = false;
    const parsedNotes = /* @__PURE__ */ new Map();
    const aliases = /* @__PURE__ */ new Map();
    for (const [slug, serializedNote] of serializedNotesAndAliases) {
      let parsedNote;
      try {
        if (serializedNote.startsWith(this.#ALIAS_HEADER)) {
          const canonicalSlug = serializedNote.slice(this.#ALIAS_HEADER.length);
          aliases.set(slug, canonicalSlug);
        } else {
          parsedNote = parseSerializedExistingNote(serializedNote, slug);
          parsedNotes.set(slug, parsedNote);
        }
      } catch (e) {
        continue;
      }
    }
    let graphMetadata = typeof metadataSerialized === "string" ? JSON.parse(
      metadataSerialized
    ) : this.createEmptyGraphMetadata();
    if (graphMetadata.version === "3") {
      const v4 = await migrateToV4(
        graphMetadata,
        this.#storageProvider
      );
      graphMetadata = v4.metadata;
      migrationPerformed = true;
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
      indexes: {
        blocks: blockIndex,
        outgoingLinks: outgoingLinkIndex,
        backlinks: backlinkIndex
      },
      metadata: graphMetadata
    };
    if (migrationPerformed) {
      await this.flushChanges(
        parsedGraphObject,
        WriteGraphMetadataAction.WRITE,
        "all",
        "all"
      );
    }
    return parsedGraphObject;
  }
  async readAndParseGraphFromDisk() {
    let graphMetadataSerialized;
    try {
      graphMetadataSerialized = await this.#storageProvider.readObjectAsString(
        this.#GRAPH_METADATA_FILENAME
      );
    } catch (e) {
      graphMetadataSerialized = void 0;
    }
    const noteFilenames = await this.getNoteFilenamesFromGraphDirectory();
    const serializedNotes = new Map(
      await Promise.all(
        noteFilenames.map(
          async (filename) => {
            const slug = filename.slice(
              0,
              -DatabaseIO.#NOTE_FILE_EXTENSION.length
            );
            const serializedNote = await this.#storageProvider.readObjectAsString(
              filename
            );
            return [slug, serializedNote];
          }
        )
      )
    );
    return this.parseGraph(serializedNotes, graphMetadataSerialized);
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
  async writeGraphMetadataFile(graph) {
    await this.#storageProvider.writeObject(
      this.#GRAPH_METADATA_FILENAME,
      // we pretty print the JSON for Git to be able to show better diffs
      JSON.stringify(graph.metadata, null, 2)
    );
  }
  createEmptyGraphMetadata() {
    return {
      createdAt: Date.now(),
      updatedAt: Date.now(),
      pinnedNotes: [],
      files: [],
      version: "4"
    };
  }
  /**
    PUBLIC
  **/
  constructor(config) {
    this.#storageProvider = config.storageProvider;
  }
  async getRawNote(slug) {
    const rawNote = await this.#storageProvider.readObjectAsString(
      DatabaseIO.getFilenameForNoteSlug(slug)
    );
    if (!rawNote) {
      throw new Error(ErrorMessage.GRAPH_NOT_FOUND);
    }
    return rawNote;
  }
  async getGraph() {
    if (this.#graphRetrievalInProgress) {
      await this.#graphRetrievalInProgress;
    }
    this.#graphRetrievalInProgress = new Promise((resolve) => {
      this.#finishedObtainingGraph = () => {
        this.#graphRetrievalInProgress = null;
        resolve();
      };
    });
    if (this.#loadedGraph) {
      this.#finishedObtainingGraph();
      return this.#loadedGraph;
    }
    const graphFromDisk = await this.readAndParseGraphFromDisk();
    await this.flushChanges(
      graphFromDisk,
      WriteGraphMetadataAction.WRITE,
      [],
      []
    );
    this.#finishedObtainingGraph();
    return graphFromDisk;
  }
  // flushChanges makes sure that the changes applied to the graph object are
  // written to the disk and thus are persistent. It should always be called
  // after any operation on the internal graph representation
  // has been performed.
  async flushChanges(graph, writeGraphMetadata, canonicalSlugsToFlush, aliasesToFlush) {
    if (writeGraphMetadata === WriteGraphMetadataAction.WRITE || writeGraphMetadata === WriteGraphMetadataAction.UPDATE_TIMESTAMP_AND_WRITE) {
      if (writeGraphMetadata === WriteGraphMetadataAction.UPDATE_TIMESTAMP_AND_WRITE) {
        graph.metadata.updatedAt = Date.now();
      }
      await this.writeGraphMetadataFile(graph);
    }
    this.#loadedGraph = graph;
    graph.aliases.forEach(async (slug, alias) => {
      await this.#storageProvider.writeObject(
        `${alias}${DatabaseIO.#NOTE_FILE_EXTENSION}`,
        this.#ALIAS_HEADER + slug
      );
    });
    if (Array.isArray(canonicalSlugsToFlush)) {
      await Promise.all(canonicalSlugsToFlush.map(async (slug) => {
        const filename = DatabaseIO.getFilenameForNoteSlug(slug);
        if (!graph.notes.has(slug)) {
          await this.#storageProvider.removeObject(filename);
        } else {
          await this.#storageProvider.writeObject(
            filename,
            serializeNote(graph.notes.get(slug))
          );
        }
      }));
    } else {
      for (const [slug, note] of graph.notes) {
        const filename = DatabaseIO.getFilenameForNoteSlug(slug);
        if (!graph.notes.has(slug)) {
          await this.#storageProvider.removeObject(filename);
        } else {
          await this.#storageProvider.writeObject(
            filename,
            serializeNote(note)
          );
        }
      }
    }
    if (Array.isArray(aliasesToFlush)) {
      await Promise.all(aliasesToFlush.map(async (alias) => {
        const filename = DatabaseIO.getFilenameForNoteSlug(alias);
        if (!graph.aliases.has(alias)) {
          await this.#storageProvider.removeObject(filename);
        } else {
          const canonicalSlug = graph.aliases.get(alias);
          await this.#storageProvider.writeObject(
            filename,
            `${this.#ALIAS_HEADER}${canonicalSlug}`
          );
        }
      }));
    } else {
      for (const [alias, canonicalSlug] of graph.aliases) {
        const filename = DatabaseIO.getFilenameForNoteSlug(alias);
        if (!graph.aliases.has(alias)) {
          await this.#storageProvider.removeObject(filename);
        } else {
          await this.#storageProvider.writeObject(
            filename,
            `${this.#ALIAS_HEADER}${canonicalSlug}`
          );
        }
      }
    }
  }
  async addFile(slug, source) {
    if (!isFileSlug(slug)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }
    const filepath = this.#storageProvider.joinPath(
      this.#NAME_OF_FILES_SUBDIRECTORY,
      slug.substring(FILE_SLUG_PREFIX.length)
    );
    const size = await this.#storageProvider.writeObjectFromReadable(
      filepath,
      source
    );
    return size;
  }
  async renameFile(slug, newSlug) {
    if (!isFileSlug(slug)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }
    if (!isFileSlug(newSlug)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }
    const filepath = this.#storageProvider.joinPath(
      this.#NAME_OF_FILES_SUBDIRECTORY,
      slug.substring(FILE_SLUG_PREFIX.length)
    );
    const newFilename = newSlug.substring(FILE_SLUG_PREFIX.length);
    await this.#storageProvider.renameFile(
      filepath,
      newFilename
    );
  }
  async deleteFile(slug) {
    if (!isFileSlug(slug)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }
    await this.#storageProvider.removeObject(
      this.#storageProvider.joinPath(
        this.#NAME_OF_FILES_SUBDIRECTORY,
        slug.substring(FILE_SLUG_PREFIX.length)
      )
    );
  }
  async getReadableFileStream(slug, range) {
    if (!isFileSlug(slug)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }
    const filepath = this.#storageProvider.joinPath(
      this.#NAME_OF_FILES_SUBDIRECTORY,
      getFilenameFromFileSlug(slug)
    );
    const stream = await this.#storageProvider.getReadableStream(
      filepath,
      range
    );
    return stream;
  }
  async getFileSize(slug) {
    if (!isFileSlug(slug)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }
    const filepath = this.#storageProvider.joinPath(
      this.#NAME_OF_FILES_SUBDIRECTORY,
      slug.substring(FILE_SLUG_PREFIX.length)
    );
    const fileSize = await this.#storageProvider.getFileSize(filepath);
    return fileSize;
  }
  async getFiles() {
    try {
      const directoryListing = await this.#storageProvider.listDirectory(
        this.#NAME_OF_FILES_SUBDIRECTORY
      );
      const files = directoryListing.filter((filename) => {
        return !filename.startsWith(".");
      });
      return files;
    } catch (e) {
      return [];
    }
  }
  async getSizeOfGraphFiles() {
    try {
      const size = await this.#storageProvider.getFolderSize(
        this.#NAME_OF_FILES_SUBDIRECTORY
      );
      return size;
    } catch (e) {
      return 0;
    }
  }
  async getSizeOfGraph() {
    try {
      const size = await this.#storageProvider.getFolderSize();
      return size;
    } catch (e) {
      return 0;
    }
  }
  async getSizeOfGraphWithFiles() {
    const sizes = await Promise.all([
      this.getSizeOfGraph(),
      this.getSizeOfGraphFiles()
    ]);
    return sizes[0] + sizes[1];
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
      return (a.createdAt ?? 0) - (b.createdAt ?? 0);
    },
    [NoteListSortMode.CREATION_DATE_DESCENDING]: (a, b) => {
      return (b.createdAt ?? 0) - (a.createdAt ?? 0);
    },
    [NoteListSortMode.UPDATE_DATE_ASCENDING]: (a, b) => {
      return (a.updatedAt ?? 0) - (b.updatedAt ?? 0);
    },
    [NoteListSortMode.UPDATE_DATE_DESCENDING]: (a, b) => {
      return (b.updatedAt ?? 0) - (a.updatedAt ?? 0);
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
        return (a.meta.createdAt ?? 0) - (b.meta.createdAt ?? 0);
      }
    ],
    [
      NoteListSortMode.CREATION_DATE_DESCENDING,
      (a, b) => {
        return (b.meta.createdAt ?? 0) - (a.meta.createdAt ?? 0);
      }
    ],
    [
      NoteListSortMode.UPDATE_DATE_ASCENDING,
      (a, b) => {
        return (a.meta.updatedAt ?? 0) - (b.meta.updatedAt ?? 0);
      }
    ],
    [
      NoteListSortMode.UPDATE_DATE_DESCENDING,
      (a, b) => {
        return (b.meta.updatedAt ?? 0) - (a.meta.updatedAt ?? 0);
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
  return Math.min(
    ...Array.from(graph.notes.values()).map((note) => note.meta.createdAt).filter((createdAt) => {
      return createdAt !== void 0;
    }),
    graph.metadata.createdAt
  );
};
const getGraphUpdateTimestamp = (graph) => {
  return Math.max(
    ...Array.from(graph.notes.values()).map((note) => note.meta.updatedAt).filter((updatedAt) => {
      return updatedAt !== void 0;
    }),
    graph.metadata.updatedAt
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
    const noteTitle = getNoteTitle(note);
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
    const title = getNoteTitle(note);
    return caseSensitive ? title === query : title.toLowerCase() === query.toLowerCase();
  });
};
const getNotesWithUrl = (notes, url) => {
  return notes.filter((note) => {
    return note.content.includes(url) && !note.content[note.content.indexOf(url) + url.length]?.trim();
  });
};
const getNotesWithKeyValue = (notes, key, value) => {
  return notes.filter((note) => {
    return key in note.meta.custom && (value.length === 0 || note.meta.custom[key].includes(value));
  });
};
const getNotesWithFile = (notes, graph, fileSlug) => {
  return notes.filter((note) => {
    const fileSlugs = getFileSlugsInNote(graph, note.meta.slug);
    return fileSlugs.includes(fileSlug);
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
      return getNoteTitle(note).includes(token) || note.meta.slug.includes(token);
    } else {
      return getNoteTitle(note).toLowerCase().includes(token.toLowerCase()) || note.meta.slug.toLowerCase().includes(token.toLowerCase());
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
    const fileSlugs = getFileSlugsInNote(graph, note.meta.slug);
    const includedMediaTypes = new Set(
      fileSlugs.map((fileSlug) => getMediaTypeFromFilename(fileSlug))
    );
    return setsAreEqual(requiredMediaTypes, includedMediaTypes);
  }) : notes.filter((note) => {
    const fileSlugs = getFileSlugsInNote(graph, note.meta.slug);
    const includedMediaTypes = new Set(
      fileSlugs.map((fileSlug) => getMediaTypeFromFilename(fileSlug))
    );
    return Array.from(requiredMediaTypes).some((requiredMediaType) => {
      return includedMediaTypes.has(requiredMediaType);
    });
  });
};
const getNotesWithCustomMetadata = (notes) => {
  return notes.filter((note) => {
    return Object.entries(note.meta.custom).length > 0;
  });
};

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
    if (matchingNotes.length === 0)
      break;
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
      matchingNotes = getNotesByTitle(matchingNotes, value, false);
    } else if (key === "has") {
      if (value === "custom-metadata") {
        matchingNotes = getNotesWithCustomMetadata(matchingNotes);
      } else {
        matchingNotes = [];
      }
    } else if (key === "has-url") {
      matchingNotes = getNotesWithUrl(matchingNotes, value);
    } else if (key === "has-file") {
      matchingNotes = getNotesWithFile(matchingNotes, graph, value);
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
  #io;
  constructor(storageProvider) {
    this.#io = new DatabaseIO({ storageProvider });
  }
  async get(slug) {
    const graph = await this.#io.getGraph();
    const canonicalSlug = graph.aliases.get(slug) || slug;
    if (!graph.notes.has(canonicalSlug)) {
      throw new Error(ErrorMessage.NOTE_NOT_FOUND);
    }
    const noteFromDB = graph.notes.get(canonicalSlug);
    const noteToTransmit = await createNoteToTransmit(noteFromDB, graph);
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
      numberOfFiles: graph.metadata.files.length,
      numberOfPins: graph.metadata.pinnedNotes.length,
      numberOfAliases: graph.aliases.size,
      numberOfUnlinkedNotes
    };
    if (options.includeMetadata) {
      stats.metadata = {
        createdAt: getGraphCreationTimestamp(graph),
        updatedAt: getGraphUpdateTimestamp(graph),
        size: {
          graph: await this.#io.getSizeOfGraph(),
          files: await this.#io.getSizeOfGraphFiles()
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
  putRawNote(rawNote) {
    const note = parseSerializedNewNote(rawNote);
    const noteSaveRequest = {
      note,
      aliases: /* @__PURE__ */ new Set(),
      ignoreDuplicateTitles: true
    };
    return this.put(noteSaveRequest);
  }
  async remove(slug) {
    const graph = await this.#io.getGraph();
    if (!graph.notes.has(slug)) {
      throw new Error(ErrorMessage.NOTE_NOT_FOUND);
    }
    graph.notes.delete(slug);
    const aliasesToRemove = [];
    for (const [alias, canonicalSlug] of graph.aliases.entries()) {
      if (canonicalSlug === slug) {
        graph.aliases.delete(alias);
        aliasesToRemove.push(alias);
      }
    }
    let flushMetadata = WriteGraphMetadataAction.NONE;
    graph.metadata.pinnedNotes = graph.metadata.pinnedNotes.filter((s) => {
      if (s === slug) {
        flushMetadata = WriteGraphMetadataAction.UPDATE_TIMESTAMP_AND_WRITE;
      }
      return s !== slug;
    });
    removeSlugFromIndexes(graph, slug);
    await this.#io.flushChanges(graph, flushMetadata, [slug], aliasesToRemove);
  }
  async addFile(readable, filename) {
    const graph = await this.#io.getGraph();
    const slug = getSlugFromFilename(filename, graph.metadata.files);
    const size = await this.#io.addFile(slug, readable);
    const fileInfo = {
      slug,
      size,
      createdAt: Date.now()
    };
    graph.metadata.files.push(fileInfo);
    await this.#io.flushChanges(
      graph,
      WriteGraphMetadataAction.UPDATE_TIMESTAMP_AND_WRITE,
      [],
      []
    );
    return fileInfo;
  }
  async renameFile(oldSlug, newSlug, updateReferences) {
    const graph = await this.#io.getGraph();
    const fileInfo = graph.metadata.files.find((file) => {
      return file.slug === oldSlug;
    });
    if (!fileInfo) {
      throw new Error(ErrorMessage.FILE_NOT_FOUND);
    }
    if (!isValidSlug(newSlug) || !isFileSlug(newSlug)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }
    await this.#io.renameFile(
      oldSlug,
      newSlug
    );
    fileInfo.slug = newSlug;
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
      WriteGraphMetadataAction.UPDATE_TIMESTAMP_AND_WRITE,
      Array.from(notesThatNeedUpdate),
      []
    );
    return fileInfo;
  }
  async deleteFile(slug) {
    await this.#io.deleteFile(slug);
    const graph = await this.#io.getGraph();
    graph.metadata.files = graph.metadata.files.filter((file) => file.slug !== slug);
    await this.#io.flushChanges(
      graph,
      WriteGraphMetadataAction.UPDATE_TIMESTAMP_AND_WRITE,
      [],
      []
    );
  }
  async getFiles() {
    const graph = await this.#io.getGraph();
    return graph.metadata.files;
  }
  // get files not used in any note
  async getDanglingFiles() {
    const graph = await this.#io.getGraph();
    const allBlocks = Array.from(graph.indexes.blocks.values()).flat();
    const allInlineSpans = getAllInlineSpans(allBlocks);
    const allUsedSlugs = getSlugsFromInlineText(allInlineSpans);
    const allUsedFileSlugs = allUsedSlugs.filter(isFileSlug);
    const danglingFiles = graph.metadata.files.filter((file) => {
      return !allUsedFileSlugs.includes(file.slug);
    });
    return danglingFiles;
  }
  async getReadableFileStream(slug, range) {
    const graph = await this.#io.getGraph();
    if (!graph.metadata.files.map((file) => file.slug).includes(slug)) {
      throw new Error(ErrorMessage.FILE_NOT_FOUND);
    }
    const stream = await this.#io.getReadableFileStream(slug, range);
    return stream;
  }
  async getFileInfo(slug) {
    const graph = await this.#io.getGraph();
    const fileInfo = graph.metadata.files.find(
      (file) => file.slug === slug
    );
    if (!fileInfo) {
      throw new Error(ErrorMessage.FILE_NOT_FOUND);
    }
    return fileInfo;
  }
  async getPins() {
    const graph = await this.#io.getGraph();
    const pinnedNotes = (await Promise.allSettled(
      graph.metadata.pinnedNotes.map((slug) => {
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
    const oldLength = graph.metadata.pinnedNotes.length;
    graph.metadata.pinnedNotes = Array.from(
      /* @__PURE__ */ new Set([...graph.metadata.pinnedNotes, slug])
    );
    const newLength = graph.metadata.pinnedNotes.length;
    const updateMetadata = oldLength !== newLength ? WriteGraphMetadataAction.UPDATE_TIMESTAMP_AND_WRITE : WriteGraphMetadataAction.NONE;
    await this.#io.flushChanges(graph, updateMetadata, [], []);
    return this.getPins();
  }
  async movePinPosition(slug, offset) {
    const graph = await this.#io.getGraph();
    const oldPins = graph.metadata.pinnedNotes;
    if (!oldPins.includes(slug)) {
      throw new Error(ErrorMessage.PINNED_NOTE_NOT_FOUND);
    }
    const oldIndex = oldPins.indexOf(slug);
    const newIndex = oldIndex + offset;
    const newPins = oldPins.toSpliced(oldIndex, 1).toSpliced(newIndex, 0, slug);
    graph.metadata.pinnedNotes = newPins;
    const updateMetadata = offset !== 0 ? WriteGraphMetadataAction.UPDATE_TIMESTAMP_AND_WRITE : WriteGraphMetadataAction.NONE;
    await this.#io.flushChanges(graph, updateMetadata, [], []);
    return this.getPins();
  }
  async unpin(slugToRemove) {
    const graph = await this.#io.getGraph();
    let updateMetadata = WriteGraphMetadataAction.NONE;
    graph.metadata.pinnedNotes = graph.metadata.pinnedNotes.filter((s) => {
      if (s === slugToRemove) {
        updateMetadata = WriteGraphMetadataAction.UPDATE_TIMESTAMP_AND_WRITE;
      }
      return s !== slugToRemove;
    });
    await this.#io.flushChanges(graph, updateMetadata, [], []);
    return this.getPins();
  }
}

const createDemoGraph = async (folderHandle) => {
  const DEMO_GRAPH_PATH = `${ROOT_PATH}assets/demo-graph/`;
  const demoNoteSlugs = [
    "welcome-to-neno"
  ];
  const demoFiles = [
    "beach.jpg"
  ];
  for (const demoNoteSlug of demoNoteSlugs) {
    const response2 = await fetch(
      `${DEMO_GRAPH_PATH}${demoNoteSlug}.subtext`
    );
    const readable2 = response2.body;
    const fileHandle2 = await folderHandle.getFileHandle(
      demoNoteSlug + ".subtext",
      { create: true }
    );
    const writable2 = await fileHandle2.createWritable();
    if (!readable2) {
      throw new Error("Could not get readable stream");
    }
    await readable2.pipeTo(writable2);
  }
  const filesDir = await folderHandle.getDirectoryHandle("files", { create: true });
  for (const demoFile of demoFiles) {
    const response2 = await fetch(
      `${DEMO_GRAPH_PATH}files/${demoFile}`
    );
    const readable2 = response2.body;
    const fileHandle2 = await filesDir.getFileHandle(
      demoFile,
      { create: true }
    );
    const writable2 = await fileHandle2.createWritable();
    if (!readable2) {
      throw new Error("Could not get readable stream");
    }
    await readable2.pipeTo(writable2);
  }
  const response = await fetch(
    `${DEMO_GRAPH_PATH}graph.json`
  );
  const readable = response.body;
  if (!readable) {
    throw new Error("Could not get readable stream");
  }
  const fileHandle = await folderHandle.getFileHandle(
    ".graph.json",
    { create: true }
  );
  const writable = await fileHandle.createWritable();
  await readable.pipeTo(writable);
};
const folderHasGraph = async (folderHandle) => {
  try {
    await folderHandle.getFileHandle(".graph.json");
    return true;
  } catch (error) {
    return false;
  }
};

class MockStorageProvider {
  #files = /* @__PURE__ */ new Map();
  readObjectAsString(requestPath) {
    if (this.#files.has(requestPath)) {
      const bytes = this.#files.get(requestPath);
      const decoder = new TextDecoder();
      const string = decoder.decode(bytes);
      return Promise.resolve(string);
    } else {
      return Promise.reject(new Error("File not found."));
    }
  }
  /* in this mock provider, we just return the string as such when requesting
  a stream */
  getReadableStream(requestPath) {
    if (this.#files.has(requestPath)) {
      const mapItem = this.#files.get(requestPath);
      const readableStream = new ReadableStream({
        start(controller) {
          controller.enqueue(mapItem);
          controller.close();
        }
      });
      return Promise.resolve(readableStream);
    } else {
      throw new Error("File not found.");
    }
  }
  removeObject(requestPath) {
    this.#files.delete(requestPath);
    return Promise.resolve();
  }
  writeObject(requestPath, data) {
    const strToUTF8 = (string) => {
      const encoder = new TextEncoder();
      return encoder.encode(string);
    };
    this.#files.set(requestPath, strToUTF8(data));
    return Promise.resolve();
  }
  async writeObjectFromReadable(requestPath, readableStream) {
    const blob = new Uint8Array(
      await (await new Response(readableStream).blob()).arrayBuffer()
    );
    this.#files.set(requestPath, blob);
    const size = blob.length;
    return Promise.resolve(size);
  }
  async renameFile(requestPath, newName) {
    if (this.#files.has(requestPath)) {
      const value = this.#files.get(requestPath);
      const newRequestPath = requestPath.substring(
        0,
        requestPath.lastIndexOf("/")
      ) + "/" + newName;
      this.#files.set(newRequestPath, value);
      this.#files.delete(requestPath);
      return Promise.resolve();
    } else {
      throw new Error("File not found.");
    }
  }
  joinPath(...segments) {
    return segments.join("/");
  }
  getFileSize(requestPath) {
    if (this.#files.has(requestPath)) {
      const value = this.#files.get(requestPath);
      const size = value.length;
      return Promise.resolve(size);
    } else {
      throw new Error("File not found.");
    }
  }
  listDirectory() {
    return Promise.resolve(Array.from(this.#files.keys()));
  }
  getFolderSize() {
    return Promise.resolve(0);
  }
}

async function verifyPermission(fileSystemHandle, readWrite) {
  const options = {};
  if (readWrite) {
    options.mode = "readwrite";
  }
  if (await fileSystemHandle.queryPermission(options) === "granted") {
    return;
  }
  if (await fileSystemHandle.requestPermission(options) === "granted") {
    return;
  }
  throw new Error("User did not grant permission to " + fileSystemHandle.name);
}
const FOLDER_HANDLE_STORAGE_KEY = "LOCAL_DB_FOLDER_HANDLE";
let folderHandle = null;
let notesProvider = null;
const getFolderHandleName = async () => {
  if (folderHandle) {
    return folderHandle.name;
  }
  const newFolderHandle = await get(FOLDER_HANDLE_STORAGE_KEY);
  if (!newFolderHandle) {
    return null;
  }
  folderHandle = newFolderHandle;
  return folderHandle.name;
};
const getSavedFolderHandle = async () => {
  const folderHandle2 = await get(FOLDER_HANDLE_STORAGE_KEY);
  if (!folderHandle2) {
    throw new Error("No folder handle saved");
  }
  return folderHandle2;
};
const initializeNotesProvider = async (newFolderHandle, createDummyNotes) => {
  if (!newFolderHandle) {
    const memoryStorageProvider = new MockStorageProvider();
    if (createDummyNotes) {
      for (let i = 1; i <= 1e3; i++) {
        await memoryStorageProvider.writeObject(
          "note-" + i + ".subtext",
          "Test note " + i
        );
      }
    }
    notesProvider = new NotesProvider(memoryStorageProvider);
    return notesProvider;
  }
  await verifyPermission(newFolderHandle, true);
  await set(
    FOLDER_HANDLE_STORAGE_KEY,
    newFolderHandle
  );
  folderHandle = newFolderHandle;
  if (!await folderHasGraph(folderHandle)) {
    await createDemoGraph(folderHandle);
  }
  const storageProvider = new FileSystemAccessAPIStorageProvider(folderHandle);
  notesProvider = new NotesProvider(storageProvider);
  return notesProvider;
};
const initializeNotesProviderWithExistingFolderHandle = async () => {
  const folderHandle2 = await getSavedFolderHandle();
  return initializeNotesProvider(folderHandle2);
};
const isInitialized = () => {
  return notesProvider instanceof NotesProvider;
};
const getNotesProvider = () => {
  return notesProvider;
};
const getUrlForSlug = async (slug) => {
  if (!notesProvider) {
    throw new Error("Notes provider not initialized");
  }
  const readable = await notesProvider.getReadableFileStream(
    slug
  );
  const extension = NotesProvider.getExtensionFromFilename(slug);
  const mimeType = extension && MimeTypes.has(extension) ? MimeTypes.get(extension) : "application/neno-filestream";
  const blob = await streamToBlob(readable, mimeType);
  const url = URL.createObjectURL(blob);
  return url;
};
const saveFile = async (slug) => {
  if (!notesProvider) {
    throw new Error("Notes provider not initialized");
  }
  const readable = await notesProvider.getReadableFileStream(
    slug
  );
  const extension = NotesProvider.getExtensionFromFilename(slug);
  const mimeType = extension && MimeTypes.has(extension) ? MimeTypes.get(extension) : "application/neno-filestream";
  const writable = await getWritableStream({
    types: [{
      accept: {
        [mimeType]: ["." + extension]
      }
    }],
    suggestedName: getFilenameFromFileSlug(slug)
  });
  await readable.pipeTo(writable);
};

const shortenText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.trim().substring(0, maxLength) + "…";
  } else {
    return text;
  }
};
const makeTimestampHumanReadable = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};
const createContentFromSlugs = (slugs) => {
  return slugs.reduce((content, slug) => {
    return content + `/${slug}

`;
  }, "").trim();
};
const getNewNoteObject = (params) => {
  const note = {
    isUnsaved: true,
    initialContent: params.content ?? DEFAULT_NOTE_CONTENT,
    // Note may already have files, but the files list will be populated by
    // notesProvider
    files: [],
    keyValues: [],
    flags: [],
    contentType: DEFAULT_CONTENT_TYPE
  };
  Object.seal(note);
  return note;
};
function humanFileSize(bytes, si = false, dp = 1) {
  const thresh = si ? 1e3 : 1024;
  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }
  const units = si ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"] : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;
  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
  return bytes.toLocaleString(void 0, {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp
  }) + " " + units[u];
}
const streamToBlob = async (stream, mimeType) => {
  const response = new Response(
    stream,
    {
      headers: { "Content-Type": mimeType }
    }
  );
  const blob = await response.blob();
  return blob;
};
const getAppPath = (pathTemplate, params, urlParams, doNotEncode) => {
  let path = `/${pathTemplate}`;
  params?.forEach((value, key) => {
    if (value.length === 0) {
      throw new Error(
        "getAppPath: Empty value for app path param received: " + key
      );
    }
    path = path.replace(
      `%${key}%`,
      doNotEncode ? value : encodeURIComponent(value)
    );
  });
  if (urlParams) {
    path += "?" + urlParams;
  }
  return path;
};
const getIconSrc = (iconName) => {
  return ICON_PATH + iconName + ".svg";
};
const getFilesFromUserSelection = async (types, multiple) => {
  const fileHandles = await window.showOpenFilePicker({
    multiple,
    types,
    excludeAcceptAllOption: false
  });
  const files = await Promise.all(
    // @ts-ignore
    fileHandles.map((fileHandle) => fileHandle.getFile())
  );
  return files;
};
const readFileAsString = async (file) => {
  return new Promise((resolve) => {
    const fileReader = new FileReader();
    fileReader.onload = function() {
      const result = fileReader.result;
      resolve(result);
    };
    fileReader.readAsText(file);
  });
};
const getUrl = async (file) => {
  const slug = file.slug;
  const url = await getUrlForSlug(slug);
  return url;
};
const getWritableStream = async (opts) => {
  const newHandle = await window.showSaveFilePicker(opts);
  const writableStream = await newHandle.createWritable();
  return writableStream;
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
const getLines = (text, startOffset, numberOfLines, onlyNonEmptyLines) => {
  let lines = text.split("\n");
  if (onlyNonEmptyLines) {
    lines = lines.filter((line) => line.trim().length > 0);
  }
  return lines.slice(startOffset, startOffset + numberOfLines).join("\n");
};
const getNoteTitleFromActiveNote = (activeNote) => {
  return activeNote.keyValues.find((kv) => kv[0] === "title")?.[1] ?? inferNoteTitle(activeNote.initialContent);
};
const getWikilinkForNote = (slug, title) => {
  const wikilinkContent = sluggify(title) === slug ? title : slug;
  const wikilink = `[[${wikilinkContent}]]`;
  return wikilink;
};

const StartViewLocal = () => {
  const [localDisclaimer, setLocalDisclaimer] = reactExports.useState(null);
  const [
    localDatabaseFolderHandleName,
    setLocalDatabaseFolderHandleName
  ] = reactExports.useState(null);
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    const retrieveLocalDatabaseFolderHandle = async () => {
      const folderHandleName = await getFolderHandleName();
      setLocalDatabaseFolderHandleName(folderHandleName);
    };
    retrieveLocalDatabaseFolderHandle();
  }, []);
  if (typeof window.showDirectoryPicker !== "function") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: l("start.local.unsupported") }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "start-view-local", children: [
    localDisclaimer === "INVALID_FOLDER_HANDLE" ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "error-text", children: l("start.local.error-accessing-folder") }) : "",
    typeof localDatabaseFolderHandleName === "string" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: l("start.local.already-created-folder") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: "default-button default-action",
          onClick: async () => {
            try {
              await initializeNotesProviderWithExistingFolderHandle();
              const urlSearchParams = new URLSearchParams(window.location.search);
              if (urlSearchParams.has("redirect")) {
                navigate(urlSearchParams.get("redirect") ?? "/");
              } else {
                navigate(getAppPath(
                  PathTemplate.NEW_NOTE,
                  /* @__PURE__ */ new Map([["GRAPH_ID", LOCAL_GRAPH_ID]])
                ));
              }
            } catch (e) {
              setLocalDatabaseFolderHandleName(null);
              setLocalDisclaimer("INVALID_FOLDER_HANDLE");
            }
          },
          children: l(
            "start.local.open-folder-x",
            { dbName: localDatabaseFolderHandleName }
          )
        }
      )
    ] }) : "",
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: l("start.local.select-folder.explainer") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        className: "default-button default-action",
        onClick: async () => {
          try {
            const folderHandle = await window.showDirectoryPicker();
            await initializeNotesProvider(folderHandle);
            navigate(getAppPath(
              PathTemplate.NEW_NOTE,
              /* @__PURE__ */ new Map([["GRAPH_ID", LOCAL_GRAPH_ID]])
            ));
          } catch (e) {
          }
        },
        children: l("start.local.select-folder")
      }
    )
  ] });
};

const Icon = ({
  icon,
  title,
  size
}, ref) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "img",
    {
      ref,
      src: getIconSrc(icon),
      alt: title,
      width: size.toString(),
      height: size.toString(),
      className: "svg-icon"
    }
  );
};
const Icon$1 = React.forwardRef(Icon);

const IconButton = ({
  id,
  title,
  icon,
  onClick,
  disabled = false
}) => {
  const ref = reactExports.useRef(null);
  const popoverRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const showPopover = () => {
      const popoverElement = document.createElement("div");
      popoverElement.popover = "auto";
      popoverElement.className = "tooltip";
      document.body.appendChild(popoverElement);
      popoverElement.innerHTML = title;
      popoverElement.showPopover();
      popoverRef.current = popoverElement;
      const popoverRect = popoverElement.getBoundingClientRect();
      const targetRect = ref.current?.getBoundingClientRect();
      if (!targetRect)
        throw new Error("Target rect undefined");
      const css = new CSSStyleSheet();
      css.replaceSync(`
      .tooltip:popover-open {
        top: ${targetRect.y - 35}px;
        left: ${targetRect.x + 25 - popoverRect.width / 2}px;
      }`);
      document.adoptedStyleSheets = [css];
    };
    const hidePopover = () => {
      popoverRef.current?.hidePopover();
      popoverRef.current?.parentElement?.removeChild(popoverRef.current);
    };
    ref.current?.addEventListener("mouseenter", showPopover);
    ref.current?.addEventListener("mouseleave", hidePopover);
    return () => {
      ref.current?.removeEventListener("mouseenter", showPopover);
      ref.current?.removeEventListener("mouseleave", hidePopover);
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      className: "icon-button",
      id,
      onClick,
      disabled,
      ref,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Icon$1,
        {
          icon,
          title,
          size: 24
        }
      )
    }
  );
};

const AppTitle = ({ toggleAppMenu }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    IconButton,
    {
      onClick: toggleAppMenu,
      icon: "menu",
      title: l("app.menu-button.alt")
    }
  );
};

const AppMenuItem = ({
  icon,
  label,
  onClick,
  disabled = false
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      onClick: disabled ? void 0 : onClick,
      className: "app-menu-item" + (disabled ? " disabled" : ""),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: getIconSrc(icon),
            alt: label,
            width: "24",
            height: "24",
            className: "svg-icon"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "label",
            children: label
          }
        )
      ]
    }
  );
};

function useOutsideAlerter(ref, callback) {
  const [
    hasAlreadyBeenTriggeredOnce,
    setHasAlreadyBeenTriggeredOnce
  ] = reactExports.useState(false);
  function handleClickOutside(event) {
    if (ref.current && !ref.current.contains(event.target)) {
      if (hasAlreadyBeenTriggeredOnce) {
        callback();
      } else {
        setHasAlreadyBeenTriggeredOnce(true);
      }
    }
  }
  reactExports.useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });
}
function OutsideAlerter({
  children,
  onOutsideClick
}) {
  const wrapperRef = reactExports.useRef(null);
  useOutsideAlerter(wrapperRef, onOutsideClick);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref: wrapperRef,
      className: "outside-alerter",
      children
    }
  );
}

const QUERY = `(max-width: ${MAX_WIDTH_SMALL_SCREEN}px)`;
let isSmallScreen;
let changeCallbacks = [];
const getIsSmallScreenFromBrowser = () => {
  return window.matchMedia(QUERY).matches;
};
const getIsSmallScreen = () => {
  return isSmallScreen;
};
const addChangeListener = (callback) => {
  changeCallbacks.push(callback);
};
const removeChangeListener = (callback) => {
  const index = changeCallbacks.findIndex((callbackInArray) => {
    return callbackInArray === callback;
  });
  changeCallbacks.splice(index, 1);
};
const handleChange = () => {
  const newIsSmallScreen = getIsSmallScreenFromBrowser();
  if (newIsSmallScreen !== isSmallScreen) {
    isSmallScreen = newIsSmallScreen;
    changeCallbacks.forEach((callback) => {
      callback(isSmallScreen);
    });
  }
};
isSmallScreen = getIsSmallScreenFromBrowser();
const mediaQueryList = window.matchMedia(QUERY);
mediaQueryList.addEventListener("change", handleChange);

const useIsSmallScreen = () => {
  const [isSmallScreen, setIsSmallScreen] = reactExports.useState(
    getIsSmallScreen()
  );
  reactExports.useEffect(() => {
    const updateMatch = () => {
      setIsSmallScreen(getIsSmallScreen());
    };
    updateMatch();
    addChangeListener(updateMatch);
    return () => {
      removeChangeListener(updateMatch);
    };
  }, []);
  return isSmallScreen;
};

const useConfirm = () => {
  const confirm = reactExports.useContext(
    ConfirmationServiceContext
  );
  if (!confirm) {
    throw new Error(
      "ConfirmationServiceContext is not initialized"
    );
  }
  return confirm;
};

const useConfirmDiscardingUnsavedChangesDialog = () => {
  const confirm = useConfirm();
  const confirmDiscardingUnsavedChanges = () => {
    return confirm({
      text: l("editor.discard-changes-confirmation.text"),
      confirmText: l("editor.discard-changes-confirmation.confirm"),
      cancelText: l("dialog.cancel"),
      encourageConfirmation: false
    });
  };
  return confirmDiscardingUnsavedChanges;
};

const AppMenu = () => {
  const {
    isAppMenuOpen,
    setIsAppMenuOpen
  } = reactExports.useContext(AppMenuContext);
  const [unsavedChanges, setUnsavedChanges] = reactExports.useContext(UnsavedChangesContext);
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const isSmallScreen = useIsSmallScreen();
  const confirmDiscardingUnsavedChanges = useConfirmDiscardingUnsavedChangesDialog();
  if (!isAppMenuOpen)
    return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    OutsideAlerter,
    {
      onOutsideClick: () => setIsAppMenuOpen(false),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "app-menu", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AppMenuItem,
          {
            disabled: false,
            label: l("menu.launchpad"),
            icon: "rocket_launch",
            onClick: async () => {
              if (unsavedChanges) {
                await confirmDiscardingUnsavedChanges();
                setUnsavedChanges(false);
              }
              navigate(getAppPath(PathTemplate.START));
              setIsAppMenuOpen(false);
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AppMenuItem,
          {
            disabled: !isInitialized(),
            label: isSmallScreen ? l("menu.note-list") : l("menu.editor"),
            icon: isSmallScreen ? "list" : "create",
            onClick: async () => {
              const target = getAppPath(
                isSmallScreen ? PathTemplate.LIST : PathTemplate.NEW_NOTE,
                /* @__PURE__ */ new Map([["GRAPH_ID", LOCAL_GRAPH_ID]])
              );
              if (pathname === target)
                return;
              if (unsavedChanges) {
                await confirmDiscardingUnsavedChanges();
                setUnsavedChanges(false);
              }
              navigate(target);
              setIsAppMenuOpen(false);
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AppMenuItem,
          {
            disabled: !isInitialized(),
            label: l("menu.files"),
            icon: "grid_view",
            onClick: async () => {
              const target = getAppPath(
                PathTemplate.FILES,
                /* @__PURE__ */ new Map([["GRAPH_ID", LOCAL_GRAPH_ID]])
              );
              if (pathname === target)
                return;
              if (unsavedChanges) {
                await confirmDiscardingUnsavedChanges();
                setUnsavedChanges(false);
              }
              navigate(target);
              setIsAppMenuOpen(false);
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AppMenuItem,
          {
            disabled: !isInitialized(),
            label: l("menu.stats"),
            icon: "query_stats",
            onClick: async () => {
              const target = getAppPath(
                PathTemplate.STATS,
                /* @__PURE__ */ new Map([["GRAPH_ID", LOCAL_GRAPH_ID]])
              );
              if (pathname === target)
                return;
              if (unsavedChanges) {
                await confirmDiscardingUnsavedChanges();
                setUnsavedChanges(false);
              }
              navigate(target);
              setIsAppMenuOpen(false);
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AppMenuItem,
          {
            disabled: false,
            label: l("menu.settings"),
            icon: "settings",
            onClick: async () => {
              const target = getAppPath(
                PathTemplate.SETTINGS,
                /* @__PURE__ */ new Map([["GRAPH_ID", LOCAL_GRAPH_ID]])
              );
              if (pathname === target)
                return;
              if (unsavedChanges) {
                await confirmDiscardingUnsavedChanges();
                setUnsavedChanges(false);
              }
              navigate(target);
              setIsAppMenuOpen(false);
            }
          }
        )
      ] })
    }
  );
};

const HeaderContainer = ({
  children,
  noBackground
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "app-header " + (noBackground ? "no-background" : ""), children }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AppMenu, {})
  ] });
};

const HeaderContainerLeftRight = ({
  leftContent,
  rightContent,
  noBackground
}) => {
  const { toggleAppMenu } = reactExports.useContext(AppMenuContext);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(HeaderContainer, { noBackground, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "header-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        AppTitle,
        {
          toggleAppMenu
        }
      ),
      leftContent
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "header-right", children: rightContent })
  ] });
};

const useKeyboardShortcuts = (handlers, elementRef) => {
  const handleKeydown = (e) => {
    if (handlers.onSave && (navigator.userAgentData.platform === "macOS" ? e.metaKey : e.ctrlKey) && e.key === "s" && !e.shiftKey) {
      handlers.onSave();
      e.preventDefault();
    }
    if (handlers.onCmdDot && (navigator.userAgentData.platform === "macOS" ? e.metaKey : e.ctrlKey) && e.key === ".") {
      handlers.onCmdDot();
      e.preventDefault();
    }
    if (handlers.onCmdB && (navigator.userAgentData.platform === "macOS" ? e.metaKey : e.ctrlKey) && e.key === "b") {
      handlers.onCmdB();
      e.preventDefault();
    }
    if (handlers.onCmdE && (navigator.userAgentData.platform === "macOS" ? e.metaKey : e.ctrlKey) && e.key === "e") {
      handlers.onCmdE();
      e.preventDefault();
    }
    if (handlers.onCmdI && (navigator.userAgentData.platform === "macOS" ? e.metaKey : e.ctrlKey) && e.key === "i") {
      handlers.onCmdI();
      e.preventDefault();
    }
    if (handlers.onArrowUp && e.key === "ArrowUp") {
      handlers.onArrowUp();
      e.preventDefault();
    }
    if (handlers.onArrowDown && e.key === "ArrowDown") {
      handlers.onArrowDown();
      e.preventDefault();
    }
    if (handlers.onEnter && e.key === "Enter") {
      handlers.onEnter();
      e.preventDefault();
    }
  };
  reactExports.useEffect(() => {
    if (elementRef?.current) {
      elementRef.current.addEventListener("keydown", handleKeydown);
    } else {
      document.body.addEventListener("keydown", handleKeydown);
    }
    return () => {
      if (elementRef?.current) {
        elementRef.current.removeEventListener("keydown", handleKeydown);
      } else {
        document.body.removeEventListener("keydown", handleKeydown);
      }
    };
  }, [handleKeydown, handlers, elementRef]);
};

const StartView = () => {
  const [
    memoryStorageProviderVisbility,
    setMemoryStorageProviderVisbility
  ] = reactExports.useState(false);
  const navigate = useNavigate();
  useKeyboardShortcuts({
    onCmdDot: () => {
      setMemoryStorageProviderVisbility(true);
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(HeaderContainerLeftRight, { noBackground: true }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "section-start", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "start-welcome",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: ASSETS_PATH + "app-icon/logo.svg",
                alt: l("start.logo.alt"),
                id: "start-logo"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "start-welcome-app-title", children: l("app.title") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: l("start.introduction") })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StartViewLocal, {}),
      memoryStorageProviderVisbility ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "memory-storage-providers",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "default-button default-action",
                id: "memory-storage-load-button",
                onClick: async () => {
                  await initializeNotesProvider(void 0, false);
                  const urlSearchParams = new URLSearchParams(window.location.search);
                  if (urlSearchParams.has("redirect")) {
                    navigate(urlSearchParams.get("redirect") ?? "/");
                  } else {
                    navigate(getAppPath(
                      PathTemplate.NEW_NOTE,
                      /* @__PURE__ */ new Map([["GRAPH_ID", LOCAL_GRAPH_ID]])
                    ));
                  }
                },
                children: "Memory Storage"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "default-button memory-storage",
                id: "memory-storage-dummy-notes-load-button",
                onClick: async () => {
                  await initializeNotesProvider(void 0, true);
                  const urlSearchParams = new URLSearchParams(window.location.search);
                  if (urlSearchParams.has("redirect")) {
                    navigate(urlSearchParams.get("redirect") ?? "/");
                  } else {
                    navigate(getAppPath(
                      PathTemplate.NEW_NOTE,
                      /* @__PURE__ */ new Map([["GRAPH_ID", LOCAL_GRAPH_ID]])
                    ));
                  }
                },
                children: "Memory Storage with dummy notes"
              }
            )
          ]
        }
      ) : "",
      /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "links", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: ROOT_PATH + "docs/index.html",
              children: l("start.links.user-manual")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://github.com/polyrainbow/neno/", children: l("start.links.source-code") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "version", children: VERSION })
      ] })
    ] })
  ] });
};

const AppHeaderStatsItem = ({
  icon,
  label,
  value
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "app-header-stats-item",
      title: label,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon$1, { icon, size: 24, title: label }),
        " ",
        value
      ]
    }
  );
};

const BusyIndicator = ({
  alt,
  height
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "img",
    {
      src: ASSETS_PATH + "busy.svg",
      alt,
      height
    }
  );
};

const AppHeaderStats = ({
  stats
}) => {
  const showStats = !!stats;
  if (!showStats) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "header-stats", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      BusyIndicator,
      {
        alt: l("stats.loading-stats"),
        height: 20
      }
    ) });
  }
  let percentageOfUnlinkedNotes = NaN;
  if (showStats && stats.numberOfAllNotes > 0) {
    percentageOfUnlinkedNotes = Math.round(
      stats.numberOfUnlinkedNotes / stats.numberOfAllNotes * 100 * 100
    ) / 100;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "header-stats", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AppHeaderStatsItem,
      {
        icon: "note",
        label: l("stats.number-of-notes"),
        value: stats.numberOfAllNotes.toLocaleString()
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AppHeaderStatsItem,
      {
        icon: "link",
        label: l("stats.number-of-links"),
        value: stats.numberOfLinks.toLocaleString()
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AppHeaderStatsItem,
      {
        icon: "link_off",
        label: l("stats.unlinked-notes"),
        value: `${stats.numberOfUnlinkedNotes.toLocaleString()}` + (percentageOfUnlinkedNotes ? ` (${percentageOfUnlinkedNotes.toLocaleString()} %)` : "")
      }
    )
  ] });
};

const NoteViewHeaderPinnedNote = ({
  note,
  isActive,
  onClick,
  onDragStart,
  onDragEnd,
  onDragOver
}) => {
  const noteTitle = getNoteTitle(note);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      className: "pinned-note " + (isActive ? "active" : ""),
      onClick: () => onClick(),
      draggable: true,
      onDragStart: (e) => {
        const wikilink = getWikilinkForNote(note.meta.slug, noteTitle);
        e.dataTransfer.effectAllowed = "linkMove";
        e.dataTransfer.dropEffect = "move";
        e.dataTransfer.setData("text/plain", wikilink);
        onDragStart();
      },
      onDragEnd: (e) => onDragEnd(e.nativeEvent),
      onDragOver: (e) => {
        e.dataTransfer.dropEffect = "move";
        onDragOver(e.nativeEvent);
        e.preventDefault();
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: getIconSrc("push_pin"),
            alt: "Pinned note",
            width: "24",
            height: "24",
            className: "svg-icon",
            draggable: false
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: shortenText(
          noteTitle || note.meta.slug,
          35
        ) })
      ]
    }
  );
};

const useGoToNote = () => {
  const navigate = useNavigate();
  const goToNote = (slug, params) => {
    const path = getAppPath(
      PathTemplate.EXISTING_NOTE,
      /* @__PURE__ */ new Map([
        ["GRAPH_ID", LOCAL_GRAPH_ID],
        ["SLUG", slug]
      ])
    );
    return navigate(path, {
      replace: params?.replace,
      state: {
        contentIfNewNote: params?.contentIfNewNote
      }
    });
  };
  return goToNote;
};

const FlexContainer = ({
  onClick,
  className,
  centerAlignedItems,
  children
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      onClick,
      className: "flex-container" + (className ? " " + className : "") + (centerAlignedItems ? " center-aligned-items" : ""),
      children
    }
  );
};

const NoteViewHeader = ({
  stats,
  pinnedNotes,
  activeNote,
  movePin
}) => {
  const confirmDiscardingUnsavedChanges = useConfirmDiscardingUnsavedChangesDialog();
  const goToNote = useGoToNote();
  const [unsavedChanges, setUnsavedChanges] = reactExports.useContext(UnsavedChangesContext);
  const { toggleAppMenu } = reactExports.useContext(AppMenuContext);
  const draggedPinIndex = reactExports.useRef(-1);
  const pinRects = reactExports.useRef(null);
  const [dragTargetSlotIndex, setDragTargetSlotIndex] = reactExports.useState(-1);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(HeaderContainer, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AppTitle,
      {
        toggleAppMenu
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      FlexContainer,
      {
        className: "pinned-notes",
        children: Array.isArray(pinnedNotes) ? pinnedNotes.length > 0 ? pinnedNotes.map(
          (pinnedNote, pinIndex) => {
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(reactExports.Fragment, { children: [
              draggedPinIndex.current > -1 && dragTargetSlotIndex === 0 && pinIndex === 0 && dragTargetSlotIndex !== draggedPinIndex.current && dragTargetSlotIndex !== draggedPinIndex.current + 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "pin-insert-indicator"
                },
                "pin-insert-indicator-start-0"
              ) : "",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                NoteViewHeaderPinnedNote,
                {
                  note: pinnedNote,
                  onDragStart: () => {
                    draggedPinIndex.current = pinIndex;
                    setDragTargetSlotIndex(pinIndex);
                    pinRects.current = Array.from(
                      document.querySelectorAll("button.pinned-note")
                    ).map((el) => {
                      return el.getBoundingClientRect();
                    });
                  },
                  onDragOver: (e) => {
                    if (!pinRects.current)
                      return;
                    let slotIndex = 0;
                    for (let p = 0; p < pinRects.current.length; p++) {
                      const pinRect = pinRects.current[p];
                      if (e.clientX > pinRect.x + pinRect.width / 2) {
                        slotIndex++;
                      } else {
                        break;
                      }
                    }
                    setDragTargetSlotIndex(slotIndex);
                  },
                  onDragEnd: (e) => {
                    const dpi = draggedPinIndex.current;
                    if (dragTargetSlotIndex === dpi || dragTargetSlotIndex === dpi + 1) {
                      setDragTargetSlotIndex(-1);
                      draggedPinIndex.current = -1;
                      e.preventDefault();
                      e.stopPropagation();
                      return false;
                    }
                    const offset = dragTargetSlotIndex > dpi ? dragTargetSlotIndex - dpi - 1 : dragTargetSlotIndex - dpi;
                    movePin(pinnedNote.meta.slug, offset);
                    setDragTargetSlotIndex(-1);
                    draggedPinIndex.current = -1;
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                  },
                  onClick: async () => {
                    if (activeNote && "slug" in activeNote && pinnedNote.meta.slug === activeNote.slug) {
                      return;
                    }
                    if (unsavedChanges) {
                      await confirmDiscardingUnsavedChanges();
                      setUnsavedChanges(false);
                    }
                    goToNote(pinnedNote.meta.slug);
                  },
                  isActive: !!activeNote && !activeNote.isUnsaved && pinnedNote.meta.slug === activeNote.slug
                },
                `pinnedNote_${pinnedNote.meta.slug}`
              ),
              draggedPinIndex.current > -1 && dragTargetSlotIndex === pinIndex + 1 && dragTargetSlotIndex !== draggedPinIndex.current && dragTargetSlotIndex !== draggedPinIndex.current + 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "pin-insert-indicator"
                },
                "pin-insert-indicator-end-" + pinIndex
              ) : ""
            ] }, "pin-fragment-" + pinnedNote.meta.slug);
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "pinned-notes-placeholder",
            children: l("app.pinned-notes-placeholder")
          }
        ) : ""
      }
    ),
    stats ? /* @__PURE__ */ jsxRuntimeExports.jsx(AppHeaderStats, { stats }) : ""
  ] });
};

var ElementNodeType = /* @__PURE__ */ ((ElementNodeType2) => {
  ElementNodeType2["CODE"] = "code";
  ElementNodeType2["PARAGRAPH"] = "paragraph";
  ElementNodeType2["QUOTE"] = "quote";
  ElementNodeType2["HEADING"] = "heading";
  ElementNodeType2["LIST_ITEM"] = "list-item";
  return ElementNodeType2;
})(ElementNodeType || {});

class HeadingNode extends ParagraphNode {
  static getType() {
    return ElementNodeType.HEADING;
  }
  static clone() {
    return new HeadingNode();
  }
  constructor() {
    super();
  }
  createDOM(config) {
    const element = super.createDOM(config);
    addClassNamesToElement(element, config.theme.sHeading);
    return element;
  }
  static importJSON() {
    throw new Error("Method not implemented.");
  }
  exportJSON() {
    return {
      ...super.exportJSON(),
      type: ElementNodeType.HEADING
    };
  }
}
function $createHeadingNode() {
  return $applyNodeReplacement(new HeadingNode());
}

class TransclusionNode extends DecoratorNode {
  static getType() {
    return "transclusion";
  }
  static clone(node) {
    return new TransclusionNode(
      node.__link,
      node.__getTransclusionContent,
      node.__key
    );
  }
  __link;
  __getTransclusionContent;
  constructor(link, getTransclusionContent, key) {
    super(key);
    this.__link = link;
    this.__getTransclusionContent = getTransclusionContent;
  }
  decorate() {
    const Transclusion = ({ slug }) => {
      const [content, setContent] = reactExports.useState(null);
      const [isError, setIsError] = reactExports.useState(false);
      reactExports.useEffect(() => {
        this.__getTransclusionContent(slug).then((content2) => {
          setContent(content2);
          setIsError(false);
        }).catch(() => {
          setContent(/* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Not available." }));
          setIsError(true);
        });
      }, [slug]);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "transclusion " + (isError ? "unavailable" : ""),
          "data-transclusion-id": slug,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "slug", children: this.__link }),
            isError ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "not-available-disclaimer", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Icon$1,
                {
                  icon: "warning",
                  title: l("editor.transclusion.not-available"),
                  size: 70
                }
              ),
              l("editor.transclusion.not-available")
            ] }) : content ?? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Loading..." })
          ]
        }
      );
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Transclusion, { slug: this.__link.substring(1) });
  }
  createDOM() {
    const div = document.createElement("div");
    div.classList.add("transclusion-wrapper");
    return div;
  }
  updateDOM() {
    return false;
  }
  static importJSON() {
    throw new Error("Method not implemented.");
  }
  exportJSON() {
    return super.exportJSON();
  }
  isInline() {
    return false;
  }
}
function $createTransclusionNode(link, getTransclusionContent) {
  return new TransclusionNode(link, getTransclusionContent);
}
function $isTransclusionNode(node) {
  return node instanceof TransclusionNode;
}

function createLinkMatcherWithRegExp(regExp, urlTransformer = (text) => text, attributes) {
  return (text) => {
    const match = regExp.exec(text);
    if (match === null)
      return null;
    return {
      attributes,
      index: match.index,
      length: match[0].length,
      text: match[0],
      url: urlTransformer(text)
    };
  };
}
function findFirstMatch(text, matchers) {
  for (let i = 0; i < matchers.length; i++) {
    const match = matchers[i](text);
    if (match) {
      return match;
    }
  }
  return null;
}
const SPACE = /\s/;
function isSeparator(char) {
  return SPACE.test(char);
}
function endsWithSeparator(textContent) {
  return isSeparator(textContent[textContent.length - 1]);
}
function startsWithSeparator(textContent) {
  return isSeparator(textContent[0]);
}
function isPreviousNodeValid(node) {
  let previousNode = node.getPreviousSibling();
  if ($isElementNode(previousNode)) {
    previousNode = previousNode.getLastDescendant();
  }
  return previousNode === null || $isLineBreakNode(previousNode) || $isTextNode(previousNode) && endsWithSeparator(previousNode.getTextContent());
}
function isNextNodeValid(node) {
  let nextNode = node.getNextSibling();
  if ($isElementNode(nextNode)) {
    nextNode = nextNode.getFirstDescendant();
  }
  return nextNode === null || $isLineBreakNode(nextNode) || $isTextNode(nextNode) && startsWithSeparator(nextNode.getTextContent()) || $isTransclusionNode(nextNode);
}
function isContentAroundIsValid(matchStart, matchEnd, text, node) {
  const contentBeforeIsValid = matchStart > 0 ? isSeparator(text[matchStart - 1]) : isPreviousNodeValid(node);
  if (!contentBeforeIsValid) {
    return false;
  }
  const contentAfterIsValid = matchEnd < text.length ? isSeparator(text[matchEnd]) : isNextNodeValid(node);
  return contentAfterIsValid;
}
function handleLinkCreation(node, matchers, onChange) {
  const nodeText = node.getTextContent();
  let text = nodeText;
  let invalidMatchEnd = 0;
  let remainingTextNode = node;
  let match;
  while ((match = findFirstMatch(text, matchers)) && match !== null) {
    const matchStart = match.index;
    const matchLength = match.length;
    const matchEnd = matchStart + matchLength;
    const isValid = isContentAroundIsValid(
      invalidMatchEnd + matchStart,
      invalidMatchEnd + matchEnd,
      nodeText,
      node
    );
    if (isValid) {
      let linkTextNode;
      if (invalidMatchEnd + matchStart === 0) {
        [linkTextNode, remainingTextNode] = remainingTextNode.splitText(
          invalidMatchEnd + matchLength
        );
      } else {
        [, linkTextNode, remainingTextNode] = remainingTextNode.splitText(
          invalidMatchEnd + matchStart,
          invalidMatchEnd + matchStart + matchLength
        );
      }
      const linkNode = $createAutoLinkNode(match.url, match.attributes);
      const textNode = $createTextNode(match.text);
      textNode.setFormat(linkTextNode.getFormat());
      textNode.setDetail(linkTextNode.getDetail());
      linkNode.append(textNode);
      linkTextNode.replace(linkNode);
      onChange(match.url, null);
      invalidMatchEnd = 0;
    } else {
      invalidMatchEnd += matchEnd;
    }
    text = text.substring(matchEnd);
  }
}
function handleLinkEdit(linkNode, matchers, onChange) {
  const children = linkNode.getChildren();
  const childrenLength = children.length;
  for (let i = 0; i < childrenLength; i++) {
    const child = children[i];
    if (!$isTextNode(child) || !child.isSimpleText()) {
      replaceWithChildren(linkNode);
      onChange(null, linkNode.getURL());
      return;
    }
  }
  const text = linkNode.getTextContent();
  const match = findFirstMatch(text, matchers);
  if (match === null || match.text !== text) {
    replaceWithChildren(linkNode);
    onChange(null, linkNode.getURL());
    return;
  }
  if (!isPreviousNodeValid(linkNode) || !isNextNodeValid(linkNode)) {
    replaceWithChildren(linkNode);
    onChange(null, linkNode.getURL());
    return;
  }
  const url = linkNode.getURL();
  if (url !== match.url) {
    linkNode.setURL(match.url);
    onChange(match.url, url);
  }
  if (match.attributes) {
    const rel = linkNode.getRel();
    if (rel !== match.attributes.rel) {
      linkNode.setRel(match.attributes.rel || null);
      onChange(match.attributes.rel || null, rel);
    }
    const target = linkNode.getTarget();
    if (target !== match.attributes.target) {
      linkNode.setTarget(match.attributes.target || null);
      onChange(match.attributes.target || null, target);
    }
  }
}
function handleBadNeighbors(textNode, matchers, onChange) {
  const previousSibling = textNode.getPreviousSibling();
  const nextSibling = textNode.getNextSibling();
  const text = textNode.getTextContent();
  if ($isAutoLinkNode(previousSibling) && !startsWithSeparator(text)) {
    previousSibling.append(textNode);
    handleLinkEdit(previousSibling, matchers, onChange);
    onChange(null, previousSibling.getURL());
  }
  if ($isAutoLinkNode(nextSibling) && !endsWithSeparator(text)) {
    replaceWithChildren(nextSibling);
    handleLinkEdit(nextSibling, matchers, onChange);
    onChange(null, nextSibling.getURL());
  }
}
function replaceWithChildren(node) {
  const children = node.getChildren();
  const childrenLength = children.length;
  for (let j = childrenLength - 1; j >= 0; j--) {
    node.insertAfter(children[j]);
  }
  node.remove();
  return children.map((child) => child.getLatest());
}
function useAutoLink(editor, matchers, onChange) {
  reactExports.useEffect(() => {
    if (!editor.hasNodes([AutoLinkNode])) {
      throw new Error(
        "LexicalAutoLinkPlugin: AutoLinkNode not registered on editor"
      );
    }
    const onChangeWrapped = (url, prevUrl) => {
      if (onChange) {
        onChange(url, prevUrl);
      }
    };
    return mergeRegister(
      editor.registerNodeTransform(TextNode, (textNode) => {
        const parent = textNode.getParentOrThrow();
        const previous = textNode.getPreviousSibling();
        if ($isAutoLinkNode(parent)) {
          handleLinkEdit(parent, matchers, onChangeWrapped);
        } else if (!$isLinkNode(parent)) {
          if (textNode.isSimpleText() && (startsWithSeparator(textNode.getTextContent()) || !$isAutoLinkNode(previous))) {
            handleLinkCreation(textNode, matchers, onChangeWrapped);
          }
          handleBadNeighbors(textNode, matchers, onChangeWrapped);
        }
      }),
      /*
        We need a paragraph node transformer here for the following use case:
        Removing the space between "/1 /2". This whitespace removal would not
        trigger the above text node transform as it would just remove the
        text node between the two link nodes which stay untouched. But we need
        to unify these two link nodes into one: "/1/2". So let's check if there
        are two link nodes next to each other and remove one of them to trigger
        another transform.
      */
      editor.registerNodeTransform(ParagraphNode, (paragraphNode) => {
        const children = paragraphNode.getChildren();
        for (let childrenIndex = 0; childrenIndex < children.length; childrenIndex++) {
          const child = children[childrenIndex];
          const nextChild = children[childrenIndex + 1];
          if ($isAutoLinkNode(child) && $isAutoLinkNode(nextChild)) {
            replaceWithChildren(child);
          }
        }
      })
    );
  }, [editor, matchers, onChange]);
}
function AutoLinkPlugin({
  matchers,
  onChange
}) {
  const [editor] = useLexicalComposerContext();
  useAutoLink(editor, matchers, onChange);
  return null;
}

const URL_REGEX = /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}(\.[a-zA-Z0-9()]{1,13})?\b([-a-zA-Z0-9()@:%_+.~#!?&//=,;']*)/;
const EMAIL_REGEX = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
const SLASHLINK_REGEX = /(@[\p{L}\p{M}\d\-_/]+)?(\/[\p{L}\p{M}\d\-_:.]+)+/u;
const MATCHERS = [
  createLinkMatcherWithRegExp(
    URL_REGEX,
    (text) => {
      return text.startsWith("http") ? text : `https://${text}`;
    },
    {
      rel: "noopener noreferrer"
    }
  ),
  createLinkMatcherWithRegExp(EMAIL_REGEX, (text) => {
    return `mailto:${text}`;
  }),
  createLinkMatcherWithRegExp(SLASHLINK_REGEX, (text) => {
    return "#" + text.substring(1);
  })
];
function LexicalAutoLinkPlugin() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AutoLinkPlugin, { matchers: MATCHERS });
}

class WikiLinkContentNode extends TextNode {
  constructor(text, getLinkAvailability) {
    super(text);
    this.getLinkAvailability = getLinkAvailability;
  }
  static getType() {
    return "wikiLinkContent";
  }
  static clone(node) {
    return new WikiLinkContentNode(node.__text, node.getLinkAvailability);
  }
  createDOM(config) {
    const element = super.createDOM(config);
    addClassNamesToElement(element, config.theme.wikiLinkContent);
    this.getLinkAvailability(this.__text).then((isAvailable) => {
      if (isAvailable) {
        element?.classList.add("available");
      } else {
        element?.classList.add("unavailable");
      }
    });
    return element;
  }
  updateDOM(_prevNode, element) {
    this.getLinkAvailability(this.__text).then((isAvailable) => {
      if (isAvailable) {
        element?.classList.add("available");
      } else {
        element?.classList.add("unavailable");
      }
    });
    return true;
  }
  // Dummy function. This will never happen.
  static importJSON(serializedNode) {
    const node = $createWikiLinkContentNode(
      serializedNode.text,
      () => Promise.resolve(true)
    );
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }
  canInsertTextBefore() {
    return false;
  }
  isTextEntity() {
    return true;
  }
  isInline() {
    return true;
  }
  exportJSON() {
    return {
      ...super.exportJSON(),
      type: "wikiLinkContent"
    };
  }
  isValid() {
    const text = this.__text;
    return text.length > 0 && !text.includes("[") && !text.includes("]");
  }
}
function $createWikiLinkContentNode(text = "", getLinkAvailability) {
  return $applyNodeReplacement(
    new WikiLinkContentNode(text, getLinkAvailability)
  );
}
function $isWikiLinkContentNode(node) {
  return node instanceof WikiLinkContentNode;
}

class WikiLinkPunctuationNode extends TextNode {
  static getType() {
    return "wikiLinkPunctuation";
  }
  static clone(node) {
    return new WikiLinkPunctuationNode(node.__isClosing);
  }
  __isClosing = false;
  constructor(isClosing) {
    super(isClosing ? "]]" : "[[");
    this.__isClosing = isClosing;
  }
  createDOM(config) {
    const element = super.createDOM(config);
    addClassNamesToElement(element, config.theme.wikiLinkPunctuation);
    return element;
  }
  static importJSON(serializedNode) {
    const node = $createWikiLinkPunctuationNode(serializedNode.__isClosing);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }
  canInsertTextBefore() {
    return false;
  }
  isTextEntity() {
    return true;
  }
  isInline() {
    return true;
  }
  isValid() {
    return this.__isClosing && this.__text === "]]" || !this.__isClosing && this.__text === "[[";
  }
  exportJSON() {
    return {
      ...super.exportJSON(),
      type: "wikiLinkPunctuation"
    };
  }
}
function $createWikiLinkPunctuationNode(isClosing) {
  return $applyNodeReplacement(new WikiLinkPunctuationNode(isClosing));
}
function $isWikiLinkPunctuationNode(node) {
  return node instanceof WikiLinkPunctuationNode;
}

const REGEX$2 = /\[\[[^[\]]+\]\]/;
const getWikiLinkMatch = (text) => {
  const matchArr = REGEX$2.exec(text);
  if (matchArr === null) {
    return null;
  }
  const wikiLinkLength = matchArr[0].length;
  const startOffset = matchArr.index;
  const endOffset = startOffset + wikiLinkLength;
  return {
    end: endOffset,
    start: startOffset
  };
};
function registerWikilinkTransforms(editor, getLinkAvailability) {
  const replaceWithSimpleText = (node) => {
    const textNode = $createTextNode(node.getTextContent());
    textNode.setFormat(node.getFormat());
    node.replace(textNode);
  };
  const textNodeTransform = (node) => {
    if (!node.isSimpleText()) {
      return;
    }
    let text = node.getTextContent();
    let currentNode = node;
    let match;
    while (true) {
      match = getWikiLinkMatch(text);
      const nextText = match === null ? "" : text.slice(match.end);
      text = nextText;
      if (match === null) {
        return;
      }
      let nodeToReplace;
      if (match.start === 0) {
        [nodeToReplace, currentNode] = currentNode.splitText(match.end);
      } else {
        [, nodeToReplace, currentNode] = currentNode.splitText(
          match.start,
          match.end
        );
      }
      const wikilinkTextContent = nodeToReplace.getTextContent().slice(
        2,
        nodeToReplace.getTextContent().length - 2
      );
      const replacementNode1 = $createWikiLinkPunctuationNode(false);
      const replacementNode2 = $createWikiLinkContentNode(
        wikilinkTextContent,
        getLinkAvailability
      );
      const replacementNode3 = $createWikiLinkPunctuationNode(true);
      nodeToReplace.insertAfter(replacementNode1);
      replacementNode1.insertAfter(replacementNode2);
      replacementNode2.insertAfter(replacementNode3);
      const selection = $getSelection();
      let selectionOffset = NaN;
      if ($isRangeSelection(selection) && selection.focus.key === nodeToReplace.getKey()) {
        selectionOffset = selection.focus.offset;
      }
      nodeToReplace.remove();
      if (!isNaN(selectionOffset)) {
        if (selectionOffset < 3) {
          replacementNode1.select(selectionOffset, selectionOffset);
        } else if (selectionOffset > nodeToReplace.getTextContent().length - 2) {
          const newNodeOffset = selectionOffset - replacementNode2.getTextContent().length - 2;
          replacementNode3.select(newNodeOffset, newNodeOffset);
        } else {
          const newNodeOffset = selectionOffset - 2;
          replacementNode2.select(newNodeOffset, newNodeOffset);
        }
      }
    }
  };
  const reverseWikilinkContentNodeTransform = (node) => {
    if (!node.getParent())
      return;
    const prevSibling = node.getPreviousSibling();
    const nextSibling = node.getNextSibling();
    if (!$isWikiLinkPunctuationNode(prevSibling) || !$isWikiLinkPunctuationNode(nextSibling) || !node.isValid() || !prevSibling.isValid() || !nextSibling.isValid()) {
      replaceWithSimpleText(node);
      $isWikiLinkPunctuationNode(prevSibling) && replaceWithSimpleText(prevSibling);
      $isWikiLinkPunctuationNode(nextSibling) && replaceWithSimpleText(nextSibling);
    }
  };
  const reverseWikilinkPunctuationNodeTransform = (node) => {
    if (!node.getParent())
      return;
    const hasAccompanyingContentNode = node.__isClosing ? $isWikiLinkContentNode(node.getPreviousSibling()) : $isWikiLinkContentNode(node.getNextSibling());
    if (!node.isValid() || !hasAccompanyingContentNode) {
      replaceWithSimpleText(node);
    }
  };
  const removePlainTextTransform = editor.registerNodeTransform(
    TextNode,
    textNodeTransform
  );
  const removeReverseWikilinkContentNodeTransform = editor.registerNodeTransform(
    WikiLinkContentNode,
    reverseWikilinkContentNodeTransform
  );
  const removeReverseWikilinkPunctuationNodeTransform = editor.registerNodeTransform(
    WikiLinkPunctuationNode,
    reverseWikilinkPunctuationNodeTransform
  );
  return [
    removePlainTextTransform,
    removeReverseWikilinkContentNodeTransform,
    removeReverseWikilinkPunctuationNodeTransform
  ];
}
function WikiLinkPlugin({
  getLinkAvailability
}) {
  const [editor] = useLexicalComposerContext();
  reactExports.useEffect(() => {
    if (!editor.hasNodes([WikiLinkContentNode, WikiLinkPunctuationNode])) {
      throw new Error("WikiLinkPlugin: WikiLinkNodes not registered on editor");
    }
    return mergeRegister(
      ...registerWikilinkTransforms(
        editor,
        getLinkAvailability
      )
    );
  }, [editor]);
  return null;
}

class BoldNode extends TextNode {
  static getType() {
    return "bold";
  }
  static clone(node) {
    return new BoldNode(node.__text, node.__key);
  }
  constructor(text, key) {
    super(text, key);
  }
  createDOM(config) {
    const element = super.createDOM(config);
    addClassNamesToElement(element, config.theme.bold);
    return element;
  }
  static importJSON(serializedNode) {
    const node = $createBoldNode(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }
  exportJSON() {
    return {
      ...super.exportJSON(),
      type: "bold"
    };
  }
  canInsertTextBefore() {
    return false;
  }
  isTextEntity() {
    return true;
  }
}
function $createBoldNode(text = "") {
  return $applyNodeReplacement(new BoldNode(text));
}

const REGEX$1 = /\*[^*]+\*/;
function BoldPlugin() {
  const [editor] = useLexicalComposerContext();
  reactExports.useEffect(() => {
    if (!editor.hasNodes([BoldNode])) {
      throw new Error("BoldPlugin: BoldNode not registered on editor");
    }
  }, [editor]);
  const createBoldNode = reactExports.useCallback((textNode) => {
    return $createBoldNode(textNode.getTextContent());
  }, []);
  const getBoldMatch = reactExports.useCallback((text) => {
    const matchArr = REGEX$1.exec(text);
    if (matchArr === null) {
      return null;
    }
    const headingLength = matchArr[0].length;
    const startOffset = matchArr.index;
    const endOffset = startOffset + headingLength;
    return {
      end: endOffset,
      start: startOffset
    };
  }, []);
  useLexicalTextEntity(
    getBoldMatch,
    BoldNode,
    createBoldNode
  );
  return null;
}

const transclusionsMatchSlashlinks = (slashlinks, transclusions) => {
  if (slashlinks.length !== transclusions.length)
    return false;
  for (let i = 0; i < slashlinks.length; i++) {
    if (slashlinks[i].getTextContent() !== transclusions[i].__link) {
      return false;
    }
  }
  return true;
};
const splitParagraphAtLineBreaks = (node) => {
  const selection = $getSelection();
  let cursor = node;
  let startOffset = 0;
  let endOffset;
  node.getTextContent().split("\n").forEach((line, i) => {
    const paragraphNode = $createParagraphNode();
    const textNode = $createTextNode(line);
    paragraphNode.append(textNode);
    cursor.insertAfter(paragraphNode);
    cursor = paragraphNode;
    endOffset = startOffset + line.length;
    if ($isRangeSelection(selection) && selection.focus.offset >= startOffset && selection.focus.offset <= endOffset) {
      paragraphNode.select(selection.focus.offset - startOffset);
    }
    startOffset = endOffset + i;
  });
  node.remove();
  cursor.selectEnd();
};
const refreshTransclusionsForBlock = (node, getTransclusionContent) => {
  if (node.getType() === ElementNodeType.PARAGRAPH && node.getTextContent().includes("\n")) {
    splitParagraphAtLineBreaks(node);
    return;
  }
  const slashlinks = [
    ElementNodeType.PARAGRAPH,
    ElementNodeType.LIST_ITEM,
    ElementNodeType.HEADING
  ].includes(node.getType()) ? node.getChildren().filter((child) => {
    return $isAutoLinkNode(child) && (child.getTextContent().startsWith("/") || child.getTextContent().startsWith("@"));
  }) : [];
  const transclusions = node.getChildren().filter(
    (child) => {
      return $isTransclusionNode(child);
    }
  );
  if (transclusionsMatchSlashlinks(slashlinks, transclusions)) {
    return;
  }
  while ($isTransclusionNode(node.getLastChild())) {
    node.getLastChild()?.remove();
  }
  slashlinks.forEach((slashlinkNode) => {
    const transclusionNode = $createTransclusionNode(
      slashlinkNode.getTextContent(),
      getTransclusionContent
    );
    node.append(transclusionNode);
  });
};

class ListItemNode extends ParagraphNode {
  static getType() {
    return ElementNodeType.LIST_ITEM;
  }
  static clone() {
    return new ListItemNode();
  }
  constructor() {
    super();
  }
  createDOM(config) {
    const element = super.createDOM(config);
    addClassNamesToElement(element, config.theme.listItem);
    return element;
  }
  static importJSON() {
    throw new Error("Method not implemented.");
  }
  exportJSON() {
    return {
      ...super.exportJSON(),
      type: ElementNodeType.LIST_ITEM
    };
  }
}
function $createListItemNode() {
  return $applyNodeReplacement(new ListItemNode());
}

const registerBlockNodeTransform = (editor, getTransclusionContent) => {
  editor.registerNodeTransform(ParagraphNode, (node) => {
    refreshTransclusionsForBlock(node, getTransclusionContent);
  });
  editor.registerNodeTransform(ListItemNode, (node) => {
    refreshTransclusionsForBlock(node, getTransclusionContent);
  });
  editor.registerNodeTransform(HeadingNode, (node) => {
    refreshTransclusionsForBlock(node, getTransclusionContent);
  });
  editor.registerNodeTransform(AutoLinkNode, (node) => {
    let block = node.getParent();
    while (!$isParagraphNode(block)) {
      block = block.getParent();
    }
    refreshTransclusionsForBlock(block, getTransclusionContent);
  });
};
function TransclusionPlugin({
  getTransclusionContent
}) {
  const [editor] = useLexicalComposerContext();
  reactExports.useEffect(() => {
    if (!editor.hasNodes([TransclusionNode])) {
      throw new Error("Transclusion plugin is missing required nodes");
    }
    return registerBlockNodeTransform(
      editor,
      getTransclusionContent
    );
  }, [editor]);
  return null;
}

const documentMode = "documentMode" in document ? document.documentMode : null;
const CAN_USE_BEFORE_INPUT = "InputEvent" in window && !documentMode ? "getTargetRanges" in new window.InputEvent("input") : false;
const IS_SAFARI = /Version\/[\d.]+.*Safari/.test(navigator.userAgent);
const IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const IS_CHROME = /^(?=.*Chrome).*/i.test(navigator.userAgent);
const IS_APPLE_WEBKIT = /AppleWebKit\/[\d.]+/.test(navigator.userAgent) && !IS_CHROME;

function onCopyForPlainText(event, editor) {
  if (!event)
    return;
  editor.update(() => {
    const clipboardData = event instanceof KeyboardEvent ? null : event.clipboardData;
    const selection = $getSelection();
    if (selection !== null && clipboardData !== null) {
      event.preventDefault();
      clipboardData.setData("text/plain", selection.getTextContent());
    }
  });
}
function onPasteForPlainText(event, editor) {
  event.preventDefault();
  editor.update(
    () => {
      const selection = $getSelection();
      const clipboardData = event instanceof InputEvent || event instanceof KeyboardEvent ? null : event.clipboardData;
      if (clipboardData !== null && $isRangeSelection(selection)) {
        $insertDataTransferForPlainText(clipboardData, selection);
      }
    },
    {
      tag: "paste"
    }
  );
}
function onCutForPlainText(event, editor) {
  onCopyForPlainText(event, editor);
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      selection.removeText();
    }
  });
}
function registerSubtext(editor) {
  const removeListener = mergeRegister(
    editor.registerCommand(
      DELETE_CHARACTER_COMMAND,
      (isBackward) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }
        selection.deleteCharacter(isBackward);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    ),
    editor.registerCommand(
      DELETE_WORD_COMMAND,
      (isBackward) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }
        selection.deleteWord(isBackward);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    ),
    editor.registerCommand(
      DELETE_LINE_COMMAND,
      (isBackward) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }
        selection.deleteLine(isBackward);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    ),
    editor.registerCommand(
      CONTROLLED_TEXT_INSERTION_COMMAND,
      (eventOrText) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }
        if (typeof eventOrText === "string") {
          selection.insertText(eventOrText);
        } else {
          const dataTransfer = eventOrText.dataTransfer;
          if (dataTransfer !== null) {
            $insertDataTransferForPlainText(dataTransfer, selection);
          } else {
            const data = eventOrText.data;
            if (data) {
              selection.insertText(data);
            }
          }
        }
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    ),
    editor.registerCommand(
      REMOVE_TEXT_COMMAND,
      () => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }
        selection.removeText();
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    ),
    editor.registerCommand(
      INSERT_LINE_BREAK_COMMAND,
      () => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }
        selection.insertParagraph();
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    ),
    editor.registerCommand(
      SELECT_ALL_COMMAND,
      () => {
        $selectAll();
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    ),
    editor.registerCommand(
      INSERT_PARAGRAPH_COMMAND,
      () => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }
        selection.insertParagraph();
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    ),
    editor.registerCommand(
      KEY_ARROW_LEFT_COMMAND,
      (payload) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }
        const event = payload;
        const isHoldingShift = event.shiftKey;
        if ($shouldOverrideDefaultCharacterSelection(selection, true)) {
          event.preventDefault();
          $moveCharacter(selection, isHoldingShift, true);
          return true;
        }
        return false;
      },
      COMMAND_PRIORITY_EDITOR
    ),
    editor.registerCommand(
      KEY_ARROW_RIGHT_COMMAND,
      (payload) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }
        const event = payload;
        const isHoldingShift = event.shiftKey;
        if ($shouldOverrideDefaultCharacterSelection(selection, false)) {
          event.preventDefault();
          $moveCharacter(selection, isHoldingShift, false);
          return true;
        }
        return false;
      },
      COMMAND_PRIORITY_EDITOR
    ),
    editor.registerCommand(
      KEY_BACKSPACE_COMMAND,
      (event) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }
        event.preventDefault();
        return editor.dispatchCommand(DELETE_CHARACTER_COMMAND, true);
      },
      COMMAND_PRIORITY_EDITOR
    ),
    editor.registerCommand(
      KEY_DELETE_COMMAND,
      (event) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }
        event.preventDefault();
        return editor.dispatchCommand(DELETE_CHARACTER_COMMAND, false);
      },
      COMMAND_PRIORITY_EDITOR
    ),
    editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }
        if (event !== null) {
          if ((IS_IOS || IS_SAFARI || IS_APPLE_WEBKIT) && CAN_USE_BEFORE_INPUT) {
            return false;
          }
          event.preventDefault();
        }
        return editor.dispatchCommand(INSERT_LINE_BREAK_COMMAND, false);
      },
      COMMAND_PRIORITY_EDITOR
    ),
    editor.registerCommand(
      COPY_COMMAND,
      (event) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }
        onCopyForPlainText(event, editor);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    ),
    editor.registerCommand(
      CUT_COMMAND,
      (event) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }
        onCutForPlainText(event, editor);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    ),
    editor.registerCommand(
      PASTE_COMMAND,
      (event) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }
        onPasteForPlainText(event, editor);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    ),
    editor.registerCommand(
      DROP_COMMAND,
      (event) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }
        event.preventDefault();
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    ),
    editor.registerCommand(
      DRAGSTART_COMMAND,
      (event) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }
        event.preventDefault();
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    )
  );
  return removeListener;
}

function useSubtextSetup(editor) {
  reactExports.useLayoutEffect(() => {
    return mergeRegister(
      registerSubtext(editor)
    );
  }, [editor]);
}

function useDecorators(editor, ErrorBoundary) {
  const [decorators, setDecorators] = reactExports.useState(
    () => editor.getDecorators()
  );
  reactExports.useLayoutEffect(() => {
    return editor.registerDecoratorListener((nextDecorators) => {
      reactDomExports.flushSync(() => {
        setDecorators(nextDecorators);
      });
    });
  }, [editor]);
  reactExports.useEffect(() => {
    setDecorators(editor.getDecorators());
  }, [editor]);
  return reactExports.useMemo(() => {
    const decoratedPortals = [];
    const decoratorKeys = Object.keys(decorators);
    for (let i = 0; i < decoratorKeys.length; i++) {
      const nodeKey = decoratorKeys[i];
      const reactDecorator = /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorBoundary, { onError: (e) => editor._onError(e), children: /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: null, children: decorators[nodeKey] }) });
      const element = editor.getElementByKey(nodeKey);
      if (element !== null) {
        decoratedPortals.push(reactDomExports.createPortal(reactDecorator, element, nodeKey));
      }
    }
    return decoratedPortals;
  }, [ErrorBoundary, decorators, editor]);
}

function SubtextPlugin({
  ErrorBoundary
}) {
  const [editor] = useLexicalComposerContext();
  const decorators = useDecorators(editor, ErrorBoundary);
  useSubtextSetup(editor);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: decorators });
}

const getSubtextFromEditor = (root) => {
  return root.getChildren().map((paragraph) => paragraph.getTextContent()).join("\n");
};

class InlineCodeNode extends TextNode {
  static getType() {
    return "inline-code";
  }
  static clone(node) {
    return new InlineCodeNode(node.__text, node.__key);
  }
  constructor(text, key) {
    super(text, key);
  }
  createDOM(config) {
    const element = super.createDOM(config);
    addClassNamesToElement(element, config.theme.inlineCode);
    return element;
  }
  static importJSON(serializedNode) {
    const node = $createInlineCodeNode(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }
  exportJSON() {
    return {
      ...super.exportJSON(),
      type: "inline-code"
    };
  }
  canInsertTextBefore() {
    return false;
  }
  isTextEntity() {
    return true;
  }
}
function $createInlineCodeNode(text = "") {
  return $applyNodeReplacement(new InlineCodeNode(text));
}

const REGEX = /`[^`]+`/;
function InlineCodePlugin() {
  const [editor] = useLexicalComposerContext();
  reactExports.useEffect(() => {
    if (!editor.hasNodes([InlineCodeNode])) {
      throw new Error(
        "InlineCodePlugin: InlineCodeNode not registered on editor"
      );
    }
  }, [editor]);
  const createInlineCodeNode = reactExports.useCallback(
    (textNode) => {
      return $createInlineCodeNode(textNode.getTextContent());
    },
    []
  );
  const getInlineCodeMatch = reactExports.useCallback((text) => {
    const matchArr = REGEX.exec(text);
    if (matchArr === null) {
      return null;
    }
    const headingLength = matchArr[0].length;
    const startOffset = matchArr.index;
    const endOffset = startOffset + headingLength;
    return {
      end: endOffset,
      start: startOffset
    };
  }, []);
  useLexicalTextEntity(
    getInlineCodeMatch,
    InlineCodeNode,
    createInlineCodeNode
  );
  return null;
}

class CodeBlockNode extends ParagraphNode {
  static getType() {
    return ElementNodeType.CODE;
  }
  constructor() {
    super();
  }
  static clone() {
    return new CodeBlockNode();
  }
  createDOM(config) {
    const element = super.createDOM(config);
    addClassNamesToElement(element, config.theme.codeBlock);
    return element;
  }
  static importJSON() {
    throw new Error("Method not implemented.");
  }
  exportJSON() {
    return {
      ...super.exportJSON(),
      type: ElementNodeType.CODE
    };
  }
}
function $createCodeBlockNode() {
  return $applyNodeReplacement(new CodeBlockNode());
}

class QuoteBlockNode extends ParagraphNode {
  static getType() {
    return ElementNodeType.QUOTE;
  }
  constructor() {
    super();
  }
  static clone() {
    return new QuoteBlockNode();
  }
  createDOM(config) {
    const element = super.createDOM(config);
    addClassNamesToElement(element, config.theme.quoteBlock);
    return element;
  }
  static importJSON() {
    throw new Error("Method not implemented.");
  }
  exportJSON() {
    return {
      ...super.exportJSON(),
      type: ElementNodeType.QUOTE
    };
  }
}
function $createQuoteBlockNode() {
  return $applyNodeReplacement(new QuoteBlockNode());
}

const assignCorrectElementNodes = (elementNodes) => {
  const typeNodeShouldHaveMap = /* @__PURE__ */ new Map();
  let insideCodeBlock = false;
  for (const node of elementNodes) {
    const nodeText = node.getTextContent();
    if (!insideCodeBlock) {
      if (nodeText.startsWith("```")) {
        typeNodeShouldHaveMap.set(node, ElementNodeType.CODE);
        insideCodeBlock = true;
      } else if (nodeText.startsWith(">")) {
        typeNodeShouldHaveMap.set(node, ElementNodeType.QUOTE);
      } else if (nodeText.startsWith("#")) {
        typeNodeShouldHaveMap.set(node, ElementNodeType.HEADING);
      } else if (nodeText.startsWith("-")) {
        typeNodeShouldHaveMap.set(node, ElementNodeType.LIST_ITEM);
      } else {
        typeNodeShouldHaveMap.set(node, ElementNodeType.PARAGRAPH);
      }
    } else {
      if (nodeText.trimEnd() === "```") {
        typeNodeShouldHaveMap.set(node, ElementNodeType.CODE);
        insideCodeBlock = false;
      } else {
        typeNodeShouldHaveMap.set(node, ElementNodeType.CODE);
      }
    }
  }
  elementNodes.forEach((elementNode) => {
    const currentNodeType = elementNode.getType();
    const typeNodeShouldHave = typeNodeShouldHaveMap.get(elementNode);
    if (currentNodeType !== typeNodeShouldHave) {
      if (typeNodeShouldHave === ElementNodeType.PARAGRAPH) {
        elementNode.replace($createParagraphNode(), true);
      } else if (typeNodeShouldHave === ElementNodeType.CODE) {
        elementNode.replace($createCodeBlockNode(), true);
      } else if (typeNodeShouldHave === ElementNodeType.QUOTE) {
        elementNode.replace($createQuoteBlockNode(), true);
      } else if (typeNodeShouldHave === ElementNodeType.HEADING) {
        elementNode.replace($createHeadingNode(), true);
      } else if (typeNodeShouldHave === ElementNodeType.LIST_ITEM) {
        elementNode.replace($createListItemNode(), true);
      } else {
        throw new Error("Unknown node type: " + typeNodeShouldHave);
      }
    }
  });
};
function BlockTransformPlugin() {
  const [editor] = useLexicalComposerContext();
  reactExports.useEffect(() => {
    editor.registerNodeTransform(RootNode, (root) => {
      assignCorrectElementNodes(root.getChildren());
      $setCompositionKey(null);
    });
    editor.registerNodeTransform(LineBreakNode, (node) => {
      const element = node.getParent();
      if ($isRootNode(element)) {
        return;
      }
      const prevSiblings = node.getPreviousSiblings();
      const nextSiblings = node.getNextSiblings();
      const n1 = $createParagraphNode();
      n1.append(...prevSiblings);
      const n2 = $createParagraphNode();
      n2.append(...nextSiblings);
      element.replace(n1, false);
      n1.insertAfter(n2);
      element.remove();
    });
  }, [editor]);
  return null;
}

var LinkType = /* @__PURE__ */ ((LinkType2) => {
  LinkType2["SLASHLINK"] = "SLASHLINK";
  LinkType2["WIKILINK"] = "WIKILINK";
  return LinkType2;
})(LinkType || {});

var UserRequestType = /* @__PURE__ */ ((UserRequestType2) => {
  UserRequestType2["HYPERLINK"] = "HYPERLINK";
  UserRequestType2["WIKILINK"] = "WIKILINK";
  UserRequestType2["SLASHLINK"] = "SLASHLINK";
  UserRequestType2["TRANSCLUSION_TARGET"] = "TRANSCLUSION_TARGET";
  return UserRequestType2;
})(UserRequestType || {});

const setSubtext = (root, text) => {
  root.clear();
  const blocks = text.split("\n");
  blocks.forEach((blockText) => {
    const blockNode = $createParagraphNode();
    const textNode = $createTextNode(blockText);
    textNode.markDirty();
    blockNode.append(textNode);
    root.append(blockNode);
  });
};

const PlainTextStateExchangePlugin = ({
  initialText,
  instanceId
}) => {
  const [editor] = useLexicalComposerContext();
  const currentInstanceIdRef = reactExports.useRef(0);
  reactExports.useEffect(() => {
    editor.update(() => {
      const root = $getRoot();
      if (currentInstanceIdRef.current !== instanceId) {
        setSubtext(root, initialText);
        editor.dispatchCommand(CLEAR_HISTORY_COMMAND, void 0);
        root.getFirstChild()?.selectStart();
        editor.focus();
      }
      currentInstanceIdRef.current = instanceId;
    });
  }, [editor, initialText, instanceId]);
  return null;
};

const theme = {
  ltr: "ltr",
  rtl: "rtl",
  placeholder: "editor-placeholder",
  paragraph: "editor-paragraph",
  hashtag: "hashtag",
  link: "link",
  sHeading: "s-heading",
  // "heading" seems to be a reserved word
  wikiLinkPunctuation: "wikilink-punctuation",
  wikiLinkContent: "wikilink-content",
  bold: "bold",
  subtext: "subtext",
  inlineCode: "inline-code",
  codeBlock: "code-block",
  quoteBlock: "quote-block",
  listItem: "list-item"
};

function AutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();
  reactExports.useEffect(() => {
    editor.focus();
  }, [editor]);
  return null;
}

const Editor = ({
  initialText,
  instanceId,
  onChange,
  onUserRequest,
  getTransclusionContent,
  getLinkAvailability
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ContentEditable, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SubtextPlugin,
      {
        ErrorBoundary: LexicalErrorBoundary
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PlainTextStateExchangePlugin,
      {
        initialText,
        instanceId
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(OnChangePlugin, { onChange: (editorState) => {
      editorState.read(() => {
        const root = $getRoot();
        onChange(getSubtextFromEditor(root));
      });
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(HistoryPlugin, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AutoFocusPlugin, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BoldPlugin, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(InlineCodePlugin, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(LexicalAutoLinkPlugin, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(WikiLinkPlugin, { getLinkAvailability: (linkText) => {
      return getLinkAvailability(linkText, LinkType.WIKILINK);
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      TransclusionPlugin,
      {
        getTransclusionContent
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BlockTransformPlugin, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      NodeEventPlugin,
      {
        nodeType: AutoLinkNode,
        eventType: "click",
        eventListener: (e) => {
          const isSlashlink = (str) => {
            return str.startsWith("@") || str.startsWith("/");
          };
          if (!(e && e.target))
            return;
          const link = e.target.innerText;
          if (isSlashlink(link)) {
            onUserRequest(UserRequestType.SLASHLINK, link.substring(1));
          } else {
            onUserRequest(UserRequestType.HYPERLINK, link);
          }
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      NodeEventPlugin,
      {
        nodeType: WikiLinkContentNode,
        eventType: "click",
        eventListener: (e) => {
          if (!(e && e.target))
            return;
          const link = e.target.innerText;
          onUserRequest(UserRequestType.WIKILINK, link);
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      NodeEventPlugin,
      {
        nodeType: TransclusionNode,
        eventType: "click",
        eventListener: (e) => {
          if (!(e && e.target))
            return;
          let cursorElement = e.target;
          do {
            if ("transclusionId" in cursorElement.dataset) {
              const transclusionId = cursorElement.dataset.transclusionId;
              onUserRequest(
                UserRequestType.TRANSCLUSION_TARGET,
                transclusionId
              );
              return;
            }
            cursorElement = cursorElement.parentElement;
          } while (cursorElement);
        }
      }
    )
  ] });
};
const Context = ({
  children
}) => {
  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError: (error) => {
      console.error(error);
    },
    nodes: [
      AutoLinkNode,
      HeadingNode,
      WikiLinkContentNode,
      WikiLinkPunctuationNode,
      BoldNode,
      TransclusionNode,
      InlineCodeNode,
      CodeBlockNode,
      QuoteBlockNode,
      ListItemNode
    ]
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(LexicalComposer, { initialConfig, children });
};

const NoteStatsFileLink = ({
  file
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Link,
    {
      to: getAppPath(PathTemplate.FILE, /* @__PURE__ */ new Map([
        ["GRAPH_ID", LOCAL_GRAPH_ID],
        ["FILE_SLUG", file.slug]
      ])),
      children: getFilenameFromFileSlug(file.slug)
    },
    "note-stats-link-" + file.slug
  );
};

const NoteStats = ({
  note
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      id: "stats",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: l("editor.stats.heading") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("table", { className: "data-table", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l("editor.stats.slug") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: note.slug })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l("editor.stats.created-at") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: note.createdAt === void 0 ? l("editor.stats.unknown") : makeTimestampHumanReadable(note.createdAt) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l("editor.stats.updated-at") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: note.updatedAt === void 0 ? l("editor.stats.unknown") : makeTimestampHumanReadable(note.updatedAt) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l("editor.stats.number-of-blocks") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: parse(note.initialContent).length })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l("editor.stats.number-of-lines") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: note.initialContent.split("\n").length })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l("editor.stats.number-of-outgoing-links") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: note.outgoingLinks.length })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l("editor.stats.number-of-backlinks") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: note.backlinks.length })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l("editor.stats.number-of-characters") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: note.numberOfCharacters })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l("editor.stats.files") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: note.files.length > 0 ? note.files.map((file, i, array) => {
              const fileType = getMediaTypeFromFilename(file.slug);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                reactExports.Fragment,
                {
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      NoteStatsFileLink,
                      {
                        file
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
                    "(",
                    fileType,
                    ", ",
                    humanFileSize(file.size),
                    ")",
                    i < array.length - 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}) : null
                  ]
                },
                "nsfwt_" + file.slug + note.slug
              );
            }) : l("editor.stats.files.none") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l("editor.stats.flags") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: note.flags.length > 0 ? note.flags.join(", ") : l("editor.stats.flags.none") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l("editor.stats.content-type") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: note.contentType })
          ] })
        ] }) })
      ]
    }
  );
};

function replaceAt(array, index, value) {
  const ret = array.slice(0);
  ret[index] = value;
  return ret;
}
const NoteKeyValues = ({
  note,
  setNote,
  setUnsavedChanges
}) => {
  const displayedKeyValuePairs = note.keyValues;
  const setDisplayedKeyValuePairs = (val) => {
    setNote({
      ...note,
      keyValues: val
    });
  };
  const addKeyValuePair = () => {
    setDisplayedKeyValuePairs([...displayedKeyValuePairs, ["", ""]]);
  };
  const removeKeyValuePair = (keyToRemove) => {
    setDisplayedKeyValuePairs(
      displayedKeyValuePairs.filter(([key]) => key !== keyToRemove)
    );
  };
  const changeValue = (index, newValue) => {
    const key = displayedKeyValuePairs[index][0];
    setDisplayedKeyValuePairs(
      replaceAt(displayedKeyValuePairs, index, [key, newValue])
    );
  };
  const changeKey = (index, newKey) => {
    const value = displayedKeyValuePairs[index][1];
    setDisplayedKeyValuePairs(
      replaceAt(displayedKeyValuePairs, index, [newKey, value])
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: "key-values",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: l("note.custom-metadata") }),
        displayedKeyValuePairs.map(
          ([key, value], index) => {
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "key-value-row",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      value: key,
                      onInput: (e) => {
                        if (e.nativeEvent.data === ":") {
                          e.preventDefault();
                          return;
                        }
                        changeKey(index, e.target.value);
                        setUnsavedChanges(true);
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      value,
                      onInput: (e) => {
                        changeValue(
                          index,
                          e.target.value
                        );
                        setUnsavedChanges(true);
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      className: "default-button-small",
                      onClick: () => {
                        removeKeyValuePair(key);
                        setUnsavedChanges(true);
                      },
                      children: l("note.custom-metadata.remove")
                    }
                  )
                ]
              },
              "kv_" + index
            );
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "default-button",
            onClick: () => {
              addKeyValuePair();
              setUnsavedChanges(true);
            },
            children: l("note.custom-metadata.add")
          }
        )
      ]
    }
  );
};

const NotesProviderContext = reactExports.createContext(
  null
);

const useNotesProvider = () => {
  const notesProviderContext = reactExports.useContext(NotesProviderContext);
  if (!notesProviderContext) {
    throw new Error("NotesProviderContext is not initialized");
  }
  return notesProviderContext;
};

const NoteControls = ({
  activeNote,
  handleNoteSaveRequest,
  removeActiveNote,
  unsavedChanges,
  setUnsavedChanges,
  pinOrUnpinNote,
  duplicateNote,
  handleUploadFilesRequest,
  importNote,
  disableNoteSaving,
  handleNoteExportRequest
}) => {
  const confirmDiscardingUnsavedChanges = useConfirmDiscardingUnsavedChangesDialog();
  const navigate = useNavigate();
  const isSmallScreen = useIsSmallScreen();
  const confirm = useConfirm();
  const goToNote = useGoToNote();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    isSmallScreen ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      IconButton,
      {
        id: "button_list",
        title: l("editor.go-to-list"),
        icon: "list",
        onClick: async () => {
          if (unsavedChanges) {
            await confirmDiscardingUnsavedChanges();
            setUnsavedChanges(false);
          }
          navigate(getAppPath(
            PathTemplate.LIST,
            /* @__PURE__ */ new Map([["GRAPH_ID", LOCAL_GRAPH_ID]])
          ));
        }
      }
    ) : null,
    !isSmallScreen ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        IconButton,
        {
          id: "button_new",
          title: l("editor.new-note"),
          icon: "add",
          onClick: async () => {
            if (unsavedChanges) {
              await confirmDiscardingUnsavedChanges();
              setUnsavedChanges(false);
            }
            goToNote("new");
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        IconButton,
        {
          id: "button_create-linked-note",
          disabled: activeNote.isUnsaved,
          title: l("editor.create-linked-note"),
          icon: "add_circle",
          onClick: async () => {
            if (activeNote.isUnsaved)
              return;
            if (unsavedChanges) {
              await confirmDiscardingUnsavedChanges();
              setUnsavedChanges(false);
            }
            goToNote("new", {
              contentIfNewNote: getWikilinkForNote(
                activeNote.slug,
                getNoteTitleFromActiveNote(activeNote)
              )
            });
          }
        }
      )
    ] }) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      IconButton,
      {
        id: "button_upload",
        title: l("editor.save-note"),
        icon: "save",
        disabled: disableNoteSaving,
        onClick: handleNoteSaveRequest
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      IconButton,
      {
        id: "button_remove",
        disabled: activeNote.isUnsaved,
        title: l("editor.remove-note"),
        icon: "delete",
        onClick: async () => {
          await confirm({
            text: l("editor.remove-note.confirm.text"),
            confirmText: l("editor.remove-note.confirm.confirm"),
            cancelText: l("dialog.cancel"),
            encourageConfirmation: false
          });
          removeActiveNote();
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      IconButton,
      {
        id: "button_duplicate",
        disabled: activeNote.isUnsaved,
        title: l("editor.duplicate-note"),
        icon: "content_copy",
        onClick: () => duplicateNote()
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      IconButton,
      {
        id: "button_pin",
        disabled: activeNote.isUnsaved,
        title: l("editor.pin-note"),
        icon: "push_pin",
        onClick: () => {
          if (activeNote.isUnsaved)
            return;
          pinOrUnpinNote(activeNote.slug);
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      IconButton,
      {
        id: "button_import-note",
        disabled: !activeNote.isUnsaved,
        title: l("editor.import-note"),
        icon: "file_upload",
        onClick: async () => {
          if (unsavedChanges) {
            await confirmDiscardingUnsavedChanges();
          }
          importNote();
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      IconButton,
      {
        id: "button_export-note",
        disabled: false,
        title: l("editor.export-note"),
        icon: "file_download",
        onClick: () => handleNoteExportRequest()
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      IconButton,
      {
        id: "button_upload-file",
        disabled: false,
        title: l("editor.upload-file"),
        icon: "upload_file",
        onClick: () => handleUploadFilesRequest()
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      IconButton,
      {
        id: "button_random-note",
        disabled: false,
        title: l("editor.open-random-note"),
        icon: "question_mark",
        onClick: async () => {
          if (unsavedChanges) {
            await confirmDiscardingUnsavedChanges();
            setUnsavedChanges(false);
          }
          goToNote("random");
        }
      }
    )
  ] });
};

const StatusIndicatorItem = ({
  isActive,
  title,
  icon
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: isActive ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    Icon$1,
    {
      icon,
      title,
      size: 24
    }
  ) : "" });
};

const StatusIndicator = ({
  isNew,
  hasUnsavedChanges,
  isEverythingSaved,
  isUploading
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      StatusIndicatorItem,
      {
        isActive: isNew,
        title: l("editor.note-has-not-been-saved-yet"),
        icon: "fiber_new"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      StatusIndicatorItem,
      {
        isActive: hasUnsavedChanges,
        title: l("editor.unsaved-changes"),
        icon: "stream"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      StatusIndicatorItem,
      {
        isActive: isEverythingSaved,
        title: l("editor.no-unsaved-changes"),
        icon: "done"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      StatusIndicatorItem,
      {
        isActive: isUploading,
        title: l("editor.upload-in-progress"),
        icon: "file_upload"
      }
    )
  ] });
};

const NoteMenuBar = ({
  activeNote,
  handleNoteSaveRequest,
  removeActiveNote,
  unsavedChanges,
  setUnsavedChanges,
  pinOrUnpinNote,
  duplicateNote,
  handleUploadFilesRequest,
  uploadInProgress,
  importNote,
  disableNoteSaving,
  handleNoteExportRequest
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "note-controls", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "note-controls-left", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      NoteControls,
      {
        activeNote,
        handleNoteSaveRequest,
        removeActiveNote,
        unsavedChanges,
        setUnsavedChanges,
        pinOrUnpinNote,
        duplicateNote,
        handleUploadFilesRequest,
        importNote,
        disableNoteSaving,
        handleNoteExportRequest
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "note-controls-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      StatusIndicator,
      {
        isNew: activeNote.isUnsaved,
        hasUnsavedChanges: unsavedChanges,
        isEverythingSaved: !unsavedChanges,
        isUploading: uploadInProgress
      }
    ) })
  ] });
};

const NoteListItemLinkedNotesIndicator = ({
  isActive,
  numberOfLinkedNotes,
  onLinkIndicatorClick,
  isLinkable
}) => {
  const linkControlLabel = !isLinkable && typeof numberOfLinkedNotes === "number" ? l("list.item.links.linked-to-x-notes", {
    numberOfLinkedNotes: numberOfLinkedNotes.toString()
  }) : isActive ? l("list.item.links.currently-selected") : l("list.item.links.link");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      className: "note-list-item-linked-notes-indicator " + (isLinkable ? "linkable" : "not-linkable"),
      onClick: (e) => {
        onLinkIndicatorClick?.();
        e.stopPropagation();
      },
      title: linkControlLabel,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "note-list-item-linked-notes-indicator-content",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: getIconSrc("link"),
                alt: linkControlLabel,
                className: "svg-icon"
              }
            ),
            typeof numberOfLinkedNotes === "number" && !isNaN(numberOfLinkedNotes) ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "linked-notes-indicator-number",
                children: numberOfLinkedNotes > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: numberOfLinkedNotes }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    title: l("list.item.links.not-linked"),
                    className: "unlinked-note-indicator"
                  }
                )
              }
            ) : ""
          ]
        }
      )
    }
  );
};

const ICON_SIZE = 15;
const NoteListItemFeatures = ({
  features
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: "note-features",
      children: [
        features.containsWeblink ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Icon$1,
          {
            icon: "public",
            title: l("list.item.features.contains-links"),
            size: ICON_SIZE
          }
        ) : null,
        features.containsCode ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Icon$1,
          {
            icon: "code",
            title: l("list.item.features.contains-code"),
            size: ICON_SIZE
          }
        ) : null,
        features.containsImages ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Icon$1,
          {
            icon: "image",
            title: l("list.item.features.contains-images"),
            size: ICON_SIZE
          }
        ) : null,
        features.containsDocuments ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Icon$1,
          {
            icon: "note",
            title: l("list.item.features.contains-documents"),
            size: ICON_SIZE
          }
        ) : null,
        features.containsAudio ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Icon$1,
          {
            icon: "headphones",
            title: l("list.item.features.contains-audio"),
            size: ICON_SIZE
          }
        ) : null,
        features.containsVideo ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Icon$1,
          {
            icon: "movie",
            title: l("list.item.features.contains-video"),
            size: ICON_SIZE
          }
        ) : null
      ]
    }
  );
};

const NoteListItemInfo = ({
  note
}) => {
  const sections = [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "slug", children: [
      "/",
      note.slug
    ] }, "nli-" + note.slug)
  ];
  if (typeof note.updatedAt === "number") {
    sections.push(
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: new Date(note.updatedAt).toLocaleDateString() })
    );
  }
  if ("numberOfFiles" in note) {
    if (note.numberOfFiles > 0) {
      sections.push(
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: l(
          note.numberOfFiles > 1 ? "list.item.files" : "list.item.file",
          { files: note.numberOfFiles.toString() }
        ) })
      );
    }
    if (Object.values(note.features).some((val) => val === true)) {
      sections.push(
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          NoteListItemFeatures,
          {
            features: note.features
          }
        )
      );
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "note-list-item-info",
      children: sections.map((section, i, sections2) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        reactExports.Fragment,
        {
          children: [
            section,
            i < sections2.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "separator",
                children: SPAN_SEPARATOR
              }
            )
          ]
        },
        "nlii_" + i
      ))
    }
  );
};

const NoteListItem = ({
  note,
  isActive,
  isSelected,
  isLinked,
  onSelect,
  onLinkIndicatorClick,
  isLinkable
}) => {
  const trClassList = ["note-list-item"];
  if (isActive) {
    trClassList.push("active");
  }
  if (isLinked) {
    trClassList.push("linked");
  }
  if (isSelected) {
    trClassList.push("selected");
  }
  trClassList.push(isLinkable ? "linkable" : "not-linkable");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: trClassList.join(" "),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "note-list-item-main with-link-edge",
            onClick: () => onSelect(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "title",
                  children: note.title || l("list.untitled-note")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(NoteListItemInfo, { note })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          NoteListItemLinkedNotesIndicator,
          {
            isLinkable,
            isActive,
            numberOfLinkedNotes: "linkCount" in note ? note.linkCount.sum : null,
            onLinkIndicatorClick
          }
        )
      ]
    }
  );
};

const NoteBacklinks = ({
  note,
  setUnsavedChanges,
  unsavedChanges,
  onLinkIndicatorClick
}) => {
  const goToNote = useGoToNote();
  const confirmDiscardingUnsavedChanges = useConfirmDiscardingUnsavedChangesDialog();
  if (!("backlinks" in note))
    return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "note-backlinks-section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: l(
      "editor.backlinks",
      { backlinks: note.backlinks.length.toString() }
    ) }),
    note.backlinks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "p",
      {
        className: "note-meta-paragraph",
        children: l("editor.no-backlinks-yet")
      }
    ) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "note-backlinks", children: note.backlinks.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0)).map((displayedLinkedNote) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      NoteListItem,
      {
        note: displayedLinkedNote,
        onSelect: async () => {
          if (unsavedChanges) {
            await confirmDiscardingUnsavedChanges();
            setUnsavedChanges(false);
          }
          goToNote(displayedLinkedNote.slug);
        },
        isActive: false,
        isLinked: true,
        isSelected: false,
        isLinkable: true,
        onLinkIndicatorClick: () => {
          onLinkIndicatorClick(
            displayedLinkedNote.slug,
            displayedLinkedNote.title
          );
        }
      },
      "note-link-list-item-" + displayedLinkedNote.slug
    )) })
  ] });
};

const NoteSlugUpdateReferencesToggle = ({
  isActivated,
  setIsActivated
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "update-references-toggle", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "switch", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "checkbox",
          checked: isActivated,
          onChange: (e) => setIsActivated(e.target.checked)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "slider round" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "update-references-toggle-text", children: l("note.slug.update-references") })
  ] });
};

const NoteSlug = ({
  note,
  slugInput,
  setSlugInput,
  displayedSlugAliases,
  setDisplayedSlugAliases,
  setUnsavedChanges,
  updateReferences,
  setUpdateReferences
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "slug-lines", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "slug-line canonical", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          placeholder: "slug",
          className: "note-slug " + (!NotesProvider.isValidSlugOrEmpty(slugInput) ? "invalid" : ""),
          onInput: (e) => {
            const element = e.currentTarget;
            const newValue = element.value.replace(
              // In the input field, we also allow \p{SK} modifiers, as
              // they are used to create a full letter with modifier in a
              // second step. They are not valid slug characters on their own,
              // though.
              // We also allow apostrophes ('), as they might be used as a
              // dead key for letters like é.
              // Unfortunately, it seems like we cannot simulate pressing
              // dead keys in Playwright currently, so we cannot
              // add a meaningful test for this.
              /[^\p{L}\p{Sk}\d\-/._']/gu,
              ""
            ).toLowerCase();
            setSlugInput(newValue);
            setUnsavedChanges(true);
          },
          value: slugInput,
          onKeyDown: (e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              document.querySelector(
                "div[data-lexical-editor]"
              )?.focus();
            }
            if (e.key === "Escape") {
              e.preventDefault();
              setSlugInput("slug" in note ? note.slug : "");
            }
          }
        }
      ),
      !NotesProvider.isValidSlugOrEmpty(slugInput) ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "note-slug-validation-error", children: l("note.slug.invalid-slug").toLocaleUpperCase() }) : "",
      "slug" in note && note.slug !== slugInput && NotesProvider.isValidSlug(slugInput) ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        NoteSlugUpdateReferencesToggle,
        {
          isActivated: updateReferences,
          setIsActivated: (val) => {
            setUpdateReferences(val);
          }
        }
      ) : "",
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "alias-control-button",
          onClick: () => {
            const newDisplayedSlugAliases = [...displayedSlugAliases];
            newDisplayedSlugAliases.push("");
            setDisplayedSlugAliases(newDisplayedSlugAliases);
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Icon$1,
            {
              icon: "add",
              title: "Add alias",
              size: 20
            }
          )
        }
      )
    ] }),
    displayedSlugAliases.map((slugAlias, index) => {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "slug-line canonical",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                placeholder: "alias",
                className: "note-slug " + (!NotesProvider.isValidSlugOrEmpty(slugInput) ? "invalid" : ""),
                onInput: (e) => {
                  const element = e.currentTarget;
                  const newValue = element.value.replace(
                    // In the input field, we also allow \p{SK} modifiers, as
                    // they are used to create a full letter with modifier in a
                    // second step. They are not valid slug characters on its own,
                    // though.
                    // We also allow apostrophes ('), as they might be used as a
                    // dead key for letters like é.
                    // Unfortunately, it seems like we cannot simulate pressing
                    // dead keys in Playwright currently, so we cannot
                    // add a meaningful test for this.
                    /[^\p{L}\p{Sk}\d\-/._']/gu,
                    ""
                  ).toLowerCase();
                  const newDisplayedSlugAliases = [...displayedSlugAliases];
                  newDisplayedSlugAliases[index] = newValue;
                  setDisplayedSlugAliases(newDisplayedSlugAliases);
                  setUnsavedChanges(true);
                },
                value: slugAlias,
                onKeyDown: (e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    document.querySelector(
                      "div[data-lexical-editor]"
                    )?.focus();
                  }
                  if (e.key === "Escape") {
                    e.preventDefault();
                    const newDisplayedSlugAliases = Array.from(displayedSlugAliases).splice(index, 1);
                    setDisplayedSlugAliases(newDisplayedSlugAliases);
                  }
                }
              }
            ),
            !NotesProvider.isValidSlugOrEmpty(slugAlias) ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "note-slug-validation-error", children: l("note.slug.invalid-slug").toLocaleUpperCase() }) : "",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "alias-control-button",
                onClick: () => {
                  const newDisplayedSlugAliases = [...displayedSlugAliases];
                  newDisplayedSlugAliases.splice(index, 1);
                  setDisplayedSlugAliases(newDisplayedSlugAliases);
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Icon$1,
                  {
                    icon: "delete",
                    title: "Remove alias",
                    size: 20
                  }
                )
              }
            )
          ]
        },
        "sla-" + index
      );
    })
  ] });
};

const NoteContentBlockActions = ({
  file
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(FlexContainer, { className: "preview-block-file-actions", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: getAppPath(PathTemplate.FILE, /* @__PURE__ */ new Map([
      ["GRAPH_ID", LOCAL_GRAPH_ID],
      ["FILE_SLUG", file.slug]
    ])), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Icon$1,
      {
        icon: "info",
        title: "File details",
        size: 24
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "a",
      {
        className: "preview-block-file-download-button",
        onClick: (e) => {
          saveFile(file.slug);
          e.stopPropagation();
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Icon$1,
          {
            icon: "file_download",
            title: l("note.download-file"),
            size: 24
          }
        )
      }
    )
  ] });
};

const NoteContentBlockAudio = ({
  file,
  notesProvider
}) => {
  const [url, setUrl] = reactExports.useState("");
  reactExports.useEffect(() => {
    getUrl(file).then((url2) => {
      setUrl(url2);
    });
  }, [file, notesProvider]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "preview-block-file-wrapper",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preview-block-file-first-line", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preview-block-file-info", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "preview-block-file-info-title", children: file.slug }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "preview-block-file-size", children: humanFileSize(file.size) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(NoteContentBlockActions, { file })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "preview-block-audio-second-line", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "audio",
          {
            controls: true,
            src: url
          }
        ) })
      ]
    },
    file.slug
  );
};

const NoteContentBlockVideo = ({
  file,
  notesProvider
}) => {
  const [url, setUrl] = reactExports.useState("");
  reactExports.useEffect(() => {
    getUrl(file).then((url2) => {
      setUrl(url2);
    });
  }, [file, notesProvider]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "preview-block-file-wrapper",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preview-block-file-first-line", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preview-block-file-info", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "preview-block-file-info-title", children: file.slug }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "preview-block-file-size", children: humanFileSize(file.size) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(NoteContentBlockActions, { file })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "preview-block-video-second-line", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "video",
          {
            controls: true,
            src: url
          }
        ) })
      ]
    },
    file.slug
  );
};

const NoteContentBlockImage = ({
  file,
  notesProvider
}) => {
  const [url, setUrl] = reactExports.useState("");
  reactExports.useEffect(() => {
    getUrl(file).then((url2) => {
      setUrl(url2);
    });
  }, [file, notesProvider]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "preview-block-image-wrapper",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: url,
          alt: file.slug
        }
      )
    },
    file.slug
  );
};

const NoteContentBlockTextFile = ({
  file,
  notesProvider
}) => {
  const [text, setText] = reactExports.useState("");
  reactExports.useEffect(() => {
    getUrl(file).then((url) => {
      return fetch(url);
    }).then((response) => response.text()).then((text2) => setText(text2));
  }, [file, notesProvider]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "preview-block-file-wrapper",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preview-block-file-first-line", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "preview-block-file-info", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "preview-block-file-info-title", children: file.slug }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(NoteContentBlockActions, { file })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "preview-block-audio-second-line", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "pre",
          {
            className: "preview-block-file-text",
            children: text
          },
          Math.random()
        ) })
      ]
    },
    file.slug
  );
};

const NoteContentBlockDocument = ({
  file
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "preview-block-file-wrapper",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preview-block-file-first-line", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preview-block-file-info", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "preview-block-file-info-title", children: file.slug }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "preview-block-file-size", children: humanFileSize(file.size) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(NoteContentBlockActions, { file })
      ] })
    },
    file.slug
  );
};

const getSummary = (noteContent, noteTitle) => {
  const MAX_LINES = 5;
  const nonEmptyLines = noteContent.split("\n").filter((line) => line.trim().length > 0);
  let transclusionContent;
  const noteContentContainsTitle = removeWikilinkPunctuation(nonEmptyLines[0]).includes(noteTitle);
  if (nonEmptyLines.length <= MAX_LINES) {
    transclusionContent = noteContentContainsTitle ? nonEmptyLines.slice(1).join("\n") : nonEmptyLines.join("\n");
  } else {
    transclusionContent = getLines(
      noteContent,
      noteContentContainsTitle ? 1 : 0,
      MAX_LINES,
      true
    ) + "\n…";
  }
  return removeWikilinkPunctuation(transclusionContent);
};
const getNoteTransclusionContent = (noteContent, noteTitle) => {
  const summary = getSummary(noteContent, noteTitle);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "transclusion-note-content", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "transclusion-note-title", children: noteTitle }),
    summary
  ] });
};
const getTransclusionContent = async (slug, note, notesProvider) => {
  if (!slug) {
    throw new Error("INVALID_FILE_SLUG");
  }
  if (isFileSlug(slug)) {
    const availableFileInfos = [
      ...note.files
    ];
    const mediaType = getMediaTypeFromFilename(slug);
    let file = availableFileInfos.find((file2) => file2.slug === slug);
    if (!file) {
      file = await notesProvider.getFileInfo(slug);
    }
    if (mediaType === MediaType.AUDIO) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        NoteContentBlockAudio,
        {
          file,
          notesProvider
        },
        file.slug
      );
    } else if (mediaType === MediaType.VIDEO) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        NoteContentBlockVideo,
        {
          file,
          notesProvider
        },
        file.slug
      );
    } else if (mediaType === MediaType.IMAGE) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        NoteContentBlockImage,
        {
          file,
          notesProvider
        },
        file.slug
      );
    } else if (mediaType === MediaType.TEXT) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        NoteContentBlockTextFile,
        {
          file,
          notesProvider
        },
        file.slug
      );
    } else {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        NoteContentBlockDocument,
        {
          file
        },
        file.slug
      );
    }
  }
  if ("outgoingLinks" in note) {
    const linkedNote2 = note.outgoingLinks.find(
      (link) => link.slug === slug
    );
    if (linkedNote2) {
      return getNoteTransclusionContent(linkedNote2.content, linkedNote2.title);
    }
  }
  const linkedNote = await notesProvider.get(slug);
  return getNoteTransclusionContent(
    linkedNote.content,
    getNoteTitle(linkedNote)
  );
};

const insert = (text, editor) => {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      selection.insertText(text);
    }
  });
};
const concatenateInsertItems = (items) => {
  let concatenatedText = "";
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const itemBefore = i > 0 ? items[i] : null;
    if (item.type === "file-slug") {
      if (itemBefore?.value.endsWith(" ") || itemBefore?.type === "file-slug") {
        concatenatedText += " ";
      }
    } else {
      if (itemBefore?.type === "file-slug" && !item.value.startsWith(" ")) {
        concatenatedText += " ";
      }
    }
    concatenatedText += item.value;
  }
  return concatenatedText;
};
const insertItems = (items, editor) => {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      let concatenatedText = concatenateInsertItems(items);
      const selectionIsCollapsed = selection.focus.key === selection.anchor.key && selection.focus.offset === selection.anchor.offset;
      if (selectionIsCollapsed) {
        const anchorNode = selection.anchor.getNode();
        const charBeforeCursor = anchorNode.getTextContent()[selection.anchor.offset - 1];
        if (charBeforeCursor && !isWhiteSpace$1(charBeforeCursor)) {
          concatenatedText = " " + concatenatedText;
        }
        let charAfterCursor = anchorNode.getTextContent()[selection.anchor.offset];
        if (!charAfterCursor && anchorNode.getNextSibling()) {
          charAfterCursor = anchorNode.getNextSibling().getTextContent()[0];
        }
        if (charAfterCursor && !isWhiteSpace$1(charAfterCursor)) {
          concatenatedText = concatenatedText + " ";
        }
      }
      selection.insertText(concatenatedText);
    }
  });
};
const toggleWikilinkWrap = (editor) => {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const text = selection.getTextContent();
      if (text.startsWith("[[") && text.endsWith("]]")) {
        selection.insertText(text.substring(2, text.length - 2));
      } else {
        selection.insertText(`[[${text}]]`);
        if (text.length === 0) {
          selection.anchor.offset -= 2;
          selection.focus.offset -= 2;
        }
      }
    }
  });
};

const Note = ({
  editorInstanceId,
  isBusy,
  note,
  setNote,
  slugInput,
  setSlugInput,
  displayedSlugAliases,
  setDisplayedSlugAliases,
  handleEditorContentChange,
  addFilesToNoteObject,
  setUnsavedChanges,
  handleNoteSaveRequest,
  removeActiveNote,
  unsavedChanges,
  pinOrUnpinNote,
  duplicateNote,
  importNote,
  uploadInProgress,
  setUploadInProgress,
  updateReferences,
  setUpdateReferences,
  onLinkIndicatorClick,
  handleNoteExportRequest
}) => {
  const noteElement = reactExports.useRef(null);
  const notesProvider = useNotesProvider();
  const goToNote = useGoToNote();
  const confirmDiscardingUnsavedChanges = useConfirmDiscardingUnsavedChangesDialog();
  const navigate = useNavigate();
  const [editor] = useLexicalComposerContext();
  const insertFilesAndStringsToNote = (fileOrString) => {
    const items = fileOrString.map((fos) => {
      if (typeof fos === "string") {
        return {
          type: "string",
          value: fos
        };
      } else {
        return {
          type: "file-slug",
          value: "/" + fos.slug
        };
      }
    });
    insertItems(items, editor);
  };
  const uploadFiles = async (notesProvider2, files) => {
    setUploadInProgress(true);
    const fileInfos = await Promise.all(
      files.map(
        (file) => {
          return notesProvider2.addFile(
            file.stream(),
            file.name
          );
        }
      )
    );
    setUploadInProgress(false);
    addFilesToNoteObject(fileInfos);
    return fileInfos;
  };
  const uploadFilesAndInsertFileSlugsToNote = async (notesProvider2, files) => {
    const fileInfos = await uploadFiles(notesProvider2, files);
    insertFilesAndStringsToNote(fileInfos);
  };
  const handleUploadFilesRequest = async () => {
    if (!notesProvider)
      throw new Error("NotesProvider not ready");
    const files = await getFilesFromUserSelection(
      FILE_PICKER_ACCEPT_TYPES,
      true
    );
    return uploadFilesAndInsertFileSlugsToNote(notesProvider, files);
  };
  const handleDrop = async (e) => {
    e.preventDefault();
    const promisesToWaitFor = [];
    [...e.dataTransfer.items].forEach((item) => {
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file) {
          setUploadInProgress(true);
          const fileUploadPromise = notesProvider.addFile(
            file.stream(),
            file.name
          );
          promisesToWaitFor.push(fileUploadPromise);
        }
      } else {
        const stringTransformPromise = new Promise((resolve) => {
          item.getAsString((val) => {
            resolve(val);
          });
        });
        promisesToWaitFor.push(stringTransformPromise);
      }
    });
    const items = await Promise.all(promisesToWaitFor);
    setUploadInProgress(false);
    insertFilesAndStringsToNote(items);
  };
  const getLinkAvailability = async (linkText, linkType) => {
    const slug = linkType === LinkType.WIKILINK ? sluggify(linkText) : linkText;
    if (isFileSlug(slug)) {
      try {
        await notesProvider.getFileInfo(slug);
        return true;
      } catch (e) {
        return false;
      }
    }
    try {
      await notesProvider.get(slug);
      return true;
    } catch (e) {
      return false;
    }
  };
  reactExports.useEffect(() => {
    if (noteElement.current) {
      noteElement.current.scrollTop = 0;
    }
  }, ["slug" in note ? note.slug : ""]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      NoteMenuBar,
      {
        activeNote: note,
        disableNoteSaving: !NotesProvider.isValidSlugOrEmpty(slugInput),
        handleNoteSaveRequest,
        removeActiveNote,
        unsavedChanges,
        setUnsavedChanges,
        pinOrUnpinNote,
        duplicateNote,
        handleUploadFilesRequest,
        uploadInProgress,
        importNote,
        handleNoteExportRequest
      }
    ),
    isBusy ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "note-busy-container", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BusyIndicator, { alt: l("app.loading"), height: 64 }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        className: "note",
        ref: noteElement,
        onDrop: handleDrop,
        onPaste: (e) => {
          if (!notesProvider)
            return;
          const files = Array.from(e.clipboardData.files);
          if (files.length > 0) {
            uploadFilesAndInsertFileSlugsToNote(notesProvider, files);
            e.preventDefault();
          }
        },
        onDragOver: (e) => {
          e.stopPropagation();
          e.preventDefault();
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            NoteSlug,
            {
              note,
              slugInput,
              setSlugInput,
              displayedSlugAliases,
              setDisplayedSlugAliases,
              setUnsavedChanges,
              updateReferences,
              setUpdateReferences
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Editor,
            {
              initialText: note.initialContent,
              instanceId: editorInstanceId,
              onChange: (val) => {
                handleEditorContentChange(val);
              },
              onUserRequest: async (type, value) => {
                if (type !== UserRequestType.HYPERLINK) {
                  if (unsavedChanges) {
                    await confirmDiscardingUnsavedChanges();
                    setUnsavedChanges(false);
                  }
                  const slug = type === UserRequestType.WIKILINK ? sluggify(value) : value;
                  if (isFileSlug(slug)) {
                    navigate(
                      getAppPath(PathTemplate.FILE, /* @__PURE__ */ new Map([
                        ["GRAPH_ID", LOCAL_GRAPH_ID],
                        ["FILE_SLUG", slug]
                      ]))
                    );
                  } else {
                    goToNote(slug, {
                      contentIfNewNote: type === UserRequestType.WIKILINK ? value : ""
                    });
                  }
                } else {
                  window.open(value, "_blank", "noopener,noreferrer");
                }
              },
              getTransclusionContent: (slug) => {
                return getTransclusionContent(slug, note, notesProvider);
              },
              getLinkAvailability
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "note-content",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  NoteBacklinks,
                  {
                    note,
                    setUnsavedChanges,
                    unsavedChanges,
                    onLinkIndicatorClick
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  NoteKeyValues,
                  {
                    note,
                    setNote,
                    setUnsavedChanges
                  }
                ),
                !note.isUnsaved ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  NoteStats,
                  {
                    note
                  }
                ) : null
              ]
            }
          )
        ]
      }
    )
  ] });
};

var NoteListStatus = /* @__PURE__ */ ((NoteListStatus2) => {
  NoteListStatus2["DEFAULT"] = "DEFAULT";
  NoteListStatus2["BUSY"] = "BUSY";
  NoteListStatus2["NO_NOTES_FOUND"] = "NO_NOTES_FOUND";
  return NoteListStatus2;
})(NoteListStatus || {});
const NoteListStatusIndicator = ({
  status
}) => {
  if (status === "BUSY" /* BUSY */) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "splash-message",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(BusyIndicator, { alt: l("list.status.busy"), height: 64 })
      }
    );
  }
  const map = /* @__PURE__ */ new Map([
    [
      "NO_NOTES_FOUND" /* NO_NOTES_FOUND */,
      {
        label: l("list.status.no-notes-found"),
        icon: "radio_button_unchecked"
      }
    ]
  ]);
  const activeState = map.get(status);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "splash-message",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: getIconSrc(activeState.icon),
            alt: activeState.label,
            className: "svg-icon"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: activeState.label })
      ]
    }
  );
};

/*
  @license

  The MIT License (MIT)

  Copyright (c) 2014 Call-Em-All

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/
function useControlled({
  controlled,
  default: defaultProp
}) {
  const { current: isControlled } = reactExports.useRef(controlled !== void 0);
  const [valueState, setValue] = reactExports.useState(defaultProp);
  const value = isControlled ? controlled : valueState;
  const setValueIfUncontrolled = reactExports.useCallback(
    (newValue) => {
      if (!isControlled) {
        setValue(newValue);
      }
    },
    []
  );
  return [value, setValueIfUncontrolled];
}

/*
  @license

  The MIT License (MIT)

  Copyright (c) 2014 Call-Em-All

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/
function usePagination(props) {
  const {
    boundaryCount = 1,
    count = 1,
    defaultPage = 1,
    disabled = false,
    hideNextButton = false,
    hidePrevButton = false,
    onChange: handleChange,
    page: pageProp,
    showFirstButton = false,
    showLastButton = false,
    siblingCount = 1,
    ...other
  } = props;
  const [page, setPageState] = useControlled({
    controlled: pageProp,
    default: defaultPage
  });
  const handleClick = (event, value) => {
    if (!pageProp) {
      value && setPageState(value);
    }
    if (handleChange && value !== null) {
      handleChange(event, value);
    }
  };
  const range = (start, end) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };
  const startPages = range(1, Math.min(boundaryCount, count));
  const endPages = range(
    Math.max(count - boundaryCount + 1, boundaryCount + 1),
    count
  );
  const siblingsStart = Math.max(
    Math.min(
      // Natural start
      page - siblingCount,
      // Lower boundary when page is high
      count - boundaryCount - siblingCount * 2 - 1
    ),
    // Greater than startPages
    boundaryCount + 2
  );
  const siblingsEnd = Math.min(
    Math.max(
      // Natural end
      page + siblingCount,
      // Upper boundary when page is low
      boundaryCount + siblingCount * 2 + 2
    ),
    // Less than endPages
    endPages.length > 0 ? endPages[0] - 2 : count - 1
  );
  const itemList = [
    ...showFirstButton ? ["first" /* First */] : [],
    ...hidePrevButton ? [] : ["previous" /* Previous */],
    ...startPages,
    // Start ellipsis
    ...siblingsStart > boundaryCount + 2 ? ["start-ellipsis" /* StartEllipsis */] : boundaryCount + 1 < count - boundaryCount ? [boundaryCount + 1] : [],
    // Sibling pages
    ...range(siblingsStart, siblingsEnd),
    // End ellipsis
    ...siblingsEnd < count - boundaryCount - 1 ? ["end-ellipsis" /* EndEllipsis */] : count - boundaryCount > boundaryCount ? [count - boundaryCount] : [],
    ...endPages,
    ...hideNextButton ? [] : ["next" /* Next */],
    ...showLastButton ? ["last" /* Last */] : []
  ];
  const buttonPage = (type) => {
    switch (type) {
      case "first" /* First */:
        return 1;
      case "previous" /* Previous */:
        return page - 1;
      case "next" /* Next */:
        return page + 1;
      case "last" /* Last */:
        return count;
      default:
        return null;
    }
  };
  const items = itemList.map((item) => {
    return typeof item === "number" ? {
      "onClick": (event) => {
        handleClick(event, item);
      },
      "type": "page" /* Page */,
      "page": item,
      "selected": item === page,
      disabled,
      "aria-current": item === page ? "true" : void 0
    } : {
      onClick: (event) => {
        handleClick(event, buttonPage(item));
      },
      type: item,
      page: buttonPage(item),
      selected: false,
      disabled: disabled || item.indexOf("ellipsis") === -1 && (item === "next" || item === "last" ? page >= count : page <= 1)
    };
  });
  return {
    items,
    ...other
  };
}

const getNumberOfPages = (numberOfResults, searchResultsPerPage) => {
  let numberOfPages;
  const numberOfFullPages = Math.floor(
    numberOfResults / searchResultsPerPage
  );
  if (numberOfResults % searchResultsPerPage !== 0) {
    numberOfPages = numberOfFullPages + 1;
  } else {
    numberOfPages = numberOfFullPages;
  }
  return numberOfPages;
};
const Pagination = ({
  numberOfResults,
  searchResultsPerPage,
  page,
  onChange,
  placement
}) => {
  const doRenderPageButtons = numberOfResults > searchResultsPerPage;
  const numberOfPages = getNumberOfPages(
    numberOfResults,
    searchResultsPerPage
  );
  const { items } = usePagination({
    count: numberOfPages,
    page,
    onChange: (_event, newPage) => onChange(newPage)
  });
  if (!doRenderPageButtons)
    return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pagination " + placement, children: /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { children: items.map(({ page: page2, type, selected, ...item }, index) => {
    let children = null;
    if (type === "start-ellipsis" || type === "end-ellipsis") {
      children = /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pagination-ellipsis", children: "…" });
    } else if (type === "page") {
      children = /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: "default-button-small" + (selected ? " pagination-button-selected" : ""),
          ...item,
          children: page2
        }
      );
    } else {
      children = /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: "default-button-small pagination-button-special",
          title: type === "previous" ? l("list.pagination.previous-page") : l("list.pagination.next-page"),
          ...item,
          children: type === "previous" ? "<" : ">"
        }
      );
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "li",
      {
        children
      },
      index
    );
  }) }) }) });
};

const NoteSearchDisclaimer = ({
  searchValue,
  numberOfResults,
  numberOfAllNotes
}) => {
  let label = "";
  if (numberOfResults) {
    if (typeof numberOfAllNotes === "number" && numberOfResults === numberOfAllNotes) {
      label = "";
    } else {
      label = l(
        numberOfResults === 1 ? "list.search.x-note-found" : "list.search.x-notes-found",
        { number: numberOfResults.toLocaleString() }
      );
    }
  } else if (searchValue.length > 0 && searchValue.length < 3) {
    label = "";
  }
  if (label === "") {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "note-search-disclaimer", children: label });
};

const NoteList = ({
  notes,
  numberOfResults,
  activeNote,
  isBusy,
  searchValue,
  scrollTop,
  setScrollTop,
  sortMode,
  page,
  setPage,
  numberOfAllNotes,
  itemsAreLinkable,
  onLinkIndicatorClick,
  selectedIndex,
  onSelect
}) => {
  const containerRef = reactExports.useRef(null);
  const isSmallScreen = useIsSmallScreen();
  let status = NoteListStatus.DEFAULT;
  if (isBusy) {
    status = NoteListStatus.BUSY;
  }
  reactExports.useEffect(() => {
    const container = containerRef.current;
    const onScroll = () => {
      container && setScrollTop(container.scrollTop);
    };
    if (!container) {
      return;
    }
    container.addEventListener("scroll", onScroll);
    return () => {
      container.removeEventListener("scroll", onScroll);
    };
  }, [status]);
  reactExports.useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    container.scrollTop = scrollTop;
  }, [notes, status, sortMode]);
  if (status === NoteListStatus.BUSY) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      NoteListStatusIndicator,
      {
        status
      }
    );
  }
  if (!Array.isArray(notes) || notes.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      NoteListStatusIndicator,
      {
        status: NoteListStatus.NO_NOTES_FOUND
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      ref: containerRef,
      className: "list-section",
      children: [
        !isSmallScreen ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Pagination,
          {
            numberOfResults,
            page,
            searchResultsPerPage: SEARCH_RESULTS_PER_PAGE,
            onChange: (newPage) => setPage(newPage),
            placement: "top"
          }
        ) : "",
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          NoteSearchDisclaimer,
          {
            searchValue,
            numberOfResults,
            numberOfAllNotes
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "note-list",
            children: notes.map((note, i) => {
              const isActive = !!activeNote && !activeNote.isUnsaved && note.slug === activeNote.slug;
              const isLinked = !!activeNote && !activeNote.isUnsaved && (activeNote.outgoingLinks.map((n) => n.slug).includes(note.slug) || activeNote.backlinks.map((n) => n.slug).includes(note.slug));
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                NoteListItem,
                {
                  note,
                  isSelected: i === selectedIndex,
                  isActive,
                  isLinked,
                  onSelect: () => onSelect(note.slug),
                  isLinkable: itemsAreLinkable,
                  onLinkIndicatorClick: () => {
                    if (isActive)
                      return;
                    onLinkIndicatorClick(note.slug, note.title);
                  }
                },
                `main-notes-list-item-${note.slug}`
              );
            })
          }
        ),
        notes.length >= 20 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Pagination,
          {
            numberOfResults,
            page,
            searchResultsPerPage: SEARCH_RESULTS_PER_PAGE,
            onChange: (newPage) => setPage(newPage),
            placement: "bottom"
          }
        ) : ""
      ]
    }
  );
};

const SearchInput = ({
  value,
  onChange,
  placeholder,
  autoComplete
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "input",
    {
      id: "search-input",
      className: "search-input",
      type: "search",
      placeholder,
      value,
      onChange: (e) => {
        onChange(e.target.value);
      },
      autoComplete
    }
  );
};

const NoteListControls = ({
  value,
  onChange,
  sortMode,
  setSortMode,
  view,
  setView
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: "note-list-controls",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SearchInput,
          {
            placeholder: l("list.search.placeholder"),
            value,
            onChange,
            autoComplete: "off"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          IconButton,
          {
            id: "button_show-search-presets",
            title: l("list.search.presets"),
            icon: "saved_search",
            onClick: () => {
              setView(
                view === NoteListView.SEARCH_PRESETS ? NoteListView.DEFAULT : NoteListView.SEARCH_PRESETS
              );
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            className: "note-list-sort-mode-select",
            value: sortMode,
            onChange: (e) => setSortMode(e.target.value),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "option",
                {
                  value: NoteListSortMode.CREATION_DATE_ASCENDING,
                  children: l("list.sort-mode.creation-date-ascending")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "option",
                {
                  value: NoteListSortMode.CREATION_DATE_DESCENDING,
                  children: l("list.sort-mode.creation-date-descending")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "option",
                {
                  value: NoteListSortMode.UPDATE_DATE_ASCENDING,
                  children: l("list.sort-mode.update-date-ascending")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "option",
                {
                  value: NoteListSortMode.UPDATE_DATE_DESCENDING,
                  children: l("list.sort-mode.update-date-descending")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "option",
                {
                  value: NoteListSortMode.TITLE_ASCENDING,
                  children: l("list.sort-mode.title-a-z")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "option",
                {
                  value: NoteListSortMode.TITLE_DESCENDING,
                  children: l("list.sort-mode.title-z-a")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "option",
                {
                  value: NoteListSortMode.NUMBER_OF_LINKS_ASCENDING,
                  children: l("list.sort-mode.number-of-links-ascending")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "option",
                {
                  value: NoteListSortMode.NUMBER_OF_LINKS_DESCENDING,
                  children: l("list.sort-mode.number-of-links-descending")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "option",
                {
                  value: NoteListSortMode.NUMBER_OF_FILES_ASCENDING,
                  children: l("list.sort-mode.number-of-files-ascending")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "option",
                {
                  value: NoteListSortMode.NUMBER_OF_FILES_DESCENDING,
                  children: l("list.sort-mode.number-of-files-descending")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "option",
                {
                  value: NoteListSortMode.NUMBER_OF_CHARACTERS_ASCENDING,
                  children: l("list.sort-mode.number-of-chars-ascending")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "option",
                {
                  value: NoteListSortMode.NUMBER_OF_CHARACTERS_DESCENDING,
                  children: l("list.sort-mode.number-of-chars-descending")
                }
              )
            ]
          }
        )
      ]
    }
  );
};

const SearchPresetsItem = ({
  label,
  query,
  onClick,
  onDelete
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "search-preset",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          label,
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: query })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "search-preset-buttons",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick,
                  className: "default-button-small dialog-box-button default-action",
                  children: l("list.search.presets.find")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: onDelete,
                  className: "default-button-small dialog-box-button dangerous-action",
                  children: l("list.search.presets.remove")
                }
              )
            ]
          }
        )
      ]
    }
  );
};

const DEFAULT_SEARCH_PRESETS = [
  {
    "label": l("list.search.presets.untitled-notes"),
    "query": "exact:"
  },
  {
    "label": l("list.search.presets.notes-with-duplicate-titles"),
    "query": "duplicates:title"
  },
  {
    "label": l("list.search.presets.notes-with-duplicate-urls"),
    "query": "duplicates:url"
  },
  {
    "label": l("list.search.presets.notes-with-audio"),
    "query": "has-media:audio"
  },
  {
    "label": l("list.search.presets.notes-with-video"),
    "query": "has-media:video"
  },
  {
    "label": l("list.search.presets.notes-with-pdfs"),
    "query": "has-media:pdf"
  },
  {
    "label": l("list.search.presets.notes-with-images"),
    "query": "has-media:image"
  },
  {
    "label": l("list.search.presets.has-list"),
    "query": "has-block:unordered-list-item|ordered-list-item"
  },
  {
    "label": l("list.search.presets.has-custom-metadata"),
    "query": "has:custom-metadata"
  }
];
const SearchPresets = ({
  onSelect,
  currentQuery,
  onClose
}) => {
  const [searchPresets, setSearchPresets] = reactExports.useState([]);
  const [currentQueryLabel, setCurrentQueryLabel] = reactExports.useState("");
  reactExports.useEffect(() => {
    get("SEARCH_PRESETS").then((searchPresets2) => {
      setSearchPresets(searchPresets2 || DEFAULT_SEARCH_PRESETS);
    }).catch(() => {
    });
  }, []);
  const setSearchPresetsPersistently = async (searchPresets2) => {
    setSearchPresets(searchPresets2);
    await set("SEARCH_PRESETS", searchPresets2);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: "search-presets",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "search-presets-heading-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: l("list.search.presets") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            IconButton,
            {
              id: "close-search-presets",
              icon: "close",
              title: l("close"),
              onClick: onClose
            }
          )
        ] }),
        searchPresets.map((preset) => {
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            SearchPresetsItem,
            {
              onClick: () => onSelect(preset.query),
              label: preset.label,
              query: preset.query,
              onDelete: () => {
                setSearchPresetsPersistently(
                  searchPresets.filter((p) => p.query !== preset.query)
                );
              }
            },
            preset.query + "__" + preset.label
          );
        }),
        currentQuery.trim().length > 2 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "save-current-query", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: l("list.search.presets.save-current-query") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "search-preset-name-input",
              type: "text",
              placeholder: l("list.search.presets.preset-name"),
              onInput: (e) => {
                setCurrentQueryLabel(e.target.value);
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setSearchPresetsPersistently([...searchPresets, {
                query: currentQuery,
                label: currentQueryLabel
              }]),
              className: "default-button-small default-action",
              children: l("list.search.presets.save")
            }
          )
        ] }) : "",
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setSearchPresetsPersistently(DEFAULT_SEARCH_PRESETS),
            className: "default-button dangerous-action",
            children: l("list.search.presets.reset-to-defaults")
          }
        ) })
      ]
    }
  );
};

var NoteListView = /* @__PURE__ */ ((NoteListView2) => {
  NoteListView2["DEFAULT"] = "default";
  NoteListView2["SEARCH_PRESETS"] = "search-presets";
  return NoteListView2;
})(NoteListView || {});
const NoteListWithControls = ({
  numberOfAllNotes,
  handleSearchInputChange,
  searchValue,
  sortMode,
  handleSortModeChange,
  noteListItems,
  numberOfResults,
  noteListIsBusy,
  noteListScrollTop,
  setNoteListScrollTop,
  page,
  setPage,
  activeNote,
  itemsAreLinkable,
  onLinkIndicatorClick,
  selectedIndex,
  setSelectedIndex
}) => {
  const [view, setView] = reactExports.useState("default" /* DEFAULT */);
  const noteListWithControlsRef = reactExports.useRef(null);
  const [unsavedChanges, setUnsavedChanges] = reactExports.useContext(UnsavedChangesContext);
  const goToNote = useGoToNote();
  const confirmDiscardingUnsavedChanges = useConfirmDiscardingUnsavedChangesDialog();
  const handleNoteSelection = async (slug) => {
    if (activeNote && "slug" in activeNote && activeNote.slug === slug) {
      return;
    }
    if (unsavedChanges) {
      await confirmDiscardingUnsavedChanges();
      setUnsavedChanges(false);
    }
    goToNote(slug);
  };
  useKeyboardShortcuts(
    {
      onArrowUp: () => {
        const newIndex = selectedIndex > -1 ? selectedIndex - 1 : selectedIndex;
        setSelectedIndex(newIndex);
      },
      onArrowDown: () => {
        const newIndex = selectedIndex < noteListItems.length - 1 ? selectedIndex + 1 : selectedIndex;
        setSelectedIndex(newIndex);
      },
      onEnter: async () => {
        if (selectedIndex > -1) {
          const note = noteListItems[selectedIndex];
          if (note) {
            handleNoteSelection(note.slug);
          }
        }
      }
    },
    noteListWithControlsRef
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      ref: noteListWithControlsRef,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          NoteListControls,
          {
            onChange: handleSearchInputChange,
            value: searchValue,
            sortMode,
            setSortMode: handleSortModeChange,
            view,
            setView
          }
        ),
        view === "default" /* DEFAULT */ ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          NoteList,
          {
            notes: noteListItems,
            numberOfResults,
            activeNote,
            isBusy: noteListIsBusy,
            searchValue,
            scrollTop: noteListScrollTop,
            setScrollTop: setNoteListScrollTop,
            sortMode,
            page,
            onSelect: (slug) => handleNoteSelection(slug),
            setPage: (page2) => {
              setPage(page2);
              setNoteListScrollTop(0);
            },
            numberOfAllNotes,
            itemsAreLinkable,
            setUnsavedChanges,
            unsavedChanges,
            onLinkIndicatorClick,
            selectedIndex
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          SearchPresets,
          {
            onSelect: (preset) => {
              handleSearchInputChange(preset);
              setView("default" /* DEFAULT */);
            },
            currentQuery: searchValue,
            onClose: () => setView("default" /* DEFAULT */)
          }
        )
      ]
    }
  );
};

const useNoteList = (notesProvider, {
  searchQuery,
  sortMode,
  page
}) => {
  const currentRequestId = reactExports.useRef("");
  const [noteListItems, setNoteListItems] = reactExports.useState([]);
  const [numberOfResults, setNumberOfResults] = reactExports.useState(NaN);
  const [isBusy, setIsBusy] = reactExports.useState(true);
  const refreshNoteList = reactExports.useCallback(
    async () => {
      setNoteListItems([]);
      setIsBusy(true);
      const options = {
        page,
        sortMode,
        caseSensitive: false
      };
      options.searchString = searchQuery;
      const requestId = crypto.randomUUID();
      currentRequestId.current = requestId;
      const {
        results,
        numberOfResults: numberOfResults2
      } = await notesProvider.getNotesList(options);
      if (currentRequestId.current === requestId) {
        setNoteListItems(results);
        setNumberOfResults(numberOfResults2);
        setIsBusy(false);
      }
    },
    [searchQuery, page, sortMode, notesProvider]
  );
  reactExports.useEffect(() => {
    refreshNoteList();
  }, [page, sortMode, searchQuery]);
  return [noteListItems, numberOfResults, isBusy, refreshNoteList];
};

const SORT_MODE_LOCAL_STORAGE_KEY = "NOTE_LIST_SORT_MODE";
const useControlledNoteList = (notesProvider) => {
  const [searchQuery, setSearchQueryState] = reactExports.useState("");
  const [scrollTop, setScrollTop] = reactExports.useState(0);
  const [page, setPageState] = reactExports.useState(1);
  const initialSortMode = localStorage.getItem(
    SORT_MODE_LOCAL_STORAGE_KEY
  ) ?? NoteListSortMode.UPDATE_DATE_DESCENDING;
  const [sortMode, setSortMode] = reactExports.useState(initialSortMode);
  const [selectedIndex, setSelectedIndex] = reactExports.useState(-1);
  const setSearchQuery = (value) => {
    setSearchQueryState(value);
    setScrollTop(0);
    setPageState(1);
    setSelectedIndex(0);
  };
  const setPage = (page2) => {
    setPageState(page2);
    setScrollTop(0);
    setSelectedIndex(0);
  };
  const [
    noteListItems,
    numberOfResults,
    isBusy,
    refresh
  ] = useNoteList(
    notesProvider,
    {
      searchQuery,
      sortMode,
      page
    }
  );
  return {
    items: noteListItems,
    numberOfResults,
    isBusy,
    refresh,
    page,
    setPage,
    sortMode,
    setSortMode: (value) => {
      setSortMode(value);
      localStorage.setItem(SORT_MODE_LOCAL_STORAGE_KEY, value);
    },
    searchQuery,
    setSearchQuery,
    scrollTop,
    setScrollTop,
    selectedIndex,
    setSelectedIndex
  };
};

const useHeaderStats = (notesProvider) => {
  const [headerStats, setHeaderStats] = reactExports.useState(null);
  const refreshHeaderStats = async () => {
    const stats = await notesProvider.getStats(
      {
        includeMetadata: false,
        includeAnalysis: false
      }
    );
    setHeaderStats(stats);
  };
  return [headerStats, refreshHeaderStats];
};

const exportNote = async (activeNote, noteContent, notesProvider) => {
  let rawNote;
  if (activeNote.isUnsaved) {
    const note = {
      meta: {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        custom: Object.fromEntries(activeNote.keyValues),
        contentType: DEFAULT_CONTENT_TYPE,
        flags: ["EXPORT_FROM_DRAFT"]
      },
      content: noteContent
    };
    rawNote = serializeNewNote(note);
  } else {
    const rawNoteFromDB = await notesProvider.getRawNote(
      activeNote.slug
    );
    if (!rawNoteFromDB)
      throw new Error("Raw export failed");
    rawNote = rawNoteFromDB;
  }
  const opts = {
    suggestedName: ("slug" in activeNote ? activeNote.slug : l("list.untitled-note")) + NOTE_FILE_EXTENSION,
    types: [{
      description: NOTE_FILE_DESCRIPTION,
      accept: { [NOTE_MIME_TYPE]: [NOTE_FILE_EXTENSION] }
    }]
  };
  const writableStream = await getWritableStream(opts);
  const writer = writableStream.getWriter();
  await writer.write(rawNote);
  writer.close();
};

const useActiveNote = (notesProvider) => {
  const [unsavedChanges, setUnsavedChanges] = reactExports.useContext(UnsavedChangesContext);
  const newNoteObject = getNewNoteObject({});
  const [activeNote, setActiveNote] = reactExports.useState(newNoteObject);
  const [isBusy, setIsBusy] = reactExports.useState(false);
  const noteContentRef = reactExports.useRef("");
  const [updateReferences, setUpdateReferences] = reactExports.useState(false);
  const [slugInput, setSlugInput] = reactExports.useState("");
  const [
    displayedSlugAliases,
    setDisplayedSlugAliases
  ] = reactExports.useState([]);
  const [editorInstanceId, setEditorInstanceId] = reactExports.useState(
    Math.random()
  );
  const updateEditorInstance = () => {
    setEditorInstanceId(Math.random());
  };
  const handleEditorContentChange = (newContent) => {
    if (noteContentRef.current !== newContent) {
      setUnsavedChanges(true);
    }
    noteContentRef.current = newContent;
  };
  const setNewNote = (params) => {
    const newNoteObject2 = getNewNoteObject(params);
    setActiveNote(newNoteObject2);
    setSlugInput(params.slug || "");
    setDisplayedSlugAliases([]);
    noteContentRef.current = "";
  };
  const createNewNote = async (params) => {
    setNewNote(params);
    if (params.content) {
      setUnsavedChanges(true);
    }
    updateEditorInstance();
  };
  const setActiveNoteFromServer = (noteFromServer) => {
    if (!("slug" in activeNote) || noteFromServer.meta.slug !== activeNote.slug) {
      noteContentRef.current = noteFromServer.content;
    }
    setActiveNote({
      slug: noteFromServer.meta.slug,
      // might be better to create a new set here
      aliases: new Set(noteFromServer.aliases),
      createdAt: noteFromServer.meta.createdAt,
      updatedAt: noteFromServer.meta.updatedAt,
      outgoingLinks: noteFromServer.outgoingLinks,
      backlinks: noteFromServer.backlinks,
      numberOfCharacters: noteFromServer.numberOfCharacters,
      isUnsaved: false,
      initialContent: noteFromServer.content,
      files: noteFromServer.files,
      keyValues: Object.entries(noteFromServer.meta.custom),
      flags: noteFromServer.meta.flags,
      contentType: noteFromServer.meta.contentType
    });
    setSlugInput(noteFromServer.meta.slug);
    setDisplayedSlugAliases([...noteFromServer.aliases]);
  };
  const prepareNoteSaveRequest = (ignoreDuplicateTitles) => {
    if (activeNote.isUnsaved) {
      return {
        note: {
          content: noteContentRef.current,
          meta: {
            custom: Object.fromEntries(activeNote.keyValues),
            flags: activeNote.flags,
            contentType: activeNote.contentType
          }
        },
        ignoreDuplicateTitles,
        // for new notes, use slug input if available. for existing notes, use
        // slug input only if it's different from the current slug.
        changeSlugTo: NotesProvider.isValidSlug(slugInput) ? slugInput : void 0,
        aliases: new Set(displayedSlugAliases.filter((a) => {
          return a !== slugInput && a.trim().length > 0 && NotesProvider.isValidSlug(a);
        }))
      };
    } else {
      return {
        note: {
          content: noteContentRef.current,
          meta: {
            custom: Object.fromEntries(activeNote.keyValues),
            slug: activeNote.slug,
            createdAt: activeNote.createdAt,
            updatedAt: activeNote.updatedAt,
            flags: activeNote.flags,
            contentType: activeNote.contentType
          }
        },
        ignoreDuplicateTitles,
        // for new notes, use slug input if available. for existing notes, use
        // slug input only if it's different from the current slug.
        changeSlugTo: slugInput !== activeNote.slug && NotesProvider.isValidSlug(slugInput) ? slugInput : void 0,
        updateReferences: slugInput !== activeNote.slug && NotesProvider.isValidSlug(slugInput) && updateReferences,
        aliases: new Set(displayedSlugAliases.filter((a) => {
          return a !== slugInput && a.trim().length > 0 && NotesProvider.isValidSlug(a);
        }))
      };
    }
  };
  const saveActiveNote = async (ignoreDuplicateTitles) => {
    if (!NotesProvider.isValidSlugOrEmpty(slugInput)) {
      throw new Error("Tried saving an invalid slug. This should not happen!");
    }
    const noteSaveRequest = prepareNoteSaveRequest(ignoreDuplicateTitles);
    const noteFromDatabase = await notesProvider.put(noteSaveRequest);
    setActiveNoteFromServer(noteFromDatabase);
    if (noteFromDatabase.content === noteContentRef.current) {
      setUnsavedChanges(false);
    }
    return noteFromDatabase;
  };
  const importNote = async () => {
    const types = [{
      description: NOTE_FILE_DESCRIPTION,
      accept: { [NOTE_MIME_TYPE]: [NOTE_FILE_EXTENSION] }
    }];
    const [rawNoteFile] = await getFilesFromUserSelection(types, false);
    const rawNote = await readFileAsString(rawNoteFile);
    const parsedNote = parseSerializedNewNote(rawNote);
    const newActiveNote = {
      isUnsaved: true,
      initialContent: parsedNote.content,
      keyValues: Object.entries(parsedNote.meta.custom),
      flags: [...parsedNote.meta.flags, "IMPORTED"],
      contentType: parsedNote.meta.contentType,
      files: []
    };
    setActiveNote(newActiveNote);
    setSlugInput("");
    setUnsavedChanges(true);
    noteContentRef.current = parsedNote.content;
    updateEditorInstance();
  };
  const removeActiveNote = async () => {
    if (activeNote.isUnsaved) {
      return;
    }
    await notesProvider.remove(activeNote.slug);
    createNewNote({});
    setUnsavedChanges(false);
  };
  const duplicateNote = async () => {
    if (activeNote.isUnsaved) {
      throw new Error("Cannot duplicate an unsaved note");
    }
    const noteSaveRequest = {
      note: {
        meta: {
          custom: Object.fromEntries(activeNote.keyValues),
          flags: [...activeNote.flags, `DUPLICATE_OF(${activeNote.slug})`],
          contentType: activeNote.contentType
        },
        content: noteContentRef.current
      },
      ignoreDuplicateTitles: true,
      aliases: /* @__PURE__ */ new Set()
    };
    const noteFromServer = await notesProvider.put(noteSaveRequest);
    setActiveNoteFromServer(noteFromServer);
    updateEditorInstance();
    return noteFromServer;
  };
  const handleNoteExportRequest = () => {
    exportNote(activeNote, noteContentRef.current, notesProvider);
  };
  const loadNote = async (slug, contentForNewNote) => {
    if (slug === "new") {
      createNewNote({
        slug: void 0,
        content: contentForNewNote ?? ""
      });
      return Promise.resolve(null);
    }
    let receivedNoteSlug = null;
    setIsBusy(true);
    try {
      const noteFromServer = slug === "random" ? await notesProvider.getRandom() : await notesProvider.get(slug);
      setActiveNoteFromServer(noteFromServer);
      receivedNoteSlug = noteFromServer.meta.slug;
      updateEditorInstance();
    } catch (e) {
      if (e instanceof Error && e.message === "NOTE_NOT_FOUND") {
        createNewNote({
          slug,
          content: contentForNewNote ?? ""
        });
      } else {
        throw e;
      }
    }
    setIsBusy(false);
    return receivedNoteSlug;
  };
  return {
    isBusy,
    activeNote,
    handleEditorContentChange,
    saveActiveNote,
    setActiveNote,
    importNote,
    removeActiveNote,
    duplicateNote,
    loadNote,
    unsavedChanges,
    setUnsavedChanges,
    slugInput,
    setSlugInput,
    displayedSlugAliases,
    setDisplayedSlugAliases,
    editorInstanceId,
    updateEditorInstance,
    updateReferences,
    setUpdateReferences,
    handleNoteExportRequest
  };
};

const usePinnedNotes = (notesProvider) => {
  const [pinnedNotes, setPinnedNotes] = reactExports.useState(null);
  const pinOrUnpinNote = async (slug) => {
    let newPinnedNotes;
    if (!pinnedNotes) {
      throw new Error("Pinned notes have not been initialized yet.");
    }
    if (pinnedNotes.find((pinnedNote) => pinnedNote.meta.slug === slug)) {
      newPinnedNotes = await notesProvider.unpin(slug);
    } else {
      newPinnedNotes = await notesProvider.pin(slug);
    }
    setPinnedNotes(newPinnedNotes);
  };
  const move = async (slug, offset) => {
    const newPinnedNotes = await notesProvider.movePinPosition(slug, offset);
    setPinnedNotes(newPinnedNotes);
  };
  const refreshPinnedNotes = async () => {
    const pinnedNotes2 = await notesProvider.getPins();
    setPinnedNotes(pinnedNotes2);
  };
  return {
    pinnedNotes,
    pinOrUnpinNote,
    refreshPinnedNotes,
    move
  };
};

const getValidNoteSlug = (noteSlugParam) => {
  if (noteSlugParam === "random") {
    return "random";
  }
  if (noteSlugParam && noteSlugParam !== "new" && noteSlugParam.length > 0) {
    return noteSlugParam;
  } else {
    return null;
  }
};
const NoteView = () => {
  const notesProvider = useNotesProvider();
  const isSmallScreen = useIsSmallScreen();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const { slug } = useParams();
  const location = useLocation();
  const [urlSearchParams] = useSearchParams();
  const [uploadInProgress, setUploadInProgress] = reactExports.useState(false);
  const goToNote = useGoToNote();
  const [editor] = useLexicalComposerContext();
  const confirmDiscardingUnsavedChanges = useConfirmDiscardingUnsavedChangesDialog();
  const {
    isBusy,
    activeNote,
    saveActiveNote,
    removeActiveNote,
    duplicateNote,
    loadNote,
    importNote,
    setActiveNote,
    handleEditorContentChange,
    unsavedChanges,
    setUnsavedChanges,
    slugInput,
    setSlugInput,
    displayedSlugAliases,
    setDisplayedSlugAliases,
    editorInstanceId,
    updateEditorInstance,
    updateReferences,
    setUpdateReferences,
    handleNoteExportRequest
  } = useActiveNote(notesProvider);
  const [headerStats, refreshHeaderStats] = useHeaderStats(notesProvider);
  const {
    pinnedNotes,
    pinOrUnpinNote,
    refreshPinnedNotes,
    move
  } = usePinnedNotes(notesProvider);
  const controlledNoteList = useControlledNoteList(notesProvider);
  const refreshContentViews = async () => {
    await refreshHeaderStats();
    await controlledNoteList.refresh();
    await refreshPinnedNotes();
  };
  const saveActiveNoteAndRefreshViews = async (ignoreDuplicateTitles) => {
    const noteFromDatabase = await saveActiveNote(ignoreDuplicateTitles);
    requestIdleCallback(() => {
      goToNote(
        noteFromDatabase.meta.slug,
        {
          replace: true
        }
      );
    });
    await refreshContentViews();
    return noteFromDatabase;
  };
  const handleNoteSaveRequest = async () => {
    setUploadInProgress(true);
    try {
      await saveActiveNoteAndRefreshViews(false);
    } catch (e) {
      if (e instanceof Error && e.message === ErrorMessage.NOTE_WITH_SAME_TITLE_EXISTS) {
        await confirm({
          text: l("editor.title-already-exists-confirmation"),
          confirmText: l("editor.save-anyway"),
          cancelText: l("editor.cancel"),
          encourageConfirmation: false
        });
        saveActiveNoteAndRefreshViews(true).catch((e2) => {
          alert(e2);
        });
      } else {
        alert(e);
      }
    }
    setUploadInProgress(false);
  };
  const setCanonicalNewNotePath = () => {
    navigate(
      getAppPath(
        PathTemplate.NEW_NOTE,
        /* @__PURE__ */ new Map([["GRAPH_ID", LOCAL_GRAPH_ID]]),
        new URLSearchParams(location.search)
      ),
      { replace: true }
    );
  };
  useKeyboardShortcuts({
    onSave: () => {
      if (!NotesProvider.isValidSlugOrEmpty(slugInput)) {
        return;
      }
      handleNoteSaveRequest();
    },
    onCmdB: async () => {
      if (unsavedChanges) {
        await confirmDiscardingUnsavedChanges();
        setUnsavedChanges(false);
      }
      goToNote("new");
    },
    onCmdE: () => {
      document.getElementById("search-input")?.focus();
    },
    onCmdI: () => {
      toggleWikilinkWrap(editor);
    }
  });
  reactExports.useEffect(() => {
    const title = getNoteTitleFromActiveNote(activeNote);
    const documentTitle = title.length > 0 ? title : activeNote.isUnsaved ? l("editor.new-note") : l("list.untitled-note");
    if (document.title !== documentTitle) {
      document.title = documentTitle;
    }
    return () => {
      document.title = DEFAULT_DOCUMENT_TITLE;
    };
  }, [activeNote]);
  reactExports.useEffect(() => {
    setTimeout(() => {
      document.querySelector(
        "div[data-lexical-editor]"
      )?.focus();
    });
  }, []);
  reactExports.useEffect(() => {
    refreshContentViews();
    if (getValidNoteSlug(slug) === null) {
      const slugs = urlSearchParams.has("referenceSlugs") ? urlSearchParams.get("referenceSlugs").split(",") : [];
      goToNote("new", {
        contentIfNewNote: createContentFromSlugs(slugs)
      });
      setCanonicalNewNotePath();
    }
  }, []);
  reactExports.useEffect(() => {
    const loadNoteAndRefreshURL = async (slug2) => {
      if (slug2 === "new") {
        await loadNote(
          slug2,
          location?.state?.contentIfNewNote || ""
        );
      }
      const validNoteSlug = getValidNoteSlug(slug2);
      if (validNoteSlug !== null && !("slug" in activeNote && validNoteSlug === activeNote.slug)) {
        const receivedNoteSlug = await loadNote(
          validNoteSlug,
          location.state?.contentIfNewNote
        );
        if (typeof receivedNoteSlug === "string" && validNoteSlug !== receivedNoteSlug) {
          navigate(
            getAppPath(
              PathTemplate.EXISTING_NOTE,
              /* @__PURE__ */ new Map([
                ["GRAPH_ID", LOCAL_GRAPH_ID],
                ["SLUG", receivedNoteSlug]
              ]),
              new URLSearchParams(location.search)
            ),
            { replace: true }
          );
        }
      }
    };
    loadNoteAndRefreshURL(slug);
  }, [slug, location.state]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      NoteViewHeader,
      {
        stats: headerStats,
        pinnedNotes,
        movePin: move,
        activeNote
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { children: [
      !isSmallScreen ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sidebar", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        NoteListWithControls,
        {
          handleSearchInputChange: controlledNoteList.setSearchQuery,
          searchValue: controlledNoteList.searchQuery,
          sortMode: controlledNoteList.sortMode,
          handleSortModeChange: controlledNoteList.setSortMode,
          noteListItems: controlledNoteList.items,
          numberOfResults: controlledNoteList.numberOfResults,
          activeNote,
          noteListIsBusy: controlledNoteList.isBusy,
          noteListScrollTop: controlledNoteList.scrollTop,
          setNoteListScrollTop: controlledNoteList.setScrollTop,
          page: controlledNoteList.page,
          setPage: controlledNoteList.setPage,
          numberOfAllNotes: headerStats?.numberOfAllNotes,
          itemsAreLinkable: true,
          onLinkIndicatorClick: (slug2, title) => {
            const wikilink = getWikilinkForNote(slug2, title);
            insert(wikilink, editor);
          },
          selectedIndex: controlledNoteList.selectedIndex,
          setSelectedIndex: controlledNoteList.setSelectedIndex
        }
      ) }) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "main-content-besides-sidebar", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Note,
        {
          editorInstanceId,
          isBusy,
          note: activeNote,
          setNote: setActiveNote,
          setSlugInput,
          slugInput,
          displayedSlugAliases,
          setDisplayedSlugAliases,
          handleEditorContentChange,
          addFilesToNoteObject: (files) => {
            setActiveNote((previousState) => {
              return {
                ...previousState,
                files: [...previousState.files, ...files]
              };
            });
          },
          setUnsavedChanges,
          handleNoteSaveRequest,
          removeActiveNote: async () => {
            await removeActiveNote();
            refreshContentViews();
            setCanonicalNewNotePath();
          },
          unsavedChanges,
          pinOrUnpinNote,
          duplicateNote: async () => {
            const duplicate = await duplicateNote();
            refreshContentViews();
            goToNote(duplicate.meta.slug);
            updateEditorInstance();
          },
          importNote,
          uploadInProgress,
          setUploadInProgress,
          updateReferences,
          setUpdateReferences,
          onLinkIndicatorClick: (slug2, title) => {
            const wikilink = getWikilinkForNote(slug2, title);
            insert(wikilink, editor);
          },
          handleNoteExportRequest
        }
      ) })
    ] })
  ] });
};
const NoteViewWithEditorContext = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Context, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(NoteView, {}) });
};

const FloatingActionButton = ({
  title,
  icon,
  onClick,
  disabled = false
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      className: "icon-button-floating",
      onClick,
      disabled,
      title,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: getIconSrc(icon),
          alt: title,
          width: "24",
          height: "24",
          className: "svg-icon"
        }
      )
    }
  );
};

const ListView = () => {
  const navigate = useNavigate();
  const notesProvider = useNotesProvider();
  const controlledNoteList = useControlledNoteList(notesProvider);
  const [headerStats] = useHeaderStats(
    notesProvider
  );
  const {
    pinnedNotes,
    refreshPinnedNotes,
    move
  } = usePinnedNotes(notesProvider);
  reactExports.useEffect(() => {
    refreshPinnedNotes();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      NoteViewHeader,
      {
        stats: headerStats,
        pinnedNotes,
        activeNote: null,
        movePin: move
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      NoteListWithControls,
      {
        handleSearchInputChange: controlledNoteList.setSearchQuery,
        searchValue: controlledNoteList.searchQuery,
        sortMode: controlledNoteList.sortMode,
        handleSortModeChange: controlledNoteList.setSortMode,
        noteListItems: controlledNoteList.items,
        numberOfResults: controlledNoteList.numberOfResults,
        activeNote: null,
        noteListIsBusy: controlledNoteList.isBusy,
        noteListScrollTop: controlledNoteList.scrollTop,
        setNoteListScrollTop: controlledNoteList.setScrollTop,
        page: controlledNoteList.page,
        setPage: controlledNoteList.setPage,
        numberOfAllNotes: headerStats?.numberOfAllNotes,
        itemsAreLinkable: false,
        onLinkIndicatorClick: () => {
          return;
        },
        selectedIndex: controlledNoteList.selectedIndex,
        setSelectedIndex: controlledNoteList.setSelectedIndex
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      FloatingActionButton,
      {
        title: l("editor.new-note"),
        icon: "add",
        onClick: () => navigate(getAppPath(
          PathTemplate.NEW_NOTE,
          /* @__PURE__ */ new Map([["GRAPH_ID", LOCAL_GRAPH_ID]])
        ))
      }
    )
  ] });
};

const FilesViewPreviewBox = ({
  file,
  isDangling
}) => {
  const type = getMediaTypeFromFilename(file.slug) || "unknown";
  const [thumbnailImageSrc, setThumbnailImageSrc] = reactExports.useState(null);
  reactExports.useEffect(() => {
    getUrlForSlug(file.slug).then((src) => {
      const thumbnailImageSrcMap = {
        [MediaType.IMAGE]: src,
        [MediaType.AUDIO]: getIconSrc("audio_file"),
        [MediaType.VIDEO]: getIconSrc("video_file"),
        [MediaType.PDF]: getIconSrc("description"),
        [MediaType.TEXT]: getIconSrc("description"),
        [MediaType.OTHER]: getIconSrc("draft")
      };
      setThumbnailImageSrc(thumbnailImageSrcMap[type]);
    });
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "files-view-preview-box",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: getAppPath(PathTemplate.FILE, /* @__PURE__ */ new Map([
            ["GRAPH_ID", LOCAL_GRAPH_ID],
            ["FILE_SLUG", file.slug]
          ])),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: thumbnailImageSrc || "",
                loading: "lazy",
                className: type === MediaType.IMAGE ? "checkerboard-background" : ""
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "file-info",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "filename",
                      children: getFilenameFromFileSlug(file.slug)
                    }
                  ),
                  isDangling ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      title: l("files.dangling"),
                      className: "dangling-indicator"
                    }
                  ) : ""
                ]
              }
            )
          ]
        }
      )
    }
  );
};

const FilesView = () => {
  const notesProvider = useNotesProvider();
  const [files, setFiles] = reactExports.useState([]);
  const [danglingFileSlugs, setDanglingFileSlugs] = reactExports.useState([]);
  const [sortMode, setSortMode] = reactExports.useState(
    "CREATED_AT_DESCENDING" /* CREATED_AT_DESCENDING */
  );
  const [status, setStatus] = reactExports.useState("BUSY");
  const updateDanglingFiles = async () => {
    const danglingFiles = await notesProvider.getDanglingFiles();
    setDanglingFileSlugs(danglingFiles.map((file) => file.slug));
  };
  const displayedFiles = [...files].sort((a, b) => {
    if (sortMode === "CREATED_AT_DESCENDING" /* CREATED_AT_DESCENDING */) {
      return b.createdAt - a.createdAt;
    } else if (sortMode === "CREATED_AT_ASCENDING" /* CREATED_AT_ASCENDING */) {
      return a.createdAt - b.createdAt;
    } else if (sortMode === "NAME_ASCENDING" /* NAME_ASCENDING */) {
      if (a.slug.toLowerCase() < b.slug.toLowerCase())
        return -1;
      if (a.slug.toLowerCase() > b.slug.toLowerCase())
        return 1;
      return 0;
    } else if (sortMode === "NAME_DESCENDING" /* NAME_DESCENDING */) {
      if (a.slug.toLowerCase() < b.slug.toLowerCase())
        return 1;
      if (a.slug.toLowerCase() > b.slug.toLowerCase())
        return -1;
      return 0;
    } else if (sortMode === "SIZE_DESCENDING" /* SIZE_DESCENDING */) {
      return b.size - a.size;
    } else if (sortMode === "SIZE_ASCENDING" /* SIZE_ASCENDING */) {
      return a.size - b.size;
    } else {
      return 0;
    }
  });
  reactExports.useEffect(() => {
    if (!notesProvider)
      return;
    const updateFiles = async () => {
      const files2 = await notesProvider.getFiles();
      setFiles(files2);
      await updateDanglingFiles();
      setStatus("READY");
    };
    updateFiles();
  }, [notesProvider]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(HeaderContainerLeftRight, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "content-section-wide files-view", children: status === "READY" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: l(
        "files.files-heading",
        { numberOfFiles: files.length.toString() }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          onChange: (e) => setSortMode(e.target.value),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "option",
              {
                value: "CREATED_AT_DESCENDING" /* CREATED_AT_DESCENDING */,
                children: l("files.sort-mode.created-at.descending")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "option",
              {
                value: "CREATED_AT_ASCENDING" /* CREATED_AT_ASCENDING */,
                children: l("files.sort-mode.created-at.ascending")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "option",
              {
                value: "NAME_ASCENDING" /* NAME_ASCENDING */,
                children: l("files.sort-mode.name.ascending")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "option",
              {
                value: "NAME_DESCENDING" /* NAME_DESCENDING */,
                children: l("files.sort-mode.name.descending")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "option",
              {
                value: "SIZE_ASCENDING" /* SIZE_ASCENDING */,
                children: l("files.sort-mode.size.ascending")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "option",
              {
                value: "SIZE_DESCENDING" /* SIZE_DESCENDING */,
                children: l("files.sort-mode.size.descending")
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        FlexContainer,
        {
          className: "files",
          children: displayedFiles.map((file) => {
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              FilesViewPreviewBox,
              {
                file,
                isDangling: danglingFileSlugs.includes(file.slug)
              },
              "img_" + file.slug
            );
          })
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: l("files.fetching") }) })
  ] });
};

const FileViewPreview = ({
  type,
  src,
  text
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    FlexContainer,
    {
      className: "file-container",
      children: [
        type === MediaType.IMAGE ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            className: "checkerboard-background",
            src,
            loading: "lazy"
          }
        ) : "",
        type === MediaType.AUDIO ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "audio",
          {
            src,
            controls: true
          }
        ) : "",
        type === MediaType.VIDEO ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "video",
          {
            src,
            controls: true
          }
        ) : "",
        type === MediaType.PDF ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "iframe",
          {
            src
          }
        ) : "",
        type === MediaType.TEXT ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "pre",
          {
            className: "preview-block-file-text",
            children: text
          }
        ) : ""
      ]
    }
  );
};

const getRenameInput = (slug) => {
  return removeExtensionFromFilename(getFilenameFromFileSlug(slug));
};
const FileView = () => {
  const notesProvider = useNotesProvider();
  const [fileInfo, setFileInfo] = reactExports.useState(null);
  const [src, setSrc] = reactExports.useState("");
  const [notes, setNotes] = reactExports.useState(null);
  const [text, setText] = reactExports.useState("");
  const { slug } = useParams();
  const [slugRenameInput, setSlugRenameInput] = reactExports.useState(
    slug ? getRenameInput(slug) : ""
  );
  const extension = slug ? getExtensionFromFilename(slug) : "";
  const [updateReferences, setUpdateReferences] = reactExports.useState(true);
  const navigate = useNavigate();
  const type = slug ? getMediaTypeFromFilename(slug) : null;
  const confirm = useConfirm();
  reactExports.useEffect(() => {
    if (typeof slug !== "string")
      return;
    const getFileInfo = async () => {
      const fileInfo2 = await notesProvider.getFileInfo(slug);
      setFileInfo(fileInfo2);
      const src2 = await getUrl(fileInfo2);
      setSrc(src2);
      if (type === MediaType.TEXT) {
        fetch(src2).then((response) => response.text()).then((text2) => setText(text2));
      }
    };
    const getNotes = async () => {
      const response = await notesProvider.getNotesList({
        searchString: "has-file:" + slug
      });
      setNotes(response.results);
    };
    getFileInfo();
    getNotes();
  }, [notesProvider, slug]);
  const canShowPreview = type !== MediaType.OTHER;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(HeaderContainerLeftRight, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "content-section-wide file-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: getAppPath(
            PathTemplate.FILES,
            /* @__PURE__ */ new Map([["GRAPH_ID", LOCAL_GRAPH_ID]])
          ),
          children: l("files.show-all-files")
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: fileInfo ? getFilenameFromFileSlug(fileInfo.slug) : "" }),
      canShowPreview && type ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        FileViewPreview,
        {
          type,
          src,
          text
        }
      ) : "",
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        fileInfo ? humanFileSize(fileInfo.size) : "",
        SPAN_SEPARATOR,
        fileInfo ? l("stats.metadata.created-at") + ": " + makeTimestampHumanReadable(fileInfo.createdAt) : ""
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "action-bar",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                disabled: !fileInfo,
                onClick: async () => {
                  if (!fileInfo)
                    return;
                  navigate(getAppPath(
                    PathTemplate.NEW_NOTE,
                    /* @__PURE__ */ new Map([["GRAPH_ID", LOCAL_GRAPH_ID]]),
                    new URLSearchParams({
                      referenceSlugs: fileInfo.slug
                    })
                  ));
                },
                className: "default-button default-action",
                children: l("files.create-note-with-file")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "default-button default-action",
                onClick: async () => {
                  if (!fileInfo)
                    return;
                  await saveFile(fileInfo.slug);
                },
                children: l("files.save-duplicate")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                disabled: !fileInfo,
                onClick: async () => {
                  if (!fileInfo)
                    return;
                  await confirm({
                    text: l("files.confirm-delete"),
                    confirmText: l("files.confirm-delete.confirm"),
                    cancelText: l("dialog.cancel"),
                    encourageConfirmation: false
                  });
                  await notesProvider.deleteFile(fileInfo.slug);
                  navigate(getAppPath(
                    PathTemplate.FILES,
                    /* @__PURE__ */ new Map([["GRAPH_ID", LOCAL_GRAPH_ID]])
                  ));
                },
                className: "default-button dangerous-action",
                children: l("files.delete")
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: l("files.used-in") }),
      notes ? notes.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { children: notes.map((note) => {
        return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: getAppPath(
              PathTemplate.EXISTING_NOTE,
              /* @__PURE__ */ new Map([
                ["GRAPH_ID", LOCAL_GRAPH_ID],
                ["SLUG", note.slug]
              ])
            ),
            children: note.title
          }
        ) }, "notelink-" + note.slug);
      }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: l("files.used-in.none") }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        BusyIndicator,
        {
          alt: l("app.loading"),
          height: 30
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Rename" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rename", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rename-section-input-line", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "file-slug-rename-input", children: "New slug:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "file-slug-rename-input",
                type: "text",
                value: slugRenameInput,
                onInput: (e) => {
                  const element = e.currentTarget;
                  const newValue = element.value.replace(
                    // In the input field, we also allow \p{SK} modifiers, as
                    // they are used to create a full letter with modifier in a
                    // second step. They are not valid slug characters on
                    // their own, though.
                    // We also allow apostrophes ('), as they might be used as a
                    // dead key for letters like é.
                    // Unfortunately, it seems like we cannot simulate pressing
                    // dead keys in Playwright currently, so we cannot
                    // add a meaningful test for this.
                    /[^\p{L}\p{Sk}\d\-/._']/gu,
                    ""
                  ).toLowerCase();
                  setSlugRenameInput(newValue);
                }
              }
            ),
            ".",
            extension
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "update-references", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "switch", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                checked: updateReferences,
                onChange: (e) => {
                  setUpdateReferences(e.target.checked);
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "slider round" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "update-references-toggle-text", children: l("note.slug.update-references") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            disabled: slugRenameInput === getRenameInput(slug || "") || !isValidSlug(slugRenameInput),
            className: "default-button-small dangerous-action",
            onClick: async () => {
              if (!slug || slugRenameInput === getRenameInput(slug || "") || !isValidSlug(slugRenameInput))
                return;
              const newSlug = "files/" + slugRenameInput + "." + extension;
              try {
                const newFileInfo = await notesProvider.renameFile(
                  slug,
                  newSlug,
                  updateReferences
                );
                const src2 = await getUrl(newFileInfo);
                setFileInfo(newFileInfo);
                setSrc(src2);
                navigate(getAppPath(
                  PathTemplate.FILE,
                  /* @__PURE__ */ new Map([
                    ["GRAPH_ID", LOCAL_GRAPH_ID],
                    ["FILE_SLUG", newSlug]
                  ])
                ), {
                  replace: true
                });
              } catch (e) {
                console.error(e);
              }
            },
            children: "Rename"
          }
        )
      ] })
    ] })
  ] });
};

const StatsViewAnalysisTable = ({
  stats
}) => {
  const {
    numberOfAllNotes,
    numberOfUnlinkedNotes,
    numberOfLinks,
    analysis,
    numberOfAliases
  } = stats;
  const percentageOfUnlinkedNotes = numberOfAllNotes > 0 ? Math.round(
    numberOfUnlinkedNotes / numberOfAllNotes * 100 * 100
  ) / 100 : NaN;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("table", { className: "data-table", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l("stats.metadata.created-at") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: makeTimestampHumanReadable(stats.metadata.createdAt) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l("stats.metadata.updated-at") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: makeTimestampHumanReadable(stats.metadata.updatedAt) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l("stats.analysis.notes") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: numberOfAllNotes.toLocaleString() })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l("stats.analysis.aliases") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: numberOfAliases.toLocaleString() })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l("stats.analysis.notes-and-aliases") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: (numberOfAllNotes + numberOfAliases).toLocaleString() })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l("stats.analysis.links") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: numberOfLinks.toLocaleString() })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l("stats.unlinked-notes") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: numberOfUnlinkedNotes.toLocaleString() + (numberOfAllNotes > 0 ? ` (${percentageOfUnlinkedNotes.toLocaleString()} %)` : "") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: lf("stats.analysis.components") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: analysis.numberOfComponents.toLocaleString() })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l("stats.analysis.components-with-more-than-one-node") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: analysis.numberOfComponentsWithMoreThanOneNode.toLocaleString() })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: lf("stats.analysis.cyclomatic-number") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: (numberOfLinks - numberOfAllNotes + analysis.numberOfComponents).toLocaleString() })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l("stats.metadata.graph-size-without-files") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: humanFileSize(stats.metadata.size.graph) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l("stats.metadata.size-of-all-files") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: humanFileSize(stats.metadata.size.files) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l("stats.metadata.number-of-files") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: stats.numberOfFiles.toLocaleString() })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l("stats.metadata.pins") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: stats.numberOfPins.toLocaleString() })
    ] })
  ] }) });
};

const StatsView = () => {
  const notesProvider = useNotesProvider();
  const [stats, setStats] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const updateStats = async () => {
      const stats2 = await notesProvider.getStats({
        includeMetadata: true,
        includeAnalysis: true
      });
      setStats(stats2);
    };
    updateStats();
  }, [notesProvider]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(HeaderContainerLeftRight, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "content-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: l("stats.graph-stats") }),
      stats !== null ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatsViewAnalysisTable,
        {
          stats
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        BusyIndicator,
        {
          alt: l("stats.fetching"),
          height: 64
        }
      )
    ] })
  ] });
};

const ChangeLanguageSetting = () => {
  const activeLanguage = getActiveLanguage();
  const languages = supportedLangs;
  const [selectedLanguage, setSelectedLanguage] = reactExports.useState(activeLanguage);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: l("change-language.heading") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "select",
      {
        value: selectedLanguage,
        autoFocus: true,
        onChange: (e) => setSelectedLanguage(e.target.value),
        children: languages.map((language) => {
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "option",
            {
              value: language,
              children: language
            },
            language
          );
        })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => {
          setLanguage(selectedLanguage);
        },
        className: "default-button dialog-box-button default-action",
        children: l("change-language.change")
      }
    ) })
  ] });
};

const SettingsView = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(HeaderContainerLeftRight, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "content-section-wide file-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: l("settings") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChangeLanguageSetting, {})
    ] })
  ] });
};

const BusyView = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "busy-view", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BusyIndicator, { height: 80, alt: l("app.loading") }) });
};

const useRunOnce = (fn) => {
  const hasRun = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (!hasRun.current) {
      fn();
      hasRun.current = true;
    }
  }, []);
};

const NoteAccessProvider = ({
  children
}) => {
  const [isReady, setIsReady] = reactExports.useState(false);
  const navigate = useNavigate();
  useRunOnce(() => {
    if (!isInitialized()) {
      initializeNotesProviderWithExistingFolderHandle().then(() => {
        setIsReady(true);
      }).catch(() => {
        const urlParams = new URLSearchParams();
        urlParams.set(
          "redirect",
          window.location.pathname.substring(ROOT_PATH.length - 1)
        );
        navigate(getAppPath(PathTemplate.START, /* @__PURE__ */ new Map(), urlParams));
      });
    } else {
      setIsReady(true);
    }
  });
  if (!isReady) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(BusyView, {});
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    NotesProviderContext.Provider,
    {
      value: getNotesProvider(),
      children
    }
  );
};

const AppRouter = () => {
  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: getAppPath(
          PathTemplate.NEW_NOTE,
          /* @__PURE__ */ new Map([["GRAPH_ID", "local"]]),
          void 0,
          true
        ), replace: true })
      },
      {
        path: getAppPath(PathTemplate.START),
        element: /* @__PURE__ */ jsxRuntimeExports.jsx(StartView, {})
      },
      {
        path: getAppPath(
          PathTemplate.UNSELECTED_NOTE,
          /* @__PURE__ */ new Map([["GRAPH_ID", ":graphId"]]),
          void 0,
          true
        ),
        element: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: getAppPath(
          PathTemplate.NEW_NOTE,
          /* @__PURE__ */ new Map([["GRAPH_ID", "local"]]),
          void 0,
          true
        ), replace: true })
      },
      {
        path: getAppPath(
          PathTemplate.EXISTING_NOTE,
          /* @__PURE__ */ new Map([
            ["SLUG", ":slug"],
            ["GRAPH_ID", ":graphId"]
          ]),
          void 0,
          true
        ),
        element: /* @__PURE__ */ jsxRuntimeExports.jsx(NoteAccessProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(NoteViewWithEditorContext, {}) })
      },
      {
        path: getAppPath(
          PathTemplate.LIST,
          /* @__PURE__ */ new Map([["GRAPH_ID", ":graphId"]]),
          void 0,
          true
        ),
        element: /* @__PURE__ */ jsxRuntimeExports.jsx(NoteAccessProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ListView, {}) })
      },
      {
        path: getAppPath(
          PathTemplate.FILES,
          /* @__PURE__ */ new Map([["GRAPH_ID", ":graphId"]]),
          void 0,
          true
        ),
        element: /* @__PURE__ */ jsxRuntimeExports.jsx(NoteAccessProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(FilesView, {}) })
      },
      {
        path: getAppPath(
          PathTemplate.FILE,
          /* @__PURE__ */ new Map([
            ["GRAPH_ID", ":graphId"],
            ["FILE_SLUG", ":slug"]
          ]),
          void 0,
          true
        ),
        element: /* @__PURE__ */ jsxRuntimeExports.jsx(NoteAccessProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileView, {}) })
      },
      {
        path: getAppPath(
          PathTemplate.STATS,
          /* @__PURE__ */ new Map([["GRAPH_ID", ":graphId"]]),
          void 0,
          true
        ),
        element: /* @__PURE__ */ jsxRuntimeExports.jsx(NoteAccessProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatsView, {}) })
      },
      {
        path: getAppPath(PathTemplate.SETTINGS),
        element: /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsView, {})
      }
    ],
    {
      basename: ROOT_PATH
    }
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(RouterProvider, { router });
};

const useWarnBeforeUnload = (isEnabled) => {
  const beforeUnload = function(e) {
    if (isEnabled) {
      e.preventDefault();
      e.returnValue = "";
    } else {
      delete e.returnValue;
    }
  };
  reactExports.useEffect(() => {
    window.addEventListener("beforeunload", beforeUnload);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
    };
  }, [beforeUnload]);
};

const App = () => {
  const [unsavedChanges, setUnsavedChanges] = reactExports.useState(false);
  const [isAppMenuOpen, setIsAppMenuOpen] = reactExports.useState(false);
  const appMenuControl = {
    isAppMenuOpen,
    setIsAppMenuOpen,
    toggleAppMenu: () => setIsAppMenuOpen(!isAppMenuOpen)
  };
  const notesProvider = getNotesProvider();
  useWarnBeforeUnload(unsavedChanges);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(NotesProviderContext.Provider, { value: notesProvider, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ConfirmationServiceProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    UnsavedChangesContext.Provider,
    {
      value: [unsavedChanges, setUnsavedChanges],
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppMenuContext.Provider, { value: appMenuControl, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppRouter, {}) })
    }
  ) }) });
};

const appContainer = document.getElementById("app");
const root = createRoot(appContainer);
root.render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
);
