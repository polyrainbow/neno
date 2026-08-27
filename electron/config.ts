/*
  Persistent main-process configuration. The absolute path of the graph
  folder lives here instead of in an IndexedDB-held
  FileSystemDirectoryHandle, so relaunching reopens the folder with no
  permission prompt.
*/

import { app, ipcMain } from "electron";
import * as fs from "node:fs/promises";
import * as path from "node:path";

type Config = {
  lastFolder?: string | null;
};

let cachedConfig: Config | null = null;

function getConfigPath(): string {
  return path.join(app.getPath("userData"), "config.json");
}

async function readConfig(): Promise<Config> {
  if (cachedConfig) return cachedConfig;
  try {
    const raw = await fs.readFile(getConfigPath(), "utf8");
    const parsed = JSON.parse(raw) as Config;
    cachedConfig = parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    cachedConfig = {};
  }
  return cachedConfig;
}

async function writeConfig(config: Config): Promise<void> {
  cachedConfig = config;
  const configPath = getConfigPath();
  await fs.mkdir(path.dirname(configPath), { recursive: true });
  await fs.writeFile(configPath, JSON.stringify(config, null, 2), "utf8");
}

export async function getLastFolder(): Promise<string | null> {
  const config = await readConfig();
  const lastFolder = config.lastFolder;
  if (typeof lastFolder !== "string" || lastFolder.length === 0) {
    return null;
  }
  // A folder the user has since moved or deleted must not be offered.
  try {
    const stats = await fs.stat(lastFolder);
    if (!stats.isDirectory()) return null;
  } catch {
    return null;
  }
  return lastFolder;
}

export async function setLastFolder(
  folderPath: string | null,
): Promise<void> {
  const config = await readConfig();
  await writeConfig({ ...config, lastFolder: folderPath });
}

export function registerConfigHandlers(): void {
  ipcMain.handle("config:getLastFolder", () => getLastFolder());
  ipcMain.handle(
    "config:setLastFolder",
    (_event, folderPath: unknown) => {
      if (folderPath !== null && typeof folderPath !== "string") {
        throw new Error("setLastFolder expects a string or null");
      }
      return setLastFolder(folderPath);
    },
  );
}
