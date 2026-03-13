import React, { useEffect, useRef } from "react";

const ConsoleLogsBox = ({ consoleLogs }) => {
  const logsRef = useRef(null);

  useEffect(() => {
    if (logsRef.current) {
      logsRef.current.innerHTML = consoleLogs
        .map((log) => `<div>${log}</div>`)
        .join("");
    }
  }, [consoleLogs]);

  const errorStyles = {
    color: "#ff5252",
    marginBottom: "1rem",
  };

  const sentStatusStyles = {
    color: "#e5e5e5",
    marginBottom: "1rem",
  };

  return (
    <div className="h-full max-h-[500px] overflow-auto p-8 bg-transparent">
      <h2 className="text-xl font-semibold tracking-tight text-white/90 mb-6 border-b border-white/5 pb-4">Terminal Output</h2>
      <div className="flex flex-col md:flex-row justify-between gap-8 font-mono text-sm leading-relaxed">
        <div style={errorStyles} className="w-full md:w-1/2 p-4 bg-[#0a0a0a] rounded-[8px] border border-red-500/30">
          <h3 className="font-semibold mb-3 border-b border-red-500/30 pb-2">ERROR_STREAM:</h3>
          <pre ref={logsRef} className="whitespace-pre-wrap mt-2"></pre>
        </div>
        <div style={sentStatusStyles} className="w-full md:w-1/2 p-4 bg-[#0a0a0a] rounded-[8px] border border-[#333]">
          <h3 className="font-semibold mb-3 border-b border-[#333] pb-2 text-gray-400">STDOUT_STREAM:</h3>
          <pre ref={logsRef} className="whitespace-pre-wrap mt-2"></pre>
        </div>
      </div>
    </div>
  );
};

export default ConsoleLogsBox;
