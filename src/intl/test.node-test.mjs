import * as path from "path";
import * as fs from "fs";
import * as url from "url";
import it, { describe } from "node:test";
import * as assert from "node:assert";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

describe("intl", () => {
  it("all language files should be valid json in utf8 file without BOM", () => {
    const intlFolder = __dirname;

    assert.doesNotThrow(
      () => {
        fs
          .readdirSync(intlFolder)
          .filter((filename) => {
            return filename.endsWith(".json");
          })
          .forEach((filename) => {
            const string = fs.readFileSync(
              path.join(intlFolder, filename),
              "utf8",
            );
            JSON.parse(string);
          });
      },
    );
  });


  it("all keys in language files should be sorted alphabetically", () => {
    const intlFolder = __dirname;

    fs.readdirSync(intlFolder)
      .filter((filename) => {
        return filename.endsWith(".json");
      })
      .forEach((filename) => {
        const string = fs.readFileSync(path.join(intlFolder, filename), "utf8");
        const langObj = JSON.parse(string);

        const keys = Object.keys(langObj);

        const keysAreSortedAlphabetically
          = keys.every((val, i, arr) => !i
            || (val.toLowerCase() >= arr[i - 1].toLowerCase()));

        assert.deepStrictEqual(keysAreSortedAlphabetically, true);
      });
  });

  it("horizontal ellipsis should be used in favor of 3 dots", () => {
    const intlFolder = __dirname;

    fs.readdirSync(intlFolder)
      .filter((filename) => {
        return filename.endsWith(".json");
      })
      .forEach((filename) => {
        const string = fs.readFileSync(path.join(intlFolder, filename), "utf8");
        const langObj = JSON.parse(string);

        const values = Object.values(langObj);

        const someValuesContainThreeDots
          = values.some((val) => {
            return val.includes("...");
          });

        assert.deepStrictEqual(someValuesContainThreeDots, false);
      });
  });


  it("all files must have same keys as en-US", () => {
    const intlFolder = __dirname;
    let enKeys;
    const keyMap = new Map();

    fs.readdirSync(intlFolder)
      .filter((filename) => {
        return filename.endsWith(".json");
      })
      .forEach((filename) => {
        const string = fs.readFileSync(path.join(intlFolder, filename), "utf8");
        const locale = filename.substring(0, filename.indexOf(".json"));
        const langObj = JSON.parse(string);
        const keys = Object.keys(langObj);

        if (locale === "en-US") {
          enKeys = keys;
        } else {
          keyMap.set(locale, keys);
        }
      });

    keyMap.forEach((value) => {
      assert.deepStrictEqual(value, enKeys);
    });
  });
});
