/*
  NENO Electron main process.

  The renderer is NOT loaded from file://: NENO's router is built on the
  Navigation API and URLPattern and matches on location.pathname, and
  OPFS / localStorage / IndexedDB / module workers are unavailable or
  unreliable on file://. Instead the built dist/ is served over a custom
  `neno://` scheme registered as standard + secure, with an SPA fallback
  to index.html. Nothing in the router or the Vite config has to change.
*/

import {
  app,
  BrowserWindow,
  Menu,
  protocol,
  session,
  shell,
} from "electron";
import * as fs from "node:fs/promises";
import { createReadStream } from "node:fs";
import * as path from "node:path";
import { Readable } from "node:stream";
import { registerStorageBridge, disposeStorageBridges } from "./storage/bridge";
import { registerDialogHandlers } from "./dialogs";
import { registerConfigHandlers } from "./config";
import {
  registerUnsavedChangesHandler,
  registerUnsavedChangesIpc,
} from "./unsavedChanges";

const APP_SCHEME = "neno";
const APP_ORIGIN = `${APP_SCHEME}://app`;
const DEV_SERVER_URL = process.env.NENO_DEV_SERVER_URL;
const IS_DEV = typeof DEV_SERVER_URL === "string" && DEV_SERVER_URL.length > 0;

/*
  Registering the scheme as `standard` gives the origin real
  origin semantics (and therefore a storage partition); `secure` puts it
  in a secure context so service-worker-free OPFS, crypto and module
  workers behave as they do over HTTPS.
*/
protocol.registerSchemesAsPrivileged([
  {
    scheme: APP_SCHEME,
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      stream: true,
      corsEnabled: true,
    },
  },
]);

const MIME_TYPES = new Map<string, string>([
  [".html", "text/html"],
  [".js", "text/javascript"],
  [".mjs", "text/javascript"],
  [".css", "text/css"],
  [".json", "application/json"],
  [".webmanifest", "application/manifest+json"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".gif", "image/gif"],
  [".webp", "image/webp"],
  [".ico", "image/x-icon"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
  [".ttf", "font/ttf"],
  [".otf", "font/otf"],
  [".wasm", "application/wasm"],
  [".map", "application/json"],
  [".txt", "text/plain"],
  [".md", "text/markdown"],
  [".subtext", "text/plain"],
  [".pdf", "application/pdf"],
  [".mp3", "audio/mpeg"],
  [".mp4", "video/mp4"],
  [".webm", "video/webm"],
]);

function getBundleRoot(): string {
  return path.join(app.getAppPath(), "dist");
}

function getMimeType(filePath: string): string {
  return MIME_TYPES.get(path.extname(filePath).toLowerCase())
    ?? "application/octet-stream";
}

async function isReadableFile(filePath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(filePath);
    return stats.isFile();
  } catch {
    return false;
  }
}

function toResponse(filePath: string): Response {
  const body = Readable.toWeb(
    createReadStream(filePath),
  ) as ReadableStream<Uint8Array>;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": getMimeType(filePath),
    },
  });
}

/*
  Resolves a neno:// request against the bundle root. Paths that would
  escape the bundle are rejected; any path without a file extension
  falls back to index.html so deep links into the SPA work.
*/
async function handleAppRequest(request: Request): Promise<Response> {
  const bundleRoot = getBundleRoot();
  const { pathname } = new URL(request.url);
  const decodedPathname = decodeURIComponent(pathname);
  const relativePath = decodedPathname.replace(/^\/+/, "");
  const indexPath = path.join(bundleRoot, "index.html");

  if (relativePath.length === 0) {
    return toResponse(indexPath);
  }

  const resolved = path.join(bundleRoot, relativePath);

  if (
    resolved !== bundleRoot
    && !resolved.startsWith(bundleRoot + path.sep)
  ) {
    return new Response("Forbidden", { status: 403 });
  }

  if (await isReadableFile(resolved)) {
    return toResponse(resolved);
  }

  if (path.extname(resolved) === "") {
    return toResponse(indexPath);
  }

  return new Response("Not found", { status: 404 });
}

function getContentSecurityPolicy(): string {
  /*
    'unsafe-eval' is unavoidable: Monaco's TypeScript worker and the
    scripting sandbox both build functions at runtime. Blob URLs need
    naming in several places — object URLs back media elements, the PDF
    preview iframe and the text-file preview's own fetch.
  */
  const directives = new Map<string, string[]>([
    ["default-src", ["'self'"]],
    ["script-src", ["'self'", "'unsafe-eval'"]],
    ["style-src", ["'self'", "'unsafe-inline'"]],
    ["img-src", ["'self'", "blob:", "data:"]],
    ["media-src", ["'self'", "blob:"]],
    ["font-src", ["'self'", "data:"]],
    ["connect-src", ["'self'", "blob:", "data:"]],
    ["frame-src", ["'self'", "blob:"]],
    ["worker-src", ["'self'", "blob:"]],
    ["object-src", ["'none'"]],
  ]);

  if (IS_DEV) {
    // Vite's dev server, its inline preamble and its HMR websocket.
    const devOrigin = new URL(DEV_SERVER_URL as string).origin;
    const wsOrigin = devOrigin.replace(/^http/, "ws");
    directives.get("default-src")!.push(devOrigin);
    directives.get("script-src")!.push("'unsafe-inline'", devOrigin);
    directives.get("style-src")!.push(devOrigin);
    directives.get("connect-src")!.push(devOrigin, wsOrigin);
  }

  return [...directives]
    .map(([name, values]) => `${name} ${values.join(" ")}`)
    .join("; ");
}

function applyContentSecurityPolicy(): void {
  const policy = getContentSecurityPolicy();
  session.defaultSession.webRequest.onHeadersReceived(
    (details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          "Content-Security-Policy": [policy],
        },
      });
    },
  );
}

function isAppUrl(url: string): boolean {
  if (url.startsWith(APP_ORIGIN)) return true;
  return IS_DEV && url.startsWith(DEV_SERVER_URL as string);
}

function createWindow(): BrowserWindow {
  const window = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 640,
    minHeight: 480,
    title: "NENO",
    backgroundColor: "#1a1a1a",
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      /*
        Without `plugins`, Chromium's PDF viewer is disabled and the PDF
        <iframe> in FileViewPreview renders blank.
      */
      plugins: true,
    },
  });

  window.once("ready-to-show", () => {
    window.show();
  });

  /*
    Note.tsx opens external links with window.open. Without a handler
    that would spawn a bare chrome-less Electron window, so hand
    http(s) links to the system browser and deny everything else.
  */
  window.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      void shell.openExternal(url);
    }
    return { action: "deny" };
  });

  // A stray file drop must not be able to navigate the window away.
  window.webContents.on("will-navigate", (event, url) => {
    if (!isAppUrl(url)) {
      event.preventDefault();
      if (url.startsWith("http://") || url.startsWith("https://")) {
        void shell.openExternal(url);
      }
    }
  });

  registerUnsavedChangesHandler(window);

  if (IS_DEV) {
    void window.loadURL(DEV_SERVER_URL as string);
  } else {
    /*
      The root path, not /index.html: the router matches on
      location.pathname, and "/index.html" is not one of its routes. The
      protocol handler serves index.html for "/" anyway.
    */
    void window.loadURL(`${APP_ORIGIN}/`);
  }

  return window;
}

function buildMenu(): void {
  const isMac = process.platform === "darwin";

  const template: Electron.MenuItemConstructorOptions[] = [
    ...(isMac
      ? [{
        label: app.name,
        submenu: [
          { role: "about" as const },
          { type: "separator" as const },
          { role: "hide" as const },
          { role: "hideOthers" as const },
          { role: "unhide" as const },
          { type: "separator" as const },
          { role: "quit" as const },
        ],
      }]
      : []),
    {
      /*
        The standard Edit roles are not optional: without them Cmd-C,
        Cmd-V and Cmd-Z do not work at all in a packaged Electron app.
      */
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "pasteAndMatchStyle" },
        { role: "delete" },
        { role: "selectAll" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    {
      label: "Window",
      submenu: isMac
        ? [
          { role: "minimize" },
          { role: "zoom" },
          { type: "separator" },
          { role: "front" },
          { role: "close" },
        ]
        : [
          { role: "minimize" },
          { role: "close" },
        ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(() => {
  protocol.handle(APP_SCHEME, handleAppRequest);
  applyContentSecurityPolicy();
  registerConfigHandlers();
  registerDialogHandlers();
  registerStorageBridge();
  registerUnsavedChangesIpc();
  buildMenu();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  disposeStorageBridges();
  /*
    macOS convention: the app stays in the dock with no window open, and
    "activate" (above) opens a fresh one.
  */
  if (process.platform !== "darwin") {
    app.quit();
  }
});
