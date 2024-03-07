export type InsertItem = {
  type: "string",
  value: string,
} | {
  type: "file-slug",
  value: string,
};
