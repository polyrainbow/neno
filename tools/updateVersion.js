import { readFile, writeFile } from "fs/promises";
import * as path from "path";
import * as url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const increaseVersion = (version, versionType) => {
  if (versionType === "major") {
    return [
      version[0] + 1,
      0,
      0,
    ];
  } else if (versionType === "minor") {
    return [
      version[0],
      version[1] + 1,
      0,
    ];
  } else if (versionType === "patch") {
    return [
      version[0],
      version[1],
      version[2] + 1,
    ];
  } else {
    throw new Error("Unexpected version type: " + versionType);
  }
};

const parseVersion = (versionString) => {
  return versionString.matchAll(/(\d+).(\d+).(\d+)/g)
    .next().value.slice(1)
    .map((v) => parseInt(v));
};

const serializeVersion = ([major, minor, patch]) => {
  return `${major}.${minor}.${patch}`;
};


const replaceVersionInFile = async (
  filepath,
  oldVersionString,
  newVersionString,
) => {
  const fileContent = await readFile(filepath, { encoding: "utf8" });
  const newFileContent = fileContent.replace(
    oldVersionString,
    newVersionString,
  );
  await writeFile(filepath, newFileContent);
};


const updateConfigFile = async (oldVersionString, newVersionString) => {
  const configFilePath = path.join(
    __dirname, "..", "frontend", "app", "config.tsx",
  );

  await replaceVersionInFile(
    configFilePath, oldVersionString, newVersionString,
  );
};


const updatePackageJson = async (oldVersionString, newVersionString) => {
  const filepath = path.join(__dirname, "..", "package.json");
  await replaceVersionInFile(filepath, oldVersionString, newVersionString);
};


const readCurrentVersion = async () => {
  const filepath = path.join(__dirname, "..", "package.json");
  const fileContent = await readFile(filepath, { encoding: "utf8" });
  return JSON.parse(fileContent).version;
};


const currentVersionString = await readCurrentVersion();
console.log("Current version: " + currentVersionString);
const currentVersion = parseVersion(currentVersionString);
const versionType = process.argv[2];
const newVersion = increaseVersion(currentVersion, versionType);
const newVersionString = serializeVersion(newVersion);
console.log("New version: " + newVersionString);

await updatePackageJson(currentVersionString, newVersionString);
await updateConfigFile(currentVersionString, newVersionString);

