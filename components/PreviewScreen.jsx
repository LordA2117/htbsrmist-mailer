// components/PreviewScreen.js
import React from "react";

const PreviewScreen = ({ htmlContent }) => {
  const containerStyles = {
    padding: "1rem",
    borderRadius: "24px 24px 16px 16px",
    background:
      "linear-gradient(268.56deg, rgba(150, 150, 150, 0.1), rgba(150, 150, 150, 0.1))",
    boxShadow:
      "1.2396273612976074px 1.2396273612976074px 13.64px rgba(0, 0, 0, 0.25) inset",
    border: "0.6px solid #545151",
    transition: "transform 0.3s, background 0.3s",
    overflow: "hidden", // prevent bleed
  };

  const contentStyles = {
    maxWidth: "100%",
    overflowX: "auto",
    wordBreak: "break-word",
  };

  return (
    <div style={containerStyles} className="h-[1000px]">
      <h1 className="text-center text-3xl">Mail Preview</h1>
      <div style={contentStyles} className="h-full overflow-y-auto">
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    </div>
  );
};

export default PreviewScreen;
