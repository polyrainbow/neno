import React from "react";

interface EditorProps {
  content: string,
  onChange: (string) => void,
}

const Editor = ({
  content,
  onChange,
}: EditorProps) => {
  return <textarea
    value={content}
    onChange={(e) => onChange(e.target.value)}
    className="editor"
    id="editor"
  />;
};


export default Editor;
