// components/HTMLEditor.js
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/ext-language_tools";

const HTMLEditor = ({ value, onChange }) => {
  return (
    <div>
      <AceEditor
        placeholder="Start typing here ...."
        mode="html"
        theme="terminal"
        name="html-editor"
        style={{
          color: "white",
          height: "100vh",
          width: "100%",
        }}
        onLoad={(editor) => {
          // You can do something when the editor loads if needed
        }}
        onChange={(newValue) => onChange(newValue)}
        fontSize={14}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        value={value}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 2,
        }}
      />
    </div>
  );
};

export default HTMLEditor;
