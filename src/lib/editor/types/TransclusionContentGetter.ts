import { ReactElement } from "react";

export type TransclusionContentGetter = (id: string) => Promise<ReactElement>;
