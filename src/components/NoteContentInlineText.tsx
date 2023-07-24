import { InlineText, Span } from "../lib/subwaytext/interfaces/Block";
import { SpanType } from "../lib/subwaytext/interfaces/SpanType";

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
