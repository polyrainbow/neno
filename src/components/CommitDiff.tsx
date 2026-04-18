import { l } from "../lib/intl";
import { FileDiff } from "../lib/notes-worker/NotesProviderProxy";

interface CommitDiffProps {
  files: FileDiff[];
}

const CommitDiff = ({ files }: CommitDiffProps) => {
  if (files.length === 0) {
    return <p className="commit-diff-empty">{l("history.diff.no-changes")}</p>;
  }

  return <div className="commit-diff">
    {files.map((file) => (
      <div className="commit-diff-file" key={file.path}>
        <div className="commit-diff-file-header">
          <span className={`commit-diff-file-change ${file.change}`}>
            {file.change}
          </span>
          <span className="commit-diff-file-path">{file.path}</span>
        </div>
        {file.binary
          ? <p className="commit-diff-placeholder">
            {l("history.diff.binary")}
          </p>
          : null}
        {file.tooLarge
          ? <p className="commit-diff-placeholder">
            {l("history.diff.too-large")}
          </p>
          : null}
        {file.lines
          ? <pre className="commit-diff-body">
            {file.lines.map((line, idx) => (
              <span
                key={idx}
                className={`commit-diff-line ${line.type}`}
              >
                {line.type === "add"
                  ? "+"
                  : line.type === "remove"
                    ? "-"
                    : " "}
                {" "}
                {line.segments
                  ? line.segments.map((seg, segIdx) => (
                    seg.emphasized
                      ? <span
                        key={segIdx}
                        className="commit-diff-segment emphasized"
                      >{seg.text}</span>
                      : seg.text
                  ))
                  : line.text}
                {"\n"}
              </span>
            ))}
          </pre>
          : null}
      </div>
    ))}
  </div>;
};

export default CommitDiff;
