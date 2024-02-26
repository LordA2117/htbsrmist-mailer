// pages/index.js
import { useState } from "react";
import HTMLEditor from "../components/HtmlEditor";
import PreviewScreen from "../components/PreviewScreen";
import JSONEditor from "@/components/JsonEditor";
import JSONPreview from "@/components/JsonPreview";
import InputFields from "@/components/InputFields";
import sendEmail from "@/utils/Mailer";

const Home = () => {
  const [subject, setSubject] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [from, setFrom] = useState("");
  const [replyTo, setReplyTo] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [jsonContent, setJsonContent] = useState("");

  const handleHTMLChange = (value) => {
    setHtmlContent(value);
  };

  const handleParseJSON = (jsonText) => {
    try {
      const parsedJSON = JSON.parse(jsonText);
      setJsonContent(parsedJSON);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      // Display an error message to the user if needed
    }
  };

  // console.log(subject, displayText, from, replyTo);

  const sendEmails = () => {
    sendEmail(from, subject, htmlContent, displayText, jsonContent);
  };

  // Assuming your JSON content structure is like this:
  // const jsonContent = [{ email: "example1@example.com" }, { email: "example2@example.com" }, ...];

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
    <div>
      <InputFields
        subject={subject}
        displayText={displayText}
        from={from}
        replyTo={replyTo}
        setSubject={setSubject}
        setDisplayText={setDisplayText}
        setFrom={setFrom}
        setReplyTo={setReplyTo}
      />

      <div className="flex max-xl:flex-col justify-between p-10 gap-2">
        <div className="w-[50%] max-xl:w-[100%]" style={containerStyles}>
          <h1 className="text-center text-3xl text-white">Mail Editor</h1>

          <HTMLEditor value={htmlContent} onChange={handleHTMLChange} />
        </div>
        <div className="w-[50%] max-xl:w-[100%] h-full">
          <PreviewScreen htmlContent={htmlContent} />
        </div>
      </div>
      <div className="flex max-xl:flex-col justify-between p-10 gap-2">
        <div className="w-[50%] max-xl:w-[100%]">
          <JSONEditor value={jsonContent} onParse={handleParseJSON} />
        </div>
        <div className="w-[50%] max-xl:w-[100%]">
          <JSONPreview jsonContent={jsonContent} onChange={setJsonContent} />
        </div>
      </div>
      <button onClick={sendEmails}>Send Emails</button>
    </div>
  );
};

export default Home;
