// pages/index.js
import React, { useState, useEffect, useMemo } from "react";
import HTMLEditor from "../components/HtmlEditor";
import PreviewScreen from "../components/PreviewScreen";
import JSONEditor from "@/components/JsonEditor";
import JSONPreview from "@/components/JsonPreview";
import InputFields from "@/components/InputFields";
import sendEmail from "@/utils/Mailer";
import Button from "@mui/material/Button";
import EmailTable from "@/components/EmailTable";
import ConsoleLogsBox from "@/components/ConsoleLogBox";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Link from "next/link";

const Home = () => {
  const [subject, setSubject] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [from, setFrom] = useState("");
  const [replyTo, setReplyTo] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [jsonContent, setJsonContent] = useState("");
  const [sendEmailLoading, setSendEmailLoading] = useState(false);
  const [sentEmails, setSentEmails] = useState([]);
  const [errorLogs, setErrorLogs] = useState([]);

  const { data: session } = useSession();
  const router = useRouter();
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
    try {
      setSendEmailLoading(true);

      // Reset sent emails
      setSentEmails([]);
      setErrorLogs([]);

      await sendEmail(
        from,
        subject,
        htmlContent,
        displayText,
        jsonContent,
        (email) => setSentEmails((prevEmails) => [...prevEmails, email]),
        (error) => setErrorLogs((prevErrors) => [...prevErrors, error]),
      );
    } finally {
      setSendEmailLoading(false);
    }
  };

  useEffect(() => {
    // Scroll to the bottom of the console logs box when updated
    if (sentEmails.length > 0) {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, [sentEmails]);

  useEffect(() => {
    if (!session) {
      router.push("/signIn");
    }
  }, [session, router]);

  const containerStyles = {
    padding: "1rem",
    borderRadius: "24px 24px 16px 16px",
    background:
      "linear-gradient(268.56deg, rgba(150, 150, 150, 0.1), rgba(150, 150, 150, 0.1))",

    boxShadow:
      "1.2396273612976074px 1.2396273612976074px 13.64px rgba(0, 0, 0, 0.25) inset",
    border: "0.6px solid #545151",
    transition: "transform 0.3s, background 0.3s",
  };

  return (
    <>
      <header>
        <div className="flex justify-between items-center p-4 text-white">
          <h1 className="text-2xl">Email Sender</h1>
          <div className="flex gap-3 justify-items-center align-middle items-center text-white">
            <Button
              size="large"
              variant="outlined"
              color="success"
              onClick={(e) => {
                e.preventDefault();
                router.push("/signUp");
              }}
            >
              Add User
            </Button>
            <Button
              size="large"
              variant="outlined"
              color="error"
              onClick={(e) => {
                e.preventDefault();
                signOut();
              }}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>
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

            <HTMLEditor handleChange={handleHTMLChange} />
          </div>
          <div className="w-[50%] max-xl:w-[100%] h-full">
            <PreviewScreen htmlContent={htmlContent} />
          </div>
        </div>
        <div className="flex mt-10  max-xl:flex-col justify-between p-10 gap-2">
          <div className="w-[50%] max-xl:w-[100%]">
            <JSONEditor value={jsonContent} onParse={handleParseJSON} />
          </div>
          <div className="w-[50%] max-xl:w-[100%]">
            <JSONPreview jsonContent={jsonContent} onChange={setJsonContent} />
          </div>
        </div>
        <div className="flex justify-center">
          <Button
            onClick={sendEmails}
            color="success"
            variant="contained"
            // size="large"
            style={{ backgroundColor: "#4CAF50" }}
            disabled={sendEmailLoading}
          >
            {sendEmailLoading ? "Sending..." : "Send Emails"}
          </Button>
        </div>
        <div className="flex mt-10  max-xl:flex-col justify-between p-10 gap-2">
          <div className="w-[50%] max-xl:w-[100%] ">
            <div className="">
              <EmailTable emails={sentEmails} />
            </div>
          </div>

          <div className="w-[50%] max-xl:w-[100%]">
            <ConsoleLogsBox
              consoleLogs={[
                ...sentEmails.map((email) => `Email sent to ${email}`),
                ...errorLogs.map((error) => `Error: ${error}`),
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
