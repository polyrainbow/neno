import { Link } from "react-router-dom";
import { InlineText, Span } from "../lib/subwaytext/interfaces/Block";
import { SpanType } from "../lib/subwaytext/interfaces/SpanType";
import { getAppPath } from "../lib/utils";
import { PathTemplate } from "../enum/PathTemplate";
import { LOCAL_GRAPH_ID } from "../config";
import { sluggifyLink } from "../lib/notes/noteUtils";

interface NoteContentInlineTextProps {
  runningText: InlineText,
}

const NoteContentInlineText = ({
  runningText,
}: NoteContentInlineTextProps) => {
  const markup = runningText.map((span: Span, i: number) => {
    if (span.type === SpanType.HYPERLINK) {
      return <span
        key={`hyperlink-span-${i}-${span.text}`}
      >
        <a
          href={span.text}
          target="_blank"
          rel="noreferrer noopener"
        >{span.text}</a>
      </span>;
    } else if (span.type === SpanType.WIKILINK) {
      const linkText = span.text.substring(2, span.text.length - 2);
      const slug = sluggifyLink(linkText);

      return <span
        key={`wikilink-span-${i}-${span.text}`}
      >
        <Link
          to={getAppPath(
            PathTemplate.EXISTING_NOTE,
            new Map([
              ["GRAPH_ID", LOCAL_GRAPH_ID],
              ["SLUG", slug],
            ]),
          )}
        >{linkText}</Link>
      </span>;
    } else if (span.type === SpanType.SLASHLINK) {
      const linkText = span.text;
      const slug = sluggifyLink(linkText.substring(1));

      return <span
        key={`slashlink-span-${i}-${span.text}`}
      >
        <Link
          to={getAppPath(
            PathTemplate.EXISTING_NOTE,
            new Map([
              ["GRAPH_ID", LOCAL_GRAPH_ID],
              ["SLUG", slug],
            ]),
          )}
        >{linkText}</Link>
      </span>;
    } else {
      // normal text or slashlink.
      // inline slashlinks are currently rendered as normal text

      const lines = span.text.split("\n");

      const markup: React.ReactElement[] = [];

      lines.forEach((line, i) => {
        markup.push(
          <span
            key={`paragraph_url_${i}_op_${i}`}
          >{line}</span>,
        );

        if (i < lines.length - 1) {
          markup.push(<br key={Math.random()} />);
        }
      });

      return markup;
    }
  });

  return <>{markup}</>;
};


export default NoteContentInlineText;
