import * as fs from "node:fs/promises";
import * as path from "node:path";

const LOCALES_DIRECTORY = path.join("..", "frontend", "assets", "intl");

const filenames = await fs.readdir(LOCALES_DIRECTORY);

const localeFilenames = filenames.filter((filename) => {
  return filename.endsWith(".json");
});

for (const filename of localeFilenames) {
  const obj = JSON.parse(
    await fs.readFile(path.join(LOCALES_DIRECTORY, filename)),
  );

  const pairs = Object.entries(obj);
  pairs.sort(
    function(a, b) {
      if (a[0].toLowerCase() < b[0].toLowerCase()) {return -1;}
      if (a[0].toLowerCase() > b[0].toLowerCase()) {return 1;}
      return 0;
    },
  );

  const newObj = {};

  pairs.forEach((pair) => {
    newObj[pair[0]] = pair[1];
  });

  await fs.writeFile(
    path.join(LOCALES_DIRECTORY, filename),
    JSON.stringify(newObj, null, "  "),
    "utf8",
  );
}

