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
