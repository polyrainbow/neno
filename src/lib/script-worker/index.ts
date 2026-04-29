/* eslint-disable @stylistic/max-len */
// @ts-nocheck
import NotesProviderProxy from "../notes-worker/NotesProviderProxy";
import {
  getSlugsFromInlineText,
  getAllInlineSpans,
  getNoteTitle,
  getKeyValuesFromBlocks,
} from "../notes/noteUtils";
import { sluggifyWikilinkText } from "../notes/slugUtils";
import subwaytext from "../subwaytext/index.js";
import { createModuleLoader } from "./createModuleLoader.js";

globalThis.getNoteTitle = getNoteTitle;
globalThis.getAllInlineSpans = getAllInlineSpans;
globalThis.getSlugsFromInlineText = getSlugsFromInlineText;
globalThis.sluggifyWikilinkText = sluggifyWikilinkText;

// Capture AsyncFunction constructor before the sandbox locks down globalThis.
const AsyncFunction = Object.getPrototypeOf(
  async function() {},
).constructor;

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
  "use",
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
globalThis.output = [];
globalThis.print = (
  val: string,
  padStart?: number,
  padEnd?: number,
  padString?: string,
): void => {
  let value = val;
  if (padStart !== undefined) value = value.padStart(padStart, padString);
  if (padEnd !== undefined) value = value.padEnd(padEnd, padString);
  globalThis.output.push({ type: "text", value });
};
globalThis.println = (val: string | undefined): void => {
  globalThis.output.push({ type: "text", value: (val ?? "") + "\n" });
};
globalThis.printNoteTitle = (
  title: string,
  padStart?: number,
  padEnd?: number,
  padString?: string,
): void => {
  if (padStart !== undefined && title.length < padStart) {
    globalThis.output.push({
      type: "text",
      value: "".padStart(padStart - title.length, padString),
    });
  }
  globalThis.output.push({
    type: "noteLink",
    title,
    slug: sluggifyWikilinkText(title),
  });
  if (padEnd !== undefined && title.length < padEnd) {
    globalThis.output.push({
      type: "text",
      value: "".padEnd(padEnd - title.length, padString),
    });
  }
};

const moduleLoader = createModuleLoader({
  getRawNote: (slug) => globalThis.notesProvider.getRawNote(slug),
  runModule: (code) => new AsyncFunction(code)(),
  getThisNote: () => globalThis.thisNote,
  setThisNote: (note) => {
    globalThis.thisNote = note;
  },
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

    moduleLoader.reset();
    globalThis.graph = await globalThis.notesProvider.getGraph();

    if (eventData.noteContent !== undefined) {
      const blocks = subwaytext(eventData.noteContent);
      globalThis.thisNote = {
        slug: eventData.noteSlug || "",
        content: eventData.noteContent,
        blocks,
        keyValues: getKeyValuesFromBlocks(blocks),
      };
    }

    try {
      await new AsyncFunction(eventData.script)();
    } catch (e: Error) {
      globalThis.println(e.toString());
    }

    postMessage({
      type: "EVALUATION_COMPLETED",
      output: globalThis.output,
    });
    globalThis.output = [];
  }
};
