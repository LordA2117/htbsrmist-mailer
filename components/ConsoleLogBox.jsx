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

  const containerStyles = {
    padding: "2rem",
    borderRadius: "24px 24px 16px 16px",
    background:
      "linear-gradient(268.56deg, rgba(150, 150, 150, 0.1), rgba(150, 150, 150, 0.1))",
    boxShadow:
      "1.2396273612976074px 1.2396273612976074px 13.64px rgba(0, 0, 0, 0.25) inset",
    border: "0.6px solid #545151",
    transition: "transform 0.3s, background 0.3s",
  };

  const errorStyles = {
    color: "red",
    marginBottom: "1rem",
  };

  const sentStatusStyles = {
    color: "green",
    marginBottom: "1rem",
  };

  return (
    <div style={containerStyles} className="h-[500px] overflow-auto">
      <h2 className="text-center text-3xl">Console</h2>
      <div className="flex justify-between p-10 gap-2">
        <div style={errorStyles}>
          <h3>Error Logs:</h3>
          <pre ref={logsRef} style={{ whiteSpace: "pre-wrap" }}></pre>
        </div>
        <div style={sentStatusStyles}>
          <h3>Sent Status:</h3>
          <pre ref={logsRef} style={{ whiteSpace: "pre-wrap" }}></pre>
        </div>
      </div>
    </div>
  );
};

export default ConsoleLogsBox;
