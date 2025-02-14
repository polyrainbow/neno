import { LOCAL_GRAPH_ID } from "../config";
import { FileInfo } from "../lib/notes/types/FileInfo";
import { getAppPath } from "../lib/utils";
import { PathTemplate } from "../types/PathTemplate";

interface ScriptsViewItemProps {
  file: FileInfo;
  onDelete: () => void;
}

const ScriptsViewItem = ({
  file,
  onDelete,
}: ScriptsViewItemProps) => {
  const slug = file.slug;

  const lastSlugSegment = slug.substring(
    slug.lastIndexOf("/") + 1,
    slug.lastIndexOf("."),
  );

  const title = lastSlugSegment
    .substring(0, lastSlugSegment.length - 5);

  return <div className="scripting-view-item">
    <span className="title">{title}</span>
    <div className="controls">
      <button
        className="default-button-small default-action"
        onClick={() => {
          // @ts-ignore
          navigation.navigate(getAppPath(
            PathTemplate.SCRIPT,
            new Map([
              ["GRAPH_ID", LOCAL_GRAPH_ID],
              ["SCRIPT_SLUG", file.slug],
            ]),
            new URLSearchParams({ run: "true" }),
          ));
        }}
      >Run</button>
      <button
        className="default-button-small default-action"
        onClick={() => {
          // @ts-ignore
          navigation.navigate(getAppPath(
            PathTemplate.SCRIPT,
            new Map([
              ["GRAPH_ID", LOCAL_GRAPH_ID],
              ["SCRIPT_SLUG", file.slug],
            ]),
          ));
        }}
      >Edit</button>
      <button
        className="default-button-small dangerous-action"
        onClick={onDelete}
      >Delete</button>
    </div>
  </div>;
};

export default ScriptsViewItem;
