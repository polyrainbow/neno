import React from "react";

interface NoteContentBlockAudioProps {
  text: string,
}


const NoteContentBlockParagraph = ({
  text,
}: NoteContentBlockAudioProps) => {

  const lines = text.split("\n");
  const markup = lines.map((lineText, lineIndex, lines) => {

    const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;

    const line:React.ReactElement[] = [];
    const outerParts = lineText.split(regex);
    let i = 0;
    for (const match of lineText.matchAll(regex)) {
      const matchValue = match[0];
      line.push(<span
        key={`paragraph_url_${lineIndex}_op_${matchValue}`}
      >{outerParts[i]}</span>);
      line.push(
        <a
          href={matchValue}
          target="_blank"
          rel="noreferrer noopener"
          key={`paragraph_url_${lineIndex}_match_${matchValue}`}
        >{matchValue}</a>,
      );
      i++;
    }
    line.push(
      <span
        key={`paragraph_url_${lineIndex}_final`}
      >{outerParts[outerParts.length - 1]}</span>,
    );

    if (i < lines.length - 1) {
      line.push(<br key={Math.random()} />);
    }

    return line;
  });
  return <p
    key={Math.random()}
    className="preview-block-paragraph"
  >
    {markup}
  </p>;
};


export default NoteContentBlockParagraph;
