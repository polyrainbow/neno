import * as path from "node:path";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";

const intlFolder = path.join(
  import.meta.dirname, "..", "src", "intl",
);

const srcFolder = path.join(
  import.meta.dirname, "..", "src",
);

const translations = new Map();

(await readdir(intlFolder))
  .filter((filename) => {
    return filename.endsWith(".json");
  })
  .forEach((filename) => {
    const string = readFileSync(
      path.join(intlFolder, filename),
      "utf8",
    );
    translations.set(filename, JSON.parse(string));
  });

let concatenatedSourceCode = "";

(await readdir(srcFolder, { recursive: true }))
  .filter((filename) => {
    return filename.endsWith(".tsx")
      || filename.endsWith(".ts");
  })
  .forEach((filename) => {
    const string = readFileSync(
      path.join(srcFolder, filename),
      "utf8",
    );
    concatenatedSourceCode += string;
  });


for (const [localeFilename, translation] of translations.entries()) {
  let deletedKeys = 0;

  const translationKeys = Object.keys(translation);
  const originalNumberOfKeys = translationKeys.length;

  for (const key of translationKeys) {
    if (!concatenatedSourceCode.includes("\"" + key + "\"")) {
      console.log(`Removing unused ${localeFilename} key ${key}`);
      delete translation[key];
      deletedKeys++;
    }
  }

  writeFile(
    path.join(intlFolder, localeFilename),
    JSON.stringify(translation, null, "  "),
  );

  console.log(
    `Removed ${deletedKeys}/${originalNumberOfKeys} key(s) from ${localeFilename}`,
  );
}
