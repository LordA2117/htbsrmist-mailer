// components/PreviewScreen.js
import React from "react";

const PreviewScreen = ({ htmlContent }) => {
  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

export default PreviewScreen;
