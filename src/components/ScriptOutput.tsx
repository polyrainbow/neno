import { Output } from "../lib/script-worker/outputTypes";
import { getAppPath } from "../lib/utils";
import { PathTemplate } from "../types/PathTemplate";
import { LOCAL_GRAPH_ID } from "../config";
import { navigateTo } from "../lib/navigation";

interface ScriptOutputProps {
  output: Output;
}

const ScriptOutput = ({ output }: ScriptOutputProps) => {
  return <>
    {output.map((segment, i) => {
      if (segment.type === "text") {
        return <span key={i}>{segment.value}</span>;
      }
      if (segment.slug.length === 0) {
        return <span key={i}>{segment.title}</span>;
      }
      const href = getAppPath(
        PathTemplate.EXISTING_NOTE,
        new Map([
          ["GRAPH_ID", LOCAL_GRAPH_ID],
          ["SLUG", segment.slug],
        ]),
      );
      return <a
        key={i}
        href={href}
        onClick={(e) => {
          e.preventDefault();
          navigateTo(href);
        }}
      >{segment.title}</a>;
    })}
  </>;
};

export default ScriptOutput;
