//#region node_modules/monaco-editor/esm/vs/basic-languages/azcli/azcli.js
var conf = { comments: { lineComment: "#" } };
var language = {
	defaultToken: "keyword",
	ignoreCase: true,
	tokenPostfix: ".azcli",
	str: /[^#\s]/,
	tokenizer: {
		root: [
			{ include: "@comment" },
			[/\s-+@str*\s*/, { cases: {
				"@eos": {
					token: "key.identifier",
					next: "@popall"
				},
				"@default": {
					token: "key.identifier",
					next: "@type"
				}
			} }],
			[/^-+@str*\s*/, { cases: {
				"@eos": {
					token: "key.identifier",
					next: "@popall"
				},
				"@default": {
					token: "key.identifier",
					next: "@type"
				}
			} }]
		],
		type: [
			{ include: "@comment" },
			[/-+@str*\s*/, { cases: {
				"@eos": {
					token: "key.identifier",
					next: "@popall"
				},
				"@default": "key.identifier"
			} }],
			[/@str+\s*/, { cases: {
				"@eos": {
					token: "string",
					next: "@popall"
				},
				"@default": "string"
			} }]
		],
		comment: [[/#.*$/, { cases: { "@eos": {
			token: "comment",
			next: "@popall"
		} } }]]
	}
};
//#endregion
export { conf, language };
