import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import AceEditor with SSR disabled
const AceEditor = dynamic(() => import("react-ace"), { ssr: false });

const HTMLEditor = ({ value, onChange }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only load these on the client
    const loadAce = async () => {
      await import("ace-builds/src-noconflict/mode-html");
      await import("ace-builds/src-noconflict/theme-terminal");
      await import("ace-builds/src-noconflict/ext-language_tools");
      setMounted(true);
    };
    loadAce();
  }, []);

  if (!mounted) {
    return (
      <div style={{ height: "100vh", width: "100%", backgroundColor: "#0a0a0a" }}>
        Loading Editor...
      </div>
    );
  }

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
          editor.renderer.updateFull();
        }}
        onChange={(newValue) => onChange(newValue)}
        fontSize={14}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        value={value}
        setOptions={{
          useWorker: false, // CRITICAL: Fix for production uneditable/black issue
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

