import { Slug } from "../notes/types/Slug.js";

export type OutputSegment
  = { type: "text"; value: string }
  | { type: "noteLink"; title: string; slug: Slug };

export type Output = OutputSegment[];
