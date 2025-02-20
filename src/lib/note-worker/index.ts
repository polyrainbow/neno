/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @stylistic/max-len */
// @ts-nocheck
import FileSystemAccessAPIStorageProvider from "../FileSystemAccessAPIStorageProvider";
import NotesProvider from "../notes";
import {
  createNoteToTransmit,
  getNumberOfUnlinkedNotes,
  parseSerializedNewNote,
  serializeNewNote,
  getSlugsFromInlineText,
  getAllInlineSpans,
  handleExistingNoteUpdate,
  isExistingNoteSaveRequest,
  handleNewNoteSaveRequest,
  changeSlugReferencesInNote,
  getNoteTitle,
} from "../notes";

globalThis.getNoteTitle = getNoteTitle;
globalThis.getAllInlineSpans = getAllInlineSpans;
globalThis.getSlugsFromInlineText = getSlugsFromInlineText;

/*
  Making Worker environment safer
  https://stackoverflow.com/questions/10653809/making-webworkers-a-safe-environment/10796616#10796616
*/

const enabledInterfaces = new Set([
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
  "Number" ,
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
  "getAllInlineSpans",
]);

Object.getOwnPropertyNames( globalThis ).forEach( function( prop ) {
  if (!enabledInterfaces.has(prop)) {
    Object.defineProperty( globalThis, prop, {
      get: function() {
        throw "Security Exception: cannot access " + prop;
      },
      configurable: false,
    });
  }
});

/*
  Variables within an async function constructor must be in global scope.
  https://stackoverflow.com/a/63972569/3890888
*/
globalThis.notesProvider = null;
globalThis.output = "";
globalThis.println = (val: string): void => {
  globalThis.output += val + "\n";
};

let initialized = false;

onmessage = async (event) => {
  const eventData = event.data;

  if (eventData.action === "initialize") {
    const storageProvider = new FileSystemAccessAPIStorageProvider(
      eventData.folderHandle,
    );
    globalThis.notesProvider = new NotesProvider(storageProvider);
    globalThis.storageProvider = storageProvider;
    initialized = true;
    postMessage({
      type: "INITIALIZED",
    });
  } else if (eventData.action === "evaluate") {
    if (!initialized) {
      postMessage({
        type: "ERROR",
        message: "Worker has not been initialized yet.",
      });
      return;
    }

    globalThis.graph = await globalThis.notesProvider.getGraph();

    try {
      await Object.getPrototypeOf(
        async function() {},
      ).constructor(eventData.script)();
    } catch (e: Error) {
      globalThis.println(e.toString());
    }

    postMessage({
      type: "EVALUATION_COMPLETED",
      output: globalThis.output,
    });
    globalThis.output = "";
  }
};
