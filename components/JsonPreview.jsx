// components/JSONPreview.js
import React from "react";

const JSONPreview = ({ jsonContent }) => {
  const containerStyles = {
    padding: "2rem",
    borderRadius: "24px 24px 16px 16px",
    background:
      "linear-gradient(268.56deg, rgba(150, 150, 150, 0.1), rgba(150, 150, 150, 0.1))",

    boxShadow:
      "1.2396273612976074px 1.2396273612976074px 13.64px rgba(0, 0, 0, 0.25) inset",
    border: "0.6px solid #545151",
    transition: "transform 0.3s, background 0.3s",
    // transform: isHovered ? "scale(1.02)" : "scale(1)",
  };
  // console.log("JSON Content:", jsonContent);

  if (!jsonContent || !Array.isArray(jsonContent) || jsonContent.length === 0) {
    return (
      <div style={containerStyles} className="h-[540px]">
        <h2 className="text-center text-3xl">JSON Preview</h2>
        <p>No valid JSON data to display</p>
      </div>
    );
  }

  const renderTableHeader = () => {
    const headers = Object.keys(jsonContent[0] || {});
    return (
      <thead>
        <tr>
          {headers.map((field, index) => (
            <th
              key={index}
              style={{ border: "1px solid #ddd", padding: "8px" }}
            >
              {field}
            </th>
          ))}
        </tr>
      </thead>
    );
  };

  const renderTableBody = () => {
    return (
      <tbody>
        {jsonContent.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            style={{ border: "1px solid #ddd", padding: "8px" }}
          >
            {Object.values(row).map((value, colIndex) => (
              <td
                key={colIndex}
                style={{ border: "1px solid #ddd", padding: "8px" }}
              >
                {JSON.stringify(value)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  };
  return (
    <div style={containerStyles} className="h-[540px] overflow-auto">
      <h2 className="text-center text-3xl">JSON Preview</h2>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        {renderTableHeader()}
        {renderTableBody()}
      </table>
    </div>
  );
};

export default JSONPreview;
