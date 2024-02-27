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

  const containerStyles = {
    padding: "1rem",
    borderRadius: "24px 24px 16px 16px",
    background:
      "linear-gradient(268.56deg, rgba(150, 150, 150, 0.1), rgba(150, 150, 150, 0.1))",
    boxShadow:
      "1.2396273612976074px 1.2396273612976074px 13.64px rgba(0, 0, 0, 0.25) inset",
    border: "0.6px solid #545151",
    transition: "transform 0.3s, background 0.3s",
    // transform: isHovered ? "scale(1.02)" : "scale(1)",
  };

  return (
    <div style={containerStyles}>
      <h1 className="text-center text-3xl">JSON Editor</h1>
      <textarea
        className="text-black"
        placeholder="Start typing here ...."
        value={textareaValue}
        onChange={handleTextareaChange}
        style={{ width: "100%", height: "400px" }}
      />
      <div className="flex justify-between px-16 py-4">
        <Button
          style={{ backgroundColor: "#4CAF50" }}
          onClick={handleParseClick}
          variant="contained"
          color="success"
          disabled={parseLoading}
        >
          {parseLoading ? "Parsing..." : "Parse"}
        </Button>
        <Button
          style={{ backgroundColor: "#f44336" }}
          onClick={handleResetClick}
          variant="contained"
          color="error"
          disabled={resetLoading}
        >
          {resetLoading ? "Resetting..." : "Reset"}
        </Button>
      </div>
    </div>
  );
};

export default JSONEditor;
