import subwaytext from "../index.js";

const input = `# My subwaytext document

https://example.com Link to example.com

A paragraph with a https://link.com and a /slashlink and a [[wikilink]].

1. A list with
2. a /slashlink again`;

// eslint-disable-next-line
console.log(JSON.stringify(subwaytext(input), null, "  "));
