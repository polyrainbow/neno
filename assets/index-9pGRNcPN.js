//#region src/lib/notes/utils.ts
const getExtensionFromFilename = (filename) => {
	const posOfDot = filename.lastIndexOf(".");
	if (posOfDot === -1) return null;
	const extension = filename.substring(posOfDot + 1).toLowerCase();
	if (extension.length === 0) return null;
	return extension;
};
const shortenText = (text, maxLength) => {
	if (text.length > maxLength) return text.trim().substring(0, maxLength) + "…";
	else return text;
};
//#endregion
//#region src/lib/subwaytext/types/Block.ts
let BlockType = /* @__PURE__ */ function(BlockType) {
	BlockType["PARAGRAPH"] = "paragraph";
	BlockType["HEADING"] = "heading";
	BlockType["UNORDERED_LIST_ITEM"] = "unordered-list-item";
	BlockType["ORDERED_LIST_ITEM"] = "ordered-list-item";
	BlockType["CODE"] = "code";
	BlockType["QUOTE"] = "quote";
	BlockType["KEY_VALUE_PAIR"] = "key-value-pair";
	BlockType["EMPTY"] = "empty";
	return BlockType;
}({});
//#endregion
//#region src/lib/subwaytext/CharIterator.ts
var CharIterator = class {
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
		if (delimiterIndex === -1) return null;
		return stringToAnalyse.slice(0, delimiterIndex);
	}
};
//#endregion
//#region src/lib/subwaytext/types/SpanType.ts
let SpanType = /* @__PURE__ */ function(SpanType) {
	SpanType["NORMAL_TEXT"] = "NORMAL_TEXT";
	SpanType["HYPERLINK"] = "HYPERLINK";
	SpanType["SLASHLINK"] = "SLASHLINK";
	SpanType["WIKILINK"] = "WIKILINK";
	return SpanType;
}({});
//#endregion
//#region src/lib/subwaytext/utils.ts
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
			if (currentSpanType) spans.push({
				type: currentSpanType,
				text: currentSpanText
			});
			break;
		}
		const char = step.value;
		const lastChar = iterator.peekBack();
		if ((typeof lastChar !== "string" || isWhiteSpace(lastChar)) && char === "h" && (iterator.peek(5).join("") === "ttp:/" || iterator.peek(6).join("") === "ttps:/")) {
			if (currentSpanType) spans.push({
				type: currentSpanType,
				text: currentSpanText
			});
			currentSpanText = "";
			currentSpanType = SpanType.HYPERLINK;
		} else if ((typeof lastChar !== "string" || isWhiteSpace(lastChar)) && char === "/" && currentSpanType !== SpanType.WIKILINK && /^[\p{L}\d_]$/u.test(iterator.peek(1).join("")) && (typeof iterator.charsUntil(" ") === "string" && /^[\p{L}\d_]$/u.test(iterator.charsUntil(" ").slice(-1)) || iterator.charsUntil(" ") === null && /^[\p{L}\d_]$/u.test(iterator.getRest().slice(-1)))) {
			if (currentSpanType) spans.push({
				type: currentSpanType,
				text: currentSpanText
			});
			currentSpanText = "";
			currentSpanType = SpanType.SLASHLINK;
		} else if (isWhiteSpace(char) && currentSpanType !== SpanType.NORMAL_TEXT && currentSpanType !== SpanType.WIKILINK) {
			if (currentSpanType) spans.push({
				type: currentSpanType,
				text: currentSpanText
			});
			currentSpanText = "";
			currentSpanType = SpanType.NORMAL_TEXT;
		} else if (char === "[" && iterator.peek(1).join("") === "[" && iterator.getRest().includes("]]") && !iterator.charsUntil("]]", 2)?.includes("[") && !iterator.charsUntil("]]", 2)?.includes("]")) {
			if (currentSpanType) spans.push({
				type: currentSpanType,
				text: currentSpanText
			});
			currentSpanText = "";
			currentSpanType = SpanType.WIKILINK;
		} else if (currentSpanType === SpanType.WIKILINK && lastChar === "]" && iterator.peekBack(2) === "]") {
			spans.push({
				type: currentSpanType,
				text: currentSpanText
			});
			currentSpanText = "";
			currentSpanType = SpanType.NORMAL_TEXT;
		} else if (!currentSpanType) currentSpanType = SpanType.NORMAL_TEXT;
		currentSpanText += char;
	}
	return spans;
};
const parse = (input) => {
	const lines = input.replaceAll("\r", "").split("\n");
	let withinBlock = false;
	let codeBlockJustStarted = false;
	return lines.reduce((blocks, line) => {
		if (withinBlock) {
			const currentBlock = blocks[blocks.length - 1];
			if (currentBlock.type === BlockType.CODE) {
				if (line.trimEnd() === "```") {
					withinBlock = false;
					return blocks;
				}
				const lineValue = line.trimEnd() === "\\```" ? line.substring(1) : line;
				if (codeBlockJustStarted) {
					currentBlock.data.code += lineValue;
					codeBlockJustStarted = false;
				} else currentBlock.data.code += "\n" + lineValue;
				return blocks;
			} else throw new Error("Subwaytext parser: Within unknown block: " + currentBlock.type);
		} else if (line.startsWith("#")) {
			const newBlock = {
				type: BlockType.HEADING,
				data: {
					whitespace: line.substring(1).match(/^\s*/g)?.[0] ?? "",
					text: parseText(line.substring(1).trimStart())
				}
			};
			blocks.push(newBlock);
			return blocks;
		} else if (/^\$[\p{L}\p{M}\d\-_]+(\s(.*)?)?$/gu.test(line)) {
			const newBlock = {
				type: BlockType.KEY_VALUE_PAIR,
				data: {
					key: line.substring(1).match(/^[^\s]+/)?.[0] ?? "",
					whitespace: line.substring(1).match(/\s+/g)?.[0] ?? "",
					value: parseText(Array.from(line.matchAll(/^[^\s]+\s*(.*)$/g))[0][1] ?? "")
				}
			};
			blocks.push(newBlock);
			return blocks;
		} else if (line.startsWith("- ")) {
			const newBlock = {
				type: BlockType.UNORDERED_LIST_ITEM,
				data: {
					whitespace: line.substring(1).match(/^\s*/g)?.[0] ?? "",
					text: parseText(line.substring(1).trimStart())
				}
			};
			blocks.push(newBlock);
			return blocks;
		} else if (line.startsWith(">")) {
			const newBlock = {
				type: BlockType.QUOTE,
				data: {
					whitespace: line.substring(1).match(/^\s*/g)?.[0] ?? "",
					text: parseText(line.substring(1).trimStart())
				}
			};
			blocks.push(newBlock);
			return blocks;
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
			blocks.push(newBlock);
			return blocks;
		} else if (line.startsWith("```")) {
			withinBlock = true;
			codeBlockJustStarted = true;
			const newBlock = {
				type: BlockType.CODE,
				data: {
					code: "",
					contentType: line.substring(3).trim(),
					whitespace: line.substring(3).match(/^\s*/g)?.[0] ?? ""
				}
			};
			blocks.push(newBlock);
			return blocks;
		} else if (line.trim().length === 0) {
			const newBlock = {
				type: BlockType.EMPTY,
				data: { whitespace: line }
			};
			blocks.push(newBlock);
			return blocks;
		} else {
			const newBlock = {
				type: BlockType.PARAGRAPH,
				data: { text: parseText(line) }
			};
			blocks.push(newBlock);
			return blocks;
		}
		return blocks;
	}, []);
};
if (typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope) onmessage = (event) => {
	const eventData = event.data;
	if (eventData.action === "PARSE_NOTES") {
		const notes = eventData.notes;
		if (!Array.isArray(notes)) throw new Error("Subwaytext worker: Expected an array of notes, received " + typeof notes + " instead.");
		const notesParsed = notes.map((note) => {
			return {
				id: note.id,
				parsedContent: parse(note.content)
			};
		});
		postMessage(notesParsed);
	}
};
//#endregion
//#region src/lib/notes/types/CanonicalNoteHeader.ts
let CanonicalNoteHeader = /* @__PURE__ */ function(CanonicalNoteHeader) {
	CanonicalNoteHeader["CREATED_AT"] = "created-at";
	CanonicalNoteHeader["UPDATED_AT"] = "updated-at";
	CanonicalNoteHeader["FLAGS"] = "neno-flags";
	return CanonicalNoteHeader;
}({});
//#endregion
//#region src/lib/notes/slugUtils.ts
const trimSlug = (slug) => {
	return slug.replace(/^-+/, "").replace(/-+$/, "");
};
const sluggifyWikilinkText = (text) => {
	return trimSlug(text.normalize("NFC").trim().replace(/['’]+/g, "").replace(/[^\p{L}\p{M}\d\-_/]+/gu, "-").replace(/(?<!\/)\/(?!\/)/g, "-").replace(/\/\/+/g, "/").replace(/-+/g, "-").toLowerCase());
};
const isValidSlug = (slug) => {
	return slug.length > 0 && slug.length <= 200 && slug.match(/^[\p{L}\p{M}\d_][\p{L}\p{M}\d\-._]*((?<!\.)\/[\p{L}\p{M}\d\-_][\p{L}\p{M}\d\-._]*)*$/u) !== null && !slug.includes("..") && !slug.endsWith(".");
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
	return text.filter((span) => {
		return span.type === SpanType.SLASHLINK || span.type === SpanType.WIKILINK;
	}).map((span) => {
		if (span.type === SpanType.SLASHLINK) return span.text.substring(1).normalize("NFC");
		else return sluggifyWikilinkText(span.text.substring(2, span.text.length - 2));
	});
};
//#endregion
//#region src/lib/notes/noteUtils.ts
const parseGraphFileHeaders = (note) => {
	const headerContentDelimiterPos = note.indexOf("\n\n");
	const headerSection = headerContentDelimiterPos > -1 ? note.substring(0, headerContentDelimiterPos) : note;
	const regex = /^:([^:]*):(.*)$/gm;
	const headers = /* @__PURE__ */ new Map();
	for (const [_match, key, value] of headerSection.matchAll(regex)) headers.set(key, value);
	return headers;
};
const serializeNoteHeaders = (headers) => {
	return Array.from(headers.entries()).map(([key, value]) => {
		return ":" + key + ":" + value;
	}).join("\n");
};
const canonicalHeaderKeys = new Map([
	[CanonicalNoteHeader.CREATED_AT, (meta, val) => {
		meta.createdAt = val;
	}],
	[CanonicalNoteHeader.UPDATED_AT, (meta, val) => {
		meta.updatedAt = val;
	}],
	[CanonicalNoteHeader.FLAGS, (meta, val) => {
		meta.flags = val.trim().length > 0 ? val.trim().split(",") : [];
	}]
]);
const cleanSerializedNote = (serializedNote) => {
	return serializedNote.replace(/\r/g, "");
};
const parseSerializedNewNote = (serializedNote) => {
	const serializedNoteCleaned = cleanSerializedNote(serializedNote);
	const headers = parseGraphFileHeaders(serializedNoteCleaned);
	const partialMeta = {};
	const additionalHeaders = {};
	for (const [key, value] of headers.entries()) if (canonicalHeaderKeys.has(key)) canonicalHeaderKeys.get(key)(partialMeta, value);
	else additionalHeaders[key] = value;
	const meta = {
		flags: partialMeta.flags ?? [],
		additionalHeaders
	};
	return {
		content: headers.size > 0 ? serializedNoteCleaned.substring(serializedNoteCleaned.indexOf("\n\n") + 2) : serializedNoteCleaned,
		meta
	};
};
const serializeNewNote = (note) => {
	return serializeNoteHeaders(new Map([[CanonicalNoteHeader.FLAGS, note.meta.flags.join(",")]])) + "\n\n" + note.content;
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
	const firstContentLine = noteContent.split("\n").find((line) => line.trim().length > 0);
	if (!firstContentLine) return "";
	return shortenText(removeWikilinkPunctuation(removeHeadingSigil(removeQuoteBlockSigil(firstContentLine))), maxLength).trim();
};
const getAllInlineSpans = (blocks) => {
	const spans = [];
	blocks.forEach((block) => {
		if (block.type === BlockType.PARAGRAPH) spans.push(...block.data.text);
		else if (block.type === BlockType.HEADING) spans.push(...block.data.text);
		else if (block.type === BlockType.QUOTE) spans.push(...block.data.text);
		else if (block.type === BlockType.ORDERED_LIST_ITEM) spans.push(...block.data.text);
		else if (block.type === BlockType.UNORDERED_LIST_ITEM) spans.push(...block.data.text);
		else if (block.type === BlockType.KEY_VALUE_PAIR) spans.push(...block.data.value);
	});
	return spans;
};
//#endregion
//#region src/lib/notes-worker/NotesProviderProxy.ts
var NotesProviderProxy = class {
	static getExtensionFromFilename = getExtensionFromFilename;
	static parseSerializedNewNote = parseSerializedNewNote;
	static serializeNewNote = serializeNewNote;
	static isValidSlug = isValidSlug;
	static isValidSlugOrEmpty = isValidSlugOrEmpty;
	static isValidNoteSlugOrEmpty = isValidNoteSlugOrEmpty;
	#target;
	#pendingCalls = /* @__PURE__ */ new Map();
	#nextId = 0;
	constructor(target) {
		this.#target = target;
		const handler = (event) => {
			const { id, result, error } = event.data;
			if (id === void 0) return;
			const pending = this.#pendingCalls.get(id);
			if (!pending) return;
			this.#pendingCalls.delete(id);
			if (error) pending.reject(new Error(error));
			else pending.resolve(result);
		};
		target.addEventListener("message", handler);
		if ("start" in target) target.start();
	}
	#call(method, args) {
		const id = this.#nextId++;
		const transferables = [];
		for (const arg of args) if (arg instanceof ReadableStream) transferables.push(arg);
		return new Promise((resolve, reject) => {
			this.#pendingCalls.set(id, {
				resolve,
				reject
			});
			this.#target.postMessage({
				id,
				method,
				args
			}, transferables);
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
		return await this.#call("addFile", [
			readable,
			namespace,
			originalFilename
		]);
	}
	async updateFile(readable, slug) {
		return await this.#call("updateFile", [readable, slug]);
	}
	async renameFileSlug(oldSlug, newSlug, updateReferences) {
		return await this.#call("renameFileSlug", [
			oldSlug,
			newSlug,
			updateReferences
		]);
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
		return await this.#call("getReadableArbitraryGraphFileStream", [slug, range]);
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
		return await this.#call("movePinPosition", [slug, offset]);
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
};
//#endregion
//#region src/lib/script-worker/index.ts
globalThis.getNoteTitle = getNoteTitle;
globalThis.getAllInlineSpans = getAllInlineSpans;
globalThis.getSlugsFromInlineText = getSlugsFromInlineText;
const AsyncFunction = Object.getPrototypeOf(async function() {}).constructor;
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
	"getNoteTitle",
	"getSlugsFromInlineText",
	"getAllInlineSpans",
	"thisNote"
]);
Object.getOwnPropertyNames(globalThis).forEach(function(prop) {
	if (!enabledInterfaces.has(prop)) Object.defineProperty(globalThis, prop, {
		get: function() {
			throw "Security Exception: cannot access " + prop;
		},
		configurable: false
	});
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
		const port = event.ports[0];
		globalThis.notesProvider = new NotesProviderProxy(port);
		initialized = true;
		postMessage({ type: "INITIALIZED" });
	} else if (eventData.action === "evaluate") {
		if (!initialized) {
			postMessage({
				type: "ERROR",
				message: "Worker has not been initialized yet."
			});
			return;
		}
		globalThis.graph = await globalThis.notesProvider.getGraph();
		if (eventData.noteContent !== void 0) globalThis.thisNote = {
			slug: eventData.noteSlug || "",
			content: eventData.noteContent,
			blocks: parse(eventData.noteContent)
		};
		try {
			await new AsyncFunction(eventData.script)();
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
//#endregion
