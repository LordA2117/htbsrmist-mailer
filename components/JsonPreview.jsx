// components/JSONPreview.js
import React from "react";

const JSONPreview = ({ jsonContent }) => {
  console.log("JSON Content:", jsonContent);

  if (!jsonContent || !Array.isArray(jsonContent) || jsonContent.length === 0) {
    return <p>No valid JSON data to display</p>;
  }

  const renderTableHeader = () => {
    // Check if jsonContent[0] is defined before using Object.keys
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
    <div>
      <h2>JSON Preview</h2>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        {renderTableHeader()}
        {renderTableBody()}
      </table>
    </div>
  );
};

export default JSONPreview;
