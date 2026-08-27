import { describe, it, expect, beforeEach } from "vitest";
import GitFsProxy from "./GitFsProxy";
import { BridgeRequest, SerializedStat } from "./bridgeTypes";

/*
  The git file system over the bridge. Two things here are contractual
  rather than incidental: isomorphic-git branches on `err.code`, and it
  calls the predicates on a stat object — neither survives a plain
  structured clone, so both are reconstructed on this side.
*/

type Handler = (method: string, args: unknown[]) => unknown;

const setupHandler = (port: MessagePort, handler: Handler): void => {
  port.onmessage = async (event: MessageEvent) => {
    const { id, method, args } = event.data as BridgeRequest;
    try {
      port.postMessage({ id, result: await handler(method, args) });
    } catch (e: unknown) {
      port.postMessage({
        id,
        error: e instanceof Error ? e.message : String(e),
        errorCode: (e as { code?: string })?.code,
      });
    }
  };
};

const fileStat: SerializedStat = {
  type: "file",
  mode: 0o100644,
  size: 12,
  ino: 7,
  mtimeMs: 1,
  ctimeMs: 1,
  uid: 501,
  gid: 20,
  dev: 1,
};


describe("GitFsProxy over MessagePort", () => {
  let proxy: GitFsProxy;
  let serverPort: MessagePort;

  beforeEach(() => {
    const channel = new MessageChannel();
    serverPort = channel.port1;
    proxy = new GitFsProxy(channel.port2);
  });

  it("should alias promises to itself, as isomorphic-git expects", () => {
    expect(proxy.promises).toBe(proxy);
  });

  it("should namespace method names with \"git.\"", async () => {
    const seen: string[] = [];
    setupHandler(serverPort, (method) => {
      seen.push(method);
      return [];
    });

    await proxy.readdir("/");
    expect(seen).toEqual(["git.readdir"]);
  });

  it("should return raw bytes when no encoding is asked for", async () => {
    setupHandler(serverPort, () =>
      new Uint8Array([104, 105]).slice().buffer,
    );

    const result = await proxy.readFile("/a");
    expect(result).toBeInstanceOf(Uint8Array);
    expect([...(result as Uint8Array)]).toEqual([104, 105]);
  });

  it("should decode as UTF-8 when the encoding is utf8", async () => {
    setupHandler(serverPort, () =>
      new TextEncoder().encode("ref: refs/heads/main").slice().buffer,
    );

    expect(await proxy.readFile("/.git/HEAD", "utf8"))
      .toBe("ref: refs/heads/main");
    expect(await proxy.readFile("/.git/HEAD", { encoding: "utf8" }))
      .toBe("ref: refs/heads/main");
  });

  it("should send string data through unchanged", async () => {
    let received: unknown = "not called";
    setupHandler(serverPort, (_method, args) => {
      received = args[1];
      return undefined;
    });

    await proxy.writeFile("/.gitignore", ".DS_Store\n");
    expect(received).toBe(".DS_Store\n");
  });

  it("should send binary data as an ArrayBuffer copy", async () => {
    let received: unknown = "not called";
    setupHandler(serverPort, (_method, args) => {
      received = args[1];
      return undefined;
    });

    const source = new Uint8Array([1, 2, 3]);
    await proxy.writeFile("/.git/objects/x", source);

    expect(received).toBeInstanceOf(ArrayBuffer);
    expect([...new Uint8Array(received as ArrayBuffer)]).toEqual([1, 2, 3]);
    // The source must not have been detached by the send.
    expect(source.byteLength).toBe(3);
  });

  /*
    isomorphic-git calls stats.isFile() / isDirectory(); those methods
    cannot cross a structured clone, so the proxy rebuilds them from the
    serialized `type`.
  */
  it("should rebuild the stat predicates", async () => {
    setupHandler(serverPort, (method) => {
      if (method === "git.stat") return fileStat;
      if (method === "git.lstat") return { ...fileStat, type: "dir" };
      throw new Error("Unknown method: " + method);
    });

    const stats = await proxy.stat("/a");
    expect(stats.isFile()).toBe(true);
    expect(stats.isDirectory()).toBe(false);
    expect(stats.isSymbolicLink()).toBe(false);
    expect(stats.size).toBe(12);

    const lstats = await proxy.lstat("/a");
    expect(lstats.isDirectory()).toBe(true);
    expect(lstats.isFile()).toBe(false);
  });

  it("should surface ENOENT as err.code, which isomorphic-git needs",
    async () => {
      setupHandler(serverPort, () => {
        const err = new Error(
          "ENOENT: no such file or directory, '/.git/HEAD'",
        ) as Error & { code: string };
        err.code = "ENOENT";
        throw err;
      });

      await expect(proxy.stat("/.git/HEAD")).rejects.toMatchObject({
        code: "ENOENT",
      });
    },
  );

  it("should forward mkdir options", async () => {
    let received: unknown = "not called";
    setupHandler(serverPort, (_method, args) => {
      received = args[1];
      return undefined;
    });

    await proxy.mkdir("/.git/refs", { recursive: true });
    expect(received).toEqual({ recursive: true });
  });
});
