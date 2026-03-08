// components/HtmlEditor.js  ← keep this clean, no dynamic() here
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/ext-language_tools";

const HTMLEditor = ({ value, onChange }) => {
  return (
    <AceEditor
      placeholder="Start typing here ...."
      mode="html"
      theme="terminal"
      name="html-editor"
      style={{ color: "white", height: "100vh", width: "100%" }}
      onChange={(newValue) => onChange(newValue)}
      fontSize={14}
      showPrintMargin={true}
      showGutter={true}
      highlightActiveLine={true}
      value={value}
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