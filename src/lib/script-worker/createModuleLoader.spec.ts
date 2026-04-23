import { describe, it, expect, vi } from "vitest";
import {
  createModuleLoader,
  ModuleThisNote,
} from "./createModuleLoader.js";


const makeDeps = (
  notes: Record<string, string>,
  runModule?: (code: string) => Promise<unknown>,
) => {
  let thisNote: ModuleThisNote | undefined = undefined;
  const getRawNote = vi.fn(async (slug: string) => {
    if (!(slug in notes)) {
      throw new Error("note not found: " + slug);
    }
    return notes[slug];
  });
  const defaultRun = async (code: string): Promise<unknown> => {
    const AsyncFunction
      = Object.getPrototypeOf(async function() {}).constructor;
    return await new AsyncFunction(code)();
  };
  return {
    getRawNote,
    runModule: runModule ?? defaultRun,
    getThisNote: () => thisNote,
    setThisNote: (n: ModuleThisNote | undefined) => {
      thisNote = n;
    },
    readThisNote: () => thisNote,
  };
};


describe("createModuleLoader", () => {
  it("loads a mod block and returns its exported value", async () => {
    const deps = makeDeps({
      "utils": "```mod\nreturn { double: (x) => x * 2 };\n```",
    });
    const { use } = createModuleLoader(deps);
    const mod = await use("utils") as { double: (n: number) => number };
    expect(mod.double(21)).toBe(42);
  });

  it(
    "throws when the note has no mod block",
    async () => {
      const deps = makeDeps({
        "plain": "just a paragraph\n",
      });
      const { use } = createModuleLoader(deps);
      await expect(use("plain")).rejects.toThrow(
        "Note \"plain\" has no mod block",
      );
    },
  );

  it(
    "propagates getRawNote errors",
    async () => {
      const deps = makeDeps({});
      const { use } = createModuleLoader(deps);
      await expect(use("missing")).rejects.toThrow(
        "note not found: missing",
      );
    },
  );

  it(
    "detects direct cycles (A imports A)",
    async () => {
      const deps = makeDeps({
        "a": "```mod\nawait use('a');\nreturn 1;\n```",
      });
      const loader = createModuleLoader(deps);
      // The module body references `use`, which must be globally
      // visible to the AsyncFunction created by defaultRun. Expose
      // it via globalThis for the duration of this test.
      (globalThis as unknown as { use: typeof loader.use })
        .use = loader.use;
      try {
        await expect(loader.use("a")).rejects.toThrow(
          "Module cycle detected: a",
        );
      } finally {
        delete (globalThis as { use?: unknown }).use;
      }
    },
  );

  it(
    "detects transitive cycles (A -> B -> A)",
    async () => {
      const deps = makeDeps({
        "a": "```mod\nawait use('b');\nreturn 1;\n```",
        "b": "```mod\nawait use('a');\nreturn 2;\n```",
      });
      const loader = createModuleLoader(deps);
      (globalThis as unknown as { use: typeof loader.use })
        .use = loader.use;
      try {
        await expect(loader.use("a")).rejects.toThrow(
          "Module cycle detected: a",
        );
      } finally {
        delete (globalThis as { use?: unknown }).use;
      }
    },
  );

  it(
    "caches modules for the lifetime of the loader"
    + " (same call twice = one fetch)",
    async () => {
      const deps = makeDeps({
        "utils": "```mod\nreturn { v: 1 };\n```",
      });
      const { use } = createModuleLoader(deps);
      const a = await use("utils");
      const b = await use("utils");
      expect(a).toBe(b);
      expect(deps.getRawNote).toHaveBeenCalledTimes(1);
    },
  );

  it(
    "re-fetches after reset() (per-evaluation caching)",
    async () => {
      const deps = makeDeps({
        "utils": "```mod\nreturn { v: 1 };\n```",
      });
      const loader = createModuleLoader(deps);
      await loader.use("utils");
      loader.reset();
      await loader.use("utils");
      expect(deps.getRawNote).toHaveBeenCalledTimes(2);
    },
  );

  it(
    "swaps thisNote to the module's own note during execution,"
    + " then restores the previous value",
    async () => {
      const observed: (string | undefined)[] = [];
      const deps = makeDeps({
        "mod-a": "```mod\nreturn 1;\n```",
      });
      // Wrap runModule so we can observe thisNote during execution.
      const baseRun = deps.runModule;
      deps.runModule = async (code: string) => {
        observed.push(deps.readThisNote()?.slug);
        return baseRun(code);
      };
      const outer: ModuleThisNote = {
        slug: "caller",
        content: "",
        blocks: [],
        keyValues: new Map(),
      };
      deps.setThisNote(outer);
      const { use } = createModuleLoader(deps);
      await use("mod-a");
      expect(observed).toEqual(["mod-a"]);
      expect(deps.readThisNote()).toBe(outer);
    },
  );

  it(
    "picks the first mod block when a note has multiple",
    async () => {
      const content
        = "```mod\nreturn 'first';\n```\n"
        + "\n"
        + "```mod\nreturn 'second';\n```\n";
      const deps = makeDeps({ "m": content });
      const { use } = createModuleLoader(deps);
      expect(await use("m")).toBe("first");
    },
  );

  it(
    "ignores run blocks — only mod blocks count as modules",
    async () => {
      const deps = makeDeps({
        "scratch": "```run\nprintln('hi');\n```\n",
      });
      const { use } = createModuleLoader(deps);
      await expect(use("scratch")).rejects.toThrow(
        "has no mod block",
      );
    },
  );
});
