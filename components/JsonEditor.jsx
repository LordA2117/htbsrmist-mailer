import React, { useState } from "react";
import Button from "@mui/material/Button";

const JSONEditor = ({ value, onParse }) => {
  const [textareaValue, setTextareaValue] = useState(value);
  const [parseLoading, setParseLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleTextareaChange = (e) => {
    const newValue = e.target.value;
    setTextareaValue(newValue);
  };

  const handleParseClick = async () => {
    try {
      setParseLoading(true);
      await onParse(textareaValue);
    } finally {
      setParseLoading(false);
    }
  };

  const handleResetClick = async () => {
    try {
      setResetLoading(true);
      setTextareaValue("");
      await onParse(""); // Reset the parsed JSON content as well, if needed
    } finally {
      setResetLoading(false);
    }
  };

  const demoPayloads = {
    basic: `[
  {
    "email": "demo_target_01@htb.local"
  }
]`,
    personalized: `[
  {
    "email": "admin@htb.local",
    "name": "System Administrator",
    "role": "Root"
  },
  {
    "email": "guest@htb.local",
    "name": "Local Guest",
    "role": "User"
  }
]`,
    event: `[
  {
    "email": "invitee@htb.local",
    "event_name": "Cyber Warfare 101",
    "ticket_code": "HTB-X892-F",
    "date": "2026-03-15"
  }
]`
  };

  const handleDemoFill = (type) => {
    setTextareaValue(demoPayloads[type]);
  };

  return (
    <div className="h-full flex flex-col items-stretch justify-between p-4 bg-transparent border-none">
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => handleDemoFill('basic')}
          className="whitespace-nowrap px-4 py-1.5 bg-[#0a0a0a] border border-[#333] text-gray-400 text-xs font-mono rounded-[6px] hover:text-white hover:border-[#555] transition-colors"
        >
          [+] Demo (Basic)
        </button>
        <button
          onClick={() => handleDemoFill('personalized')}
          className="whitespace-nowrap px-4 py-1.5 bg-[#0a0a0a] border border-[#333] text-gray-400 text-xs font-mono rounded-[6px] hover:text-white hover:border-[#555] transition-colors"
        >
          [+] Demo (Variables)
        </button>
        <button
          onClick={() => handleDemoFill('event')}
          className="whitespace-nowrap px-4 py-1.5 bg-[#0a0a0a] border border-[#333] text-gray-400 text-xs font-mono rounded-[6px] hover:text-white hover:border-[#555] transition-colors"
        >
          [+] Demo (Event)
        </button>
      </div>

      <textarea
        className="w-full flex-1 min-h-[300px] p-4 font-mono text-sm bg-black text-[#e5e5e5] border border-[#333] rounded-[8px] focus:outline-none focus:ring-0 focus:border-white/50 placeholder-gray-600 transition-colors"
        placeholder={'[\n  {"email":"target@domain.com"}\n]'}
        value={textareaValue}
        onChange={handleTextareaChange}
        spellCheck="false"
      />

      <div className="flex justify-end gap-4 mt-6">
        <Button
          onClick={handleResetClick}
          variant="outlined"
          disabled={resetLoading}
          sx={{
            borderColor: "#333",
            color: "#aaa",
            textTransform: "none",
            borderRadius: "6px",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.05)",
              borderColor: "#555",
            }
          }}
        >
          {resetLoading ? "Clearing..." : "Clear"}
        </Button>
        <Button
          onClick={handleParseClick}
          variant="contained"
          disabled={parseLoading || !textareaValue}
          sx={{
            backgroundColor: "#fff",
            color: "#000",
            fontWeight: "600",
            textTransform: "none",
            borderRadius: "6px",
            "&:hover": {
              backgroundColor: "#e5e5e5",
            },
            "&:disabled": {
              backgroundColor: "rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.3)"
            }
          }}
        >
          {parseLoading ? "Compiling..." : "Inject JSON"}
        </Button>
      </div>
    </div>
  );
};

export default JSONEditor;
