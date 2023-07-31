import { h as languages, p as editor } from "./editor.api2-J5VvnjYP.js";
import { t as createWebWorker } from "./workers-DfUx76m9.js";
import { _ as toRange, a as DocumentFormattingEditProvider, c as DocumentRangeFormattingEditProvider, d as HoverAdapter, f as ReferenceAdapter, g as fromRange, h as fromPosition, i as DocumentColorAdapter, l as DocumentSymbolAdapter, m as SelectionRangeAdapter, n as DefinitionAdapter, o as DocumentHighlightAdapter, p as RenameAdapter, r as DiagnosticsAdapter, s as DocumentLinkAdapter, t as CompletionAdapter, u as FoldingRangeAdapter, v as toTextEdit } from "./lspLanguageFeatures-B34ux6fH.js";
//#region node_modules/monaco-editor/esm/vs/language/json/workerManager.js
var STOP_WHEN_IDLE_FOR = 120 * 1e3;
var WorkerManager = class {
	constructor(defaults) {
		this._defaults = defaults;
		this._worker = null;
		this._client = null;
		this._idleCheckInterval = window.setInterval(() => this._checkIfIdle(), 30 * 1e3);
		this._lastUsedTime = 0;
		this._configChangeListener = this._defaults.onDidChange(() => this._stopWorker());
	}
	_stopWorker() {
		if (this._worker) {
			this._worker.dispose();
			this._worker = null;
		}
		this._client = null;
	}
	dispose() {
		clearInterval(this._idleCheckInterval);
		this._configChangeListener.dispose();
		this._stopWorker();
	}
	_checkIfIdle() {
		if (!this._worker) return;
		if (Date.now() - this._lastUsedTime > STOP_WHEN_IDLE_FOR) this._stopWorker();
	}
	_getClient() {
		this._lastUsedTime = Date.now();
		if (!this._client) {
			this._worker = createWebWorker({
				moduleId: "vs/language/json/jsonWorker",
				createWorker: () => new Worker(new URL(
					/* @vite-ignore */
					"/neno/assets/json.worker-CUYMph3A.js",
					"" + import.meta.url
				), { type: "module" }),
				label: this._defaults.languageId,
				createData: {
					languageSettings: this._defaults.diagnosticsOptions,
					languageId: this._defaults.languageId,
					enableSchemaRequest: this._defaults.diagnosticsOptions.enableSchemaRequest
				}
			});
			this._client = this._worker.getProxy();
		}
		return this._client;
	}
	getLanguageServiceWorker(...resources) {
		let _client;
		return this._getClient().then((client) => {
			_client = client;
		}).then((_) => {
			if (this._worker) return this._worker.withSyncedResources(resources);
		}).then((_) => _client);
	}
};
//#endregion
//#region node_modules/monaco-editor/esm/external/jsonc-parser/lib/esm/impl/scanner.js
/**
* Creates a JSON scanner on the given text.
* If ignoreTrivia is set, whitespaces or comments are ignored.
*/
function createScanner$1(text, ignoreTrivia = false) {
	const len = text.length;
	let pos = 0, value = "", tokenOffset = 0, token = 16, lineNumber = 0, lineStartOffset = 0, tokenLineStartOffset = 0, prevTokenLineStartOffset = 0, scanError = 0;
	function scanHexDigits(count, exact) {
		let digits = 0;
		let value = 0;
		while (digits < count || false) {
			let ch = text.charCodeAt(pos);
			if (ch >= 48 && ch <= 57) value = value * 16 + ch - 48;
			else if (ch >= 65 && ch <= 70) value = value * 16 + ch - 65 + 10;
			else if (ch >= 97 && ch <= 102) value = value * 16 + ch - 97 + 10;
			else break;
			pos++;
			digits++;
		}
		if (digits < count) value = -1;
		return value;
	}
	function setPosition(newPosition) {
		pos = newPosition;
		value = "";
		tokenOffset = 0;
		token = 16;
		scanError = 0;
	}
	function scanNumber() {
		let start = pos;
		if (text.charCodeAt(pos) === 48) pos++;
		else {
			pos++;
			while (pos < text.length && isDigit(text.charCodeAt(pos))) pos++;
		}
		if (pos < text.length && text.charCodeAt(pos) === 46) {
			pos++;
			if (pos < text.length && isDigit(text.charCodeAt(pos))) {
				pos++;
				while (pos < text.length && isDigit(text.charCodeAt(pos))) pos++;
			} else {
				scanError = 3;
				return text.substring(start, pos);
			}
		}
		let end = pos;
		if (pos < text.length && (text.charCodeAt(pos) === 69 || text.charCodeAt(pos) === 101)) {
			pos++;
			if (pos < text.length && text.charCodeAt(pos) === 43 || text.charCodeAt(pos) === 45) pos++;
			if (pos < text.length && isDigit(text.charCodeAt(pos))) {
				pos++;
				while (pos < text.length && isDigit(text.charCodeAt(pos))) pos++;
				end = pos;
			} else scanError = 3;
		}
		return text.substring(start, end);
	}
	function scanString() {
		let result = "", start = pos;
		while (true) {
			if (pos >= len) {
				result += text.substring(start, pos);
				scanError = 2;
				break;
			}
			const ch = text.charCodeAt(pos);
			if (ch === 34) {
				result += text.substring(start, pos);
				pos++;
				break;
			}
			if (ch === 92) {
				result += text.substring(start, pos);
				pos++;
				if (pos >= len) {
					scanError = 2;
					break;
				}
				switch (text.charCodeAt(pos++)) {
					case 34:
						result += "\"";
						break;
					case 92:
						result += "\\";
						break;
					case 47:
						result += "/";
						break;
					case 98:
						result += "\b";
						break;
					case 102:
						result += "\f";
						break;
					case 110:
						result += "\n";
						break;
					case 114:
						result += "\r";
						break;
					case 116:
						result += "	";
						break;
					case 117:
						const ch3 = scanHexDigits(4);
						if (ch3 >= 0) result += String.fromCharCode(ch3);
						else scanError = 4;
						break;
					default: scanError = 5;
				}
				start = pos;
				continue;
			}
			if (ch >= 0 && ch <= 31) if (isLineBreak(ch)) {
				result += text.substring(start, pos);
				scanError = 2;
				break;
			} else scanError = 6;
			pos++;
		}
		return result;
	}
	function scanNext() {
		value = "";
		scanError = 0;
		tokenOffset = pos;
		lineStartOffset = lineNumber;
		prevTokenLineStartOffset = tokenLineStartOffset;
		if (pos >= len) {
			tokenOffset = len;
			return token = 17;
		}
		let code = text.charCodeAt(pos);
		if (isWhiteSpace(code)) {
			do {
				pos++;
				value += String.fromCharCode(code);
				code = text.charCodeAt(pos);
			} while (isWhiteSpace(code));
			return token = 15;
		}
		if (isLineBreak(code)) {
			pos++;
			value += String.fromCharCode(code);
			if (code === 13 && text.charCodeAt(pos) === 10) {
				pos++;
				value += "\n";
			}
			lineNumber++;
			tokenLineStartOffset = pos;
			return token = 14;
		}
		switch (code) {
			case 123:
				pos++;
				return token = 1;
			case 125:
				pos++;
				return token = 2;
			case 91:
				pos++;
				return token = 3;
			case 93:
				pos++;
				return token = 4;
			case 58:
				pos++;
				return token = 6;
			case 44:
				pos++;
				return token = 5;
			case 34:
				pos++;
				value = scanString();
				return token = 10;
			case 47:
				const start = pos - 1;
				if (text.charCodeAt(pos + 1) === 47) {
					pos += 2;
					while (pos < len) {
						if (isLineBreak(text.charCodeAt(pos))) break;
						pos++;
					}
					value = text.substring(start, pos);
					return token = 12;
				}
				if (text.charCodeAt(pos + 1) === 42) {
					pos += 2;
					const safeLength = len - 1;
					let commentClosed = false;
					while (pos < safeLength) {
						const ch = text.charCodeAt(pos);
						if (ch === 42 && text.charCodeAt(pos + 1) === 47) {
							pos += 2;
							commentClosed = true;
							break;
						}
						pos++;
						if (isLineBreak(ch)) {
							if (ch === 13 && text.charCodeAt(pos) === 10) pos++;
							lineNumber++;
							tokenLineStartOffset = pos;
						}
					}
					if (!commentClosed) {
						pos++;
						scanError = 1;
					}
					value = text.substring(start, pos);
					return token = 13;
				}
				value += String.fromCharCode(code);
				pos++;
				return token = 16;
			case 45:
				value += String.fromCharCode(code);
				pos++;
				if (pos === len || !isDigit(text.charCodeAt(pos))) return token = 16;
			case 48:
			case 49:
			case 50:
			case 51:
			case 52:
			case 53:
			case 54:
			case 55:
			case 56:
			case 57:
				value += scanNumber();
				return token = 11;
			default:
				while (pos < len && isUnknownContentCharacter(code)) {
					pos++;
					code = text.charCodeAt(pos);
				}
				if (tokenOffset !== pos) {
					value = text.substring(tokenOffset, pos);
					switch (value) {
						case "true": return token = 8;
						case "false": return token = 9;
						case "null": return token = 7;
					}
					return token = 16;
				}
				value += String.fromCharCode(code);
				pos++;
				return token = 16;
		}
	}
	function isUnknownContentCharacter(code) {
		if (isWhiteSpace(code) || isLineBreak(code)) return false;
		switch (code) {
			case 125:
			case 93:
			case 123:
			case 91:
			case 34:
			case 58:
			case 44:
			case 47: return false;
		}
		return true;
	}
	function scanNextNonTrivia() {
		let result;
		do
			result = scanNext();
		while (result >= 12 && result <= 15);
		return result;
	}
	return {
		setPosition,
		getPosition: () => pos,
		scan: ignoreTrivia ? scanNextNonTrivia : scanNext,
		getToken: () => token,
		getTokenValue: () => value,
		getTokenOffset: () => tokenOffset,
		getTokenLength: () => pos - tokenOffset,
		getTokenStartLine: () => lineStartOffset,
		getTokenStartCharacter: () => tokenOffset - prevTokenLineStartOffset,
		getTokenError: () => scanError
	};
}
function isWhiteSpace(ch) {
	return ch === 32 || ch === 9;
}
function isLineBreak(ch) {
	return ch === 10 || ch === 13;
}
function isDigit(ch) {
	return ch >= 48 && ch <= 57;
}
var CharacterCodes;
(function(CharacterCodes) {
	CharacterCodes[CharacterCodes["lineFeed"] = 10] = "lineFeed";
	CharacterCodes[CharacterCodes["carriageReturn"] = 13] = "carriageReturn";
	CharacterCodes[CharacterCodes["space"] = 32] = "space";
	CharacterCodes[CharacterCodes["_0"] = 48] = "_0";
	CharacterCodes[CharacterCodes["_1"] = 49] = "_1";
	CharacterCodes[CharacterCodes["_2"] = 50] = "_2";
	CharacterCodes[CharacterCodes["_3"] = 51] = "_3";
	CharacterCodes[CharacterCodes["_4"] = 52] = "_4";
	CharacterCodes[CharacterCodes["_5"] = 53] = "_5";
	CharacterCodes[CharacterCodes["_6"] = 54] = "_6";
	CharacterCodes[CharacterCodes["_7"] = 55] = "_7";
	CharacterCodes[CharacterCodes["_8"] = 56] = "_8";
	CharacterCodes[CharacterCodes["_9"] = 57] = "_9";
	CharacterCodes[CharacterCodes["a"] = 97] = "a";
	CharacterCodes[CharacterCodes["b"] = 98] = "b";
	CharacterCodes[CharacterCodes["c"] = 99] = "c";
	CharacterCodes[CharacterCodes["d"] = 100] = "d";
	CharacterCodes[CharacterCodes["e"] = 101] = "e";
	CharacterCodes[CharacterCodes["f"] = 102] = "f";
	CharacterCodes[CharacterCodes["g"] = 103] = "g";
	CharacterCodes[CharacterCodes["h"] = 104] = "h";
	CharacterCodes[CharacterCodes["i"] = 105] = "i";
	CharacterCodes[CharacterCodes["j"] = 106] = "j";
	CharacterCodes[CharacterCodes["k"] = 107] = "k";
	CharacterCodes[CharacterCodes["l"] = 108] = "l";
	CharacterCodes[CharacterCodes["m"] = 109] = "m";
	CharacterCodes[CharacterCodes["n"] = 110] = "n";
	CharacterCodes[CharacterCodes["o"] = 111] = "o";
	CharacterCodes[CharacterCodes["p"] = 112] = "p";
	CharacterCodes[CharacterCodes["q"] = 113] = "q";
	CharacterCodes[CharacterCodes["r"] = 114] = "r";
	CharacterCodes[CharacterCodes["s"] = 115] = "s";
	CharacterCodes[CharacterCodes["t"] = 116] = "t";
	CharacterCodes[CharacterCodes["u"] = 117] = "u";
	CharacterCodes[CharacterCodes["v"] = 118] = "v";
	CharacterCodes[CharacterCodes["w"] = 119] = "w";
	CharacterCodes[CharacterCodes["x"] = 120] = "x";
	CharacterCodes[CharacterCodes["y"] = 121] = "y";
	CharacterCodes[CharacterCodes["z"] = 122] = "z";
	CharacterCodes[CharacterCodes["A"] = 65] = "A";
	CharacterCodes[CharacterCodes["B"] = 66] = "B";
	CharacterCodes[CharacterCodes["C"] = 67] = "C";
	CharacterCodes[CharacterCodes["D"] = 68] = "D";
	CharacterCodes[CharacterCodes["E"] = 69] = "E";
	CharacterCodes[CharacterCodes["F"] = 70] = "F";
	CharacterCodes[CharacterCodes["G"] = 71] = "G";
	CharacterCodes[CharacterCodes["H"] = 72] = "H";
	CharacterCodes[CharacterCodes["I"] = 73] = "I";
	CharacterCodes[CharacterCodes["J"] = 74] = "J";
	CharacterCodes[CharacterCodes["K"] = 75] = "K";
	CharacterCodes[CharacterCodes["L"] = 76] = "L";
	CharacterCodes[CharacterCodes["M"] = 77] = "M";
	CharacterCodes[CharacterCodes["N"] = 78] = "N";
	CharacterCodes[CharacterCodes["O"] = 79] = "O";
	CharacterCodes[CharacterCodes["P"] = 80] = "P";
	CharacterCodes[CharacterCodes["Q"] = 81] = "Q";
	CharacterCodes[CharacterCodes["R"] = 82] = "R";
	CharacterCodes[CharacterCodes["S"] = 83] = "S";
	CharacterCodes[CharacterCodes["T"] = 84] = "T";
	CharacterCodes[CharacterCodes["U"] = 85] = "U";
	CharacterCodes[CharacterCodes["V"] = 86] = "V";
	CharacterCodes[CharacterCodes["W"] = 87] = "W";
	CharacterCodes[CharacterCodes["X"] = 88] = "X";
	CharacterCodes[CharacterCodes["Y"] = 89] = "Y";
	CharacterCodes[CharacterCodes["Z"] = 90] = "Z";
	CharacterCodes[CharacterCodes["asterisk"] = 42] = "asterisk";
	CharacterCodes[CharacterCodes["backslash"] = 92] = "backslash";
	CharacterCodes[CharacterCodes["closeBrace"] = 125] = "closeBrace";
	CharacterCodes[CharacterCodes["closeBracket"] = 93] = "closeBracket";
	CharacterCodes[CharacterCodes["colon"] = 58] = "colon";
	CharacterCodes[CharacterCodes["comma"] = 44] = "comma";
	CharacterCodes[CharacterCodes["dot"] = 46] = "dot";
	CharacterCodes[CharacterCodes["doubleQuote"] = 34] = "doubleQuote";
	CharacterCodes[CharacterCodes["minus"] = 45] = "minus";
	CharacterCodes[CharacterCodes["openBrace"] = 123] = "openBrace";
	CharacterCodes[CharacterCodes["openBracket"] = 91] = "openBracket";
	CharacterCodes[CharacterCodes["plus"] = 43] = "plus";
	CharacterCodes[CharacterCodes["slash"] = 47] = "slash";
	CharacterCodes[CharacterCodes["formFeed"] = 12] = "formFeed";
	CharacterCodes[CharacterCodes["tab"] = 9] = "tab";
})(CharacterCodes || (CharacterCodes = {}));
new Array(20).fill(0).map((_, index) => {
	return " ".repeat(index);
});
var maxCachedValues = 200;
new Array(maxCachedValues).fill(0).map((_, index) => {
	return "\n" + " ".repeat(index);
}), new Array(maxCachedValues).fill(0).map((_, index) => {
	return "\r" + " ".repeat(index);
}), new Array(maxCachedValues).fill(0).map((_, index) => {
	return "\r\n" + " ".repeat(index);
}), new Array(maxCachedValues).fill(0).map((_, index) => {
	return "\n" + "	".repeat(index);
}), new Array(maxCachedValues).fill(0).map((_, index) => {
	return "\r" + "	".repeat(index);
}), new Array(maxCachedValues).fill(0).map((_, index) => {
	return "\r\n" + "	".repeat(index);
});
//#endregion
//#region node_modules/monaco-editor/esm/external/jsonc-parser/lib/esm/impl/parser.js
var ParseOptions;
(function(ParseOptions) {
	ParseOptions.DEFAULT = { allowTrailingComma: false };
})(ParseOptions || (ParseOptions = {}));
//#endregion
//#region node_modules/monaco-editor/esm/external/jsonc-parser/lib/esm/main.js
/**
* Creates a JSON scanner on the given text.
* If ignoreTrivia is set, whitespaces or comments are ignored.
*/
var createScanner = createScanner$1;
var ScanError;
(function(ScanError) {
	ScanError[ScanError["None"] = 0] = "None";
	ScanError[ScanError["UnexpectedEndOfComment"] = 1] = "UnexpectedEndOfComment";
	ScanError[ScanError["UnexpectedEndOfString"] = 2] = "UnexpectedEndOfString";
	ScanError[ScanError["UnexpectedEndOfNumber"] = 3] = "UnexpectedEndOfNumber";
	ScanError[ScanError["InvalidUnicode"] = 4] = "InvalidUnicode";
	ScanError[ScanError["InvalidEscapeCharacter"] = 5] = "InvalidEscapeCharacter";
	ScanError[ScanError["InvalidCharacter"] = 6] = "InvalidCharacter";
})(ScanError || (ScanError = {}));
var SyntaxKind;
(function(SyntaxKind) {
	SyntaxKind[SyntaxKind["OpenBraceToken"] = 1] = "OpenBraceToken";
	SyntaxKind[SyntaxKind["CloseBraceToken"] = 2] = "CloseBraceToken";
	SyntaxKind[SyntaxKind["OpenBracketToken"] = 3] = "OpenBracketToken";
	SyntaxKind[SyntaxKind["CloseBracketToken"] = 4] = "CloseBracketToken";
	SyntaxKind[SyntaxKind["CommaToken"] = 5] = "CommaToken";
	SyntaxKind[SyntaxKind["ColonToken"] = 6] = "ColonToken";
	SyntaxKind[SyntaxKind["NullKeyword"] = 7] = "NullKeyword";
	SyntaxKind[SyntaxKind["TrueKeyword"] = 8] = "TrueKeyword";
	SyntaxKind[SyntaxKind["FalseKeyword"] = 9] = "FalseKeyword";
	SyntaxKind[SyntaxKind["StringLiteral"] = 10] = "StringLiteral";
	SyntaxKind[SyntaxKind["NumericLiteral"] = 11] = "NumericLiteral";
	SyntaxKind[SyntaxKind["LineCommentTrivia"] = 12] = "LineCommentTrivia";
	SyntaxKind[SyntaxKind["BlockCommentTrivia"] = 13] = "BlockCommentTrivia";
	SyntaxKind[SyntaxKind["LineBreakTrivia"] = 14] = "LineBreakTrivia";
	SyntaxKind[SyntaxKind["Trivia"] = 15] = "Trivia";
	SyntaxKind[SyntaxKind["Unknown"] = 16] = "Unknown";
	SyntaxKind[SyntaxKind["EOF"] = 17] = "EOF";
})(SyntaxKind || (SyntaxKind = {}));
var ParseErrorCode;
(function(ParseErrorCode) {
	ParseErrorCode[ParseErrorCode["InvalidSymbol"] = 1] = "InvalidSymbol";
	ParseErrorCode[ParseErrorCode["InvalidNumberFormat"] = 2] = "InvalidNumberFormat";
	ParseErrorCode[ParseErrorCode["PropertyNameExpected"] = 3] = "PropertyNameExpected";
	ParseErrorCode[ParseErrorCode["ValueExpected"] = 4] = "ValueExpected";
	ParseErrorCode[ParseErrorCode["ColonExpected"] = 5] = "ColonExpected";
	ParseErrorCode[ParseErrorCode["CommaExpected"] = 6] = "CommaExpected";
	ParseErrorCode[ParseErrorCode["CloseBraceExpected"] = 7] = "CloseBraceExpected";
	ParseErrorCode[ParseErrorCode["CloseBracketExpected"] = 8] = "CloseBracketExpected";
	ParseErrorCode[ParseErrorCode["EndOfFileExpected"] = 9] = "EndOfFileExpected";
	ParseErrorCode[ParseErrorCode["InvalidCommentToken"] = 10] = "InvalidCommentToken";
	ParseErrorCode[ParseErrorCode["UnexpectedEndOfComment"] = 11] = "UnexpectedEndOfComment";
	ParseErrorCode[ParseErrorCode["UnexpectedEndOfString"] = 12] = "UnexpectedEndOfString";
	ParseErrorCode[ParseErrorCode["UnexpectedEndOfNumber"] = 13] = "UnexpectedEndOfNumber";
	ParseErrorCode[ParseErrorCode["InvalidUnicode"] = 14] = "InvalidUnicode";
	ParseErrorCode[ParseErrorCode["InvalidEscapeCharacter"] = 15] = "InvalidEscapeCharacter";
	ParseErrorCode[ParseErrorCode["InvalidCharacter"] = 16] = "InvalidCharacter";
})(ParseErrorCode || (ParseErrorCode = {}));
//#endregion
//#region node_modules/monaco-editor/esm/vs/language/json/tokenization.js
function createTokenizationSupport(supportComments) {
	return {
		getInitialState: () => new JSONState(null, null, false, null),
		tokenize: (line, state) => tokenize(supportComments, line, state)
	};
}
var TOKEN_DELIM_OBJECT = "delimiter.bracket.json";
var TOKEN_DELIM_ARRAY = "delimiter.array.json";
var TOKEN_DELIM_COLON = "delimiter.colon.json";
var TOKEN_DELIM_COMMA = "delimiter.comma.json";
var TOKEN_VALUE_BOOLEAN = "keyword.json";
var TOKEN_VALUE_NULL = "keyword.json";
var TOKEN_VALUE_STRING = "string.value.json";
var TOKEN_VALUE_NUMBER = "number.json";
var TOKEN_PROPERTY_NAME = "string.key.json";
var TOKEN_COMMENT_BLOCK = "comment.block.json";
var TOKEN_COMMENT_LINE = "comment.line.json";
var ParentsStack = class ParentsStack {
	constructor(parent, type) {
		this.parent = parent;
		this.type = type;
	}
	static pop(parents) {
		if (parents) return parents.parent;
		return null;
	}
	static push(parents, type) {
		return new ParentsStack(parents, type);
	}
	static equals(a, b) {
		if (!a && !b) return true;
		if (!a || !b) return false;
		while (a && b) {
			if (a === b) return true;
			if (a.type !== b.type) return false;
			a = a.parent;
			b = b.parent;
		}
		return true;
	}
};
var JSONState = class JSONState {
	constructor(state, scanError, lastWasColon, parents) {
		this._state = state;
		this.scanError = scanError;
		this.lastWasColon = lastWasColon;
		this.parents = parents;
	}
	clone() {
		return new JSONState(this._state, this.scanError, this.lastWasColon, this.parents);
	}
	equals(other) {
		if (other === this) return true;
		if (!other || !(other instanceof JSONState)) return false;
		return this.scanError === other.scanError && this.lastWasColon === other.lastWasColon && ParentsStack.equals(this.parents, other.parents);
	}
	getStateData() {
		return this._state;
	}
	setStateData(state) {
		this._state = state;
	}
};
function tokenize(comments, line, state, offsetDelta = 0) {
	let numberOfInsertedCharacters = 0;
	let adjustOffset = false;
	switch (state.scanError) {
		case 2:
			line = "\"" + line;
			numberOfInsertedCharacters = 1;
			break;
		case 1:
			line = "/*" + line;
			numberOfInsertedCharacters = 2;
			break;
	}
	const scanner = createScanner(line);
	let lastWasColon = state.lastWasColon;
	let parents = state.parents;
	const ret = {
		tokens: [],
		endState: state.clone()
	};
	while (true) {
		let offset = offsetDelta + scanner.getPosition();
		let type = "";
		const kind = scanner.scan();
		if (kind === 17) break;
		if (offset === offsetDelta + scanner.getPosition()) throw new Error("Scanner did not advance, next 3 characters are: " + line.substr(scanner.getPosition(), 3));
		if (adjustOffset) offset -= numberOfInsertedCharacters;
		adjustOffset = numberOfInsertedCharacters > 0;
		switch (kind) {
			case 1:
				parents = ParentsStack.push(parents, 0);
				type = TOKEN_DELIM_OBJECT;
				lastWasColon = false;
				break;
			case 2:
				parents = ParentsStack.pop(parents);
				type = TOKEN_DELIM_OBJECT;
				lastWasColon = false;
				break;
			case 3:
				parents = ParentsStack.push(parents, 1);
				type = TOKEN_DELIM_ARRAY;
				lastWasColon = false;
				break;
			case 4:
				parents = ParentsStack.pop(parents);
				type = TOKEN_DELIM_ARRAY;
				lastWasColon = false;
				break;
			case 6:
				type = TOKEN_DELIM_COLON;
				lastWasColon = true;
				break;
			case 5:
				type = TOKEN_DELIM_COMMA;
				lastWasColon = false;
				break;
			case 8:
			case 9:
				type = TOKEN_VALUE_BOOLEAN;
				lastWasColon = false;
				break;
			case 7:
				type = TOKEN_VALUE_NULL;
				lastWasColon = false;
				break;
			case 10:
				const inArray = (parents ? parents.type : 0) === 1;
				type = lastWasColon || inArray ? TOKEN_VALUE_STRING : TOKEN_PROPERTY_NAME;
				lastWasColon = false;
				break;
			case 11:
				type = TOKEN_VALUE_NUMBER;
				lastWasColon = false;
				break;
		}
		switch (kind) {
			case 12:
				type = TOKEN_COMMENT_LINE;
				break;
			case 13:
				type = TOKEN_COMMENT_BLOCK;
				break;
		}
		ret.endState = new JSONState(state.getStateData(), scanner.getTokenError(), lastWasColon, parents);
		ret.tokens.push({
			startIndex: offset,
			scopes: type
		});
	}
	return ret;
}
//#endregion
//#region node_modules/monaco-editor/esm/vs/language/json/jsonMode.js
var worker;
function getWorker() {
	return new Promise((resolve, reject) => {
		if (!worker) return reject("JSON not registered!");
		resolve(worker);
	});
}
var JSONDiagnosticsAdapter = class extends DiagnosticsAdapter {
	constructor(languageId, worker2, defaults) {
		super(languageId, worker2, defaults.onDidChange);
		this._disposables.push(editor.onWillDisposeModel((model) => {
			this._resetSchema(model.uri);
		}));
		this._disposables.push(editor.onDidChangeModelLanguage((event) => {
			this._resetSchema(event.model.uri);
		}));
	}
	_resetSchema(resource) {
		this._worker().then((worker2) => {
			worker2.resetSchema(resource.toString());
		});
	}
};
function setupMode(defaults) {
	const disposables = [];
	const providers = [];
	const client = new WorkerManager(defaults);
	disposables.push(client);
	worker = (...uris) => {
		return client.getLanguageServiceWorker(...uris);
	};
	function registerProviders() {
		const { languageId, modeConfiguration: modeConfiguration2 } = defaults;
		disposeAll(providers);
		if (modeConfiguration2.documentFormattingEdits) providers.push(languages.registerDocumentFormattingEditProvider(languageId, new DocumentFormattingEditProvider(worker)));
		if (modeConfiguration2.documentRangeFormattingEdits) providers.push(languages.registerDocumentRangeFormattingEditProvider(languageId, new DocumentRangeFormattingEditProvider(worker)));
		if (modeConfiguration2.completionItems) providers.push(languages.registerCompletionItemProvider(languageId, new CompletionAdapter(worker, [
			" ",
			":",
			"\""
		])));
		if (modeConfiguration2.hovers) providers.push(languages.registerHoverProvider(languageId, new HoverAdapter(worker)));
		if (modeConfiguration2.documentSymbols) providers.push(languages.registerDocumentSymbolProvider(languageId, new DocumentSymbolAdapter(worker)));
		if (modeConfiguration2.tokens) providers.push(languages.setTokensProvider(languageId, createTokenizationSupport(true)));
		if (modeConfiguration2.colors) providers.push(languages.registerColorProvider(languageId, new DocumentColorAdapter(worker)));
		if (modeConfiguration2.foldingRanges) providers.push(languages.registerFoldingRangeProvider(languageId, new FoldingRangeAdapter(worker)));
		if (modeConfiguration2.diagnostics) providers.push(new JSONDiagnosticsAdapter(languageId, worker, defaults));
		if (modeConfiguration2.selectionRanges) providers.push(languages.registerSelectionRangeProvider(languageId, new SelectionRangeAdapter(worker)));
	}
	registerProviders();
	disposables.push(languages.setLanguageConfiguration(defaults.languageId, richEditConfiguration));
	let modeConfiguration = defaults.modeConfiguration;
	defaults.onDidChange((newDefaults) => {
		if (newDefaults.modeConfiguration !== modeConfiguration) {
			modeConfiguration = newDefaults.modeConfiguration;
			registerProviders();
		}
	});
	disposables.push(asDisposable(providers));
	return asDisposable(disposables);
}
function asDisposable(disposables) {
	return { dispose: () => disposeAll(disposables) };
}
function disposeAll(disposables) {
	while (disposables.length) disposables.pop().dispose();
}
var richEditConfiguration = {
	wordPattern: /(-?\d*\.\d\w*)|([^\[\{\]\}\:\"\,\s]+)/g,
	comments: {
		lineComment: "//",
		blockComment: ["/*", "*/"]
	},
	brackets: [["{", "}"], ["[", "]"]],
	autoClosingPairs: [
		{
			open: "{",
			close: "}",
			notIn: ["string"]
		},
		{
			open: "[",
			close: "]",
			notIn: ["string"]
		},
		{
			open: "\"",
			close: "\"",
			notIn: ["string"]
		}
	]
};
//#endregion
export { CompletionAdapter, DefinitionAdapter, DiagnosticsAdapter, DocumentColorAdapter, DocumentFormattingEditProvider, DocumentHighlightAdapter, DocumentLinkAdapter, DocumentRangeFormattingEditProvider, DocumentSymbolAdapter, FoldingRangeAdapter, HoverAdapter, ReferenceAdapter, RenameAdapter, SelectionRangeAdapter, WorkerManager, fromPosition, fromRange, getWorker, setupMode, toRange, toTextEdit };
