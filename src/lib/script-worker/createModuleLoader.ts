import subwaytext from "../subwaytext/index.js";
import { Block, BlockType } from "../subwaytext/types/Block.js";
import { getKeyValuesFromBlocks } from "../notes/noteUtils.js";

export interface ModuleThisNote {
  slug: string;
  content: string;
  blocks: Block[];
  keyValues: Map<string, string>;
}

interface LoaderDeps {
  getRawNote: (slug: string) => Promise<string>;
  runModule: (code: string) => Promise<unknown>;
  getThisNote: () => ModuleThisNote | undefined;
  setThisNote: (note: ModuleThisNote | undefined) => void;
}

export interface ModuleLoader {
  use: (slug: string) => Promise<unknown>;
  reset: () => void;
}

export function createModuleLoader(deps: LoaderDeps): ModuleLoader {
  const cache = new Map<string, Promise<unknown>>();
  const stack = new Set<string>();

  const use = (slug: string): Promise<unknown> => {
    if (stack.has(slug)) {
      return Promise.reject(
        new Error("Module cycle detected: " + slug),
      );
    }

    const cached = cache.get(slug);
    if (cached) return cached;

    stack.add(slug);

    const promise = (async () => {
      try {
        let raw: string;
        try {
          raw = await deps.getRawNote(slug);
        } catch {
          throw new Error(
            "Error in use() call: Slug \"" + slug + "\" not found",
          );
        }
        const blocks = subwaytext(raw);
        const modBlock = blocks.find(
          (b): b is Extract<Block, { type: BlockType.CODE }> =>
            b.type === BlockType.CODE
            && b.data.contentType.trim() === "mod",
        );
        if (!modBlock) {
          throw new Error(
            "Note \"" + slug + "\" has no mod block",
          );
        }
        const previous = deps.getThisNote();
        deps.setThisNote({
          slug,
          content: raw,
          blocks,
          keyValues: getKeyValuesFromBlocks(blocks),
        });
        try {
          return await deps.runModule(modBlock.data.code);
        } finally {
          deps.setThisNote(previous);
        }
      } finally {
        stack.delete(slug);
      }
    })();

    cache.set(slug, promise);
    return promise;
  };

  const reset = (): void => {
    cache.clear();
    stack.clear();
  };

  return { use, reset };
}
