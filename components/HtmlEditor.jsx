// components/HtmlEditor.js
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/ext-language_tools";
import { useEffect, useState } from "react";

const HTMLEditor = ({ value, onChange }) => {
  const [editorValue, setEditorValue] = useState("");

  // Sync external value into local state AFTER mount
  useEffect(() => {
    setEditorValue(value);
  }, [value]);

  return (
    <AceEditor
      placeholder="Start typing here ...."
      mode="html"
      theme="terminal"
      name="html-editor"
      style={{ color: "white", height: "100vh", width: "100%" }}
      onChange={(newValue) => {
        setEditorValue(newValue);
        onChange(newValue);
      }}
      fontSize={14}
      showPrintMargin={true}
      showGutter={true}
      highlightActiveLine={true}
      value={editorValue}   // ← controlled by local state
      setOptions={{
        useWorker: false,
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        showLineNumbers: true,
        tabSize: 2,
      }}
    />
  );
};

export default HTMLEditor;
