// pages/index.js
import { useState } from "react";
import HTMLEditor from "../components/HTMLEditor";
import PreviewScreen from "../components/PreviewScreen";
import JSONEditor from "@/components/JsonEditor";
import AWS from "aws-sdk";
import JSONPreview from "@/components/JsonPreview";
import InputFields from "@/components/InputFields";

AWS.config.update({
  accessKeyId: "AKIATCKATGASYZMR3JWF",
  secretAccessKey: "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",
  region: "ap-south-1",
});

const sesv2 = new AWS.SES({ apiVersion: "2019-09-27" });

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

  const sendEmails = async () => {
    // Check if csvData is defined
    if (!csvData) {
      console.error("CSV data is not defined.");
      return;
    }

    // Iterate through each row in the CSV data
    for (const row of csvData) {
      // Log the entire row data to check for the presence of 'email' field
      console.log("CSV Row Data:", row);

      // Check if the row is not empty and 'email' field is present
      if (!row || row.length !== 1 || !row[0]) {
        console.error("Email address is undefined. Skipping.");
        continue;
      }

      const email = row[0]; // Extract the email address from the array

      console.log("Debug: Email to be sent:", email);
      console.log("Debug: From:", from);
      console.log("Debug: Subject:", subject);
      // console.log("Debug: HTML Content:", htmlContent);

      // Send email using SES
      try {
        const result = await sesv2
          .sendEmail({
            Source: from,
            Destination: { ToAddresses: [email] },
            Message: {
              Body: { Html: { Charset: "UTF-8", Data: htmlContent } },
              Subject: { Charset: "UTF-8", Data: subject },
            },
          })
          .promise();

        console.log("Email sent to", email);
        console.log("SES Response:", result);
      } catch (error) {
        console.error("Error sending email to", email, ":", error);
      }
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
      {/* <button onClick={sendEmails}>Send Emails</button> */}
    </div>
  );
};

export default Home;
