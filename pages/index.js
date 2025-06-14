// pages/index.js
import React, { useState, useEffect } from "react";
import HTMLEditor from "../components/HtmlEditor";
import PreviewScreen from "../components/PreviewScreen";
import JSONEditor from "@/components/JsonEditor";
import JSONPreview from "@/components/JsonPreview";
import InputFields from "@/components/InputFields";
import sendEmail from "@/utils/Mailer";
import Button from "@mui/material/Button";
import EmailTable from "@/components/EmailTable";
import ConsoleLogsBox from "@/components/ConsoleLogBox";

import { useRouter } from 'next/router';

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
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
  const [templates, setTemplates] = useState([]);
  const router = useRouter();

  // Fetch templates when component mounts
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/templates');
        const data = await response.json();
        setTemplates(data);
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };
    fetchTemplates();
  }, []);

  // Check for selected template on component mount
  useEffect(() => {
    const selectedTemplate = localStorage.getItem('selectedTemplate');
    if (selectedTemplate) {
      try {
        const template = JSON.parse(selectedTemplate);
        setSubject(template.subject || "");
        setDisplayText(template.displayText || "");
        setFrom(template.from || "");
        setReplyTo(template.replyTo || "");
        setHtmlContent(template.htmlContent || "");
        
        // Clear the template from localStorage after loading
        localStorage.removeItem('selectedTemplate');
      } catch (error) {
        console.error('Error loading selected template:', error);
      }
    }
  }, []);

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
      setErrorLogs(prev => [...prev, `Error parsing JSON: ${error.message}`]);
    }
  };

  const sendEmails = async () => {
    try {
      setSendEmailLoading(true);
      setSentEmails([]);
      setErrorLogs([]);

      await sendEmail(
        from,
        subject,
        htmlContent,
        displayText,
        jsonContent,
        (email) => setSentEmails((prevEmails) => [...prevEmails, email]),
        (error) => setErrorLogs((prevErrors) => [...prevErrors, error])
      );
    } catch (error) {
      setErrorLogs(prev => [...prev, `Error sending emails: ${error.message}`]);
    } finally {
      setSendEmailLoading(false);
    }
  };

  useEffect(() => {
    // Scroll to the bottom of the console logs box when updated
    if (sentEmails.length > 0 || errorLogs.length > 0) {
      window.scrollTo(0, document.body.scrollHeight);
    }

  }, [sentEmails, errorLogs]);

  }, [sentEmails]);

  useEffect(() => {
    if (!session) {
      router.push("/signIn");
    }
  }, [session, router]);



  const containerStyles = {
    padding: "1rem",
    borderRadius: "24px 24px 16px 16px",
    background: "linear-gradient(268.56deg, rgba(150, 150, 150, 0.1), rgba(150, 150, 150, 0.1))",
    boxShadow: "1.2396273612976074px 1.2396273612976074px 13.64px rgba(0, 0, 0, 0.25) inset",
    border: "0.6px solid #545151",
    transition: "transform 0.3s, background 0.3s",
  };

  if (!session) {
    return null; // Return null while redirecting to avoid rendering the component
  }

  return (

    <div className="min-h-screen text-white">
      {/* Add this new header div */}
      <div className="flex justify-end items-start p-4">
  <Button
    variant="outlined"
    color="success"
    onClick={() => router.push('/templates')}
    sx={{
      color: '#4CAF50',
      borderColor: '#4CAF50',
      '&:hover': {
        borderColor: '#388E3C',
        backgroundColor: 'rgba(76, 175, 80, 0.04)',
      },
    }}
  >
    Templates
  </Button>
</div>



      {/* Keep all your existing content below */}
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
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl">Mail Editor</h1>
            <select
              className="bg-gray-800 text-white px-4 py-2 rounded"
              onChange={(e) => {
                const selected = templates.find(tpl => tpl.name === e.target.value);
                if (selected) {
                  setSubject(selected.subject || "");
                  setDisplayText(selected.displayText || "");
                  setFrom(selected.from || "");
                  setReplyTo(selected.replyTo || "");
                  setHtmlContent(selected.htmlContent || "");
                }
              }}
              value=""
            >
              <option value="">Templates</option>
              {templates.map((tpl, idx) => (
                <option key={idx} value={tpl.name}>
                  {tpl.name}
                </option>
              ))}
            </select>
          </div>

          <HTMLEditor value={htmlContent} onChange={handleHTMLChange} />
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
                router.push("/signUp")
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

            <HTMLEditor value={htmlContent} onChange={handleHTMLChange} />
          </div>
          <div className="w-[50%] max-xl:w-[100%] h-full">
            <PreviewScreen htmlContent={htmlContent} />
          </div>
        </div>

      </div>
      
      <div className="flex mt-10 max-xl:flex-col justify-between p-10 gap-2">
        <div className="w-[50%] max-xl:w-[100%]">
          <JSONEditor value={jsonContent} onParse={handleParseJSON} />

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

      </div>
      
      <div className="flex justify-center p-4">
        <Button
          onClick={sendEmails}
          color="success"
          variant="contained"
          style={{ backgroundColor: "#4CAF50", padding: "12px 24px" }}
          disabled={sendEmailLoading || !from || !subject || !htmlContent}
        >
          {sendEmailLoading ? "Sending..." : "Send Emails"}
        </Button>
      </div>
      
      <div className="flex mt-10 max-xl:flex-col justify-between p-10 gap-2">
        <div className="w-[50%] max-xl:w-[100%]">
          <div className="rounded-lg">
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