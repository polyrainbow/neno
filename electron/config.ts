/*
  Persistent main-process configuration. The absolute path of the graph
  folder lives here instead of in an IndexedDB-held
  FileSystemDirectoryHandle, so relaunching reopens the folder with no
  permission prompt.

  The file is $HOME/.config/neno/config.json — a fixed, inspectable
  location rather than app.getPath("userData"), which moves with
  app.name and would silently strand the stored folder if the app were
  ever renamed.
*/

import { ipcMain } from "electron";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";

export type WindowState = {
  width: number;
  height: number;
  x?: number;
  y?: number;
  maximized?: boolean;
  fullScreen?: boolean;
};

type Config = {
  lastFolder?: string | null;
  window?: WindowState;
};

let cachedConfig: Config | null = null;

function getConfigDirectory(): string {
  return path.join(os.homedir(), ".config", "neno");
}

function getConfigPath(): string {
  return path.join(getConfigDirectory(), "config.json");
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
  /*
    Write and rename, so a crash mid-write cannot leave a truncated file
    behind — readConfig would parse that as an empty config and quietly
    forget the folder.
  */
  const temporaryPath = `${configPath}.tmp`;
  await fs.writeFile(
    temporaryPath,
    JSON.stringify(config, null, 2) + "\n",
    "utf8",
  );
  await fs.rename(temporaryPath, configPath);
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

export async function getWindowState(): Promise<WindowState | null> {
  const config = await readConfig();
  const state = config.window;
  if (
    !state
    || typeof state !== "object"
    || typeof state.width !== "number"
    || typeof state.height !== "number"
  ) {
    return null;
  }
  return state;
}


export async function setWindowState(state: WindowState): Promise<void> {
  const config = await readConfig();
  await writeConfig({ ...config, window: state });
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
