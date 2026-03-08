// pages/index.js
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
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

// ✅ Correct fix: dynamic import the WHOLE HTMLEditor module with ssr:false
const HTMLEditor = dynamic(() => import("../components/HtmlEditor"), {
  ssr: false,
  loading: () => (
    <div style={{ height: "100vh", width: "100%", backgroundColor: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", color: "#555", fontSize: "14px" }}>
      Loading Editor...
    </div>
  ),
});

// Formats/beautifies raw HTML string with proper indentation
const formatHTML = (html) => {
  if (!html) return "";
  let formatted = "";
  let indent = 0;
  const tab = "  ";

  const raw = html.replace(/>\s+</g, "><").trim();
  const tokens = raw.match(/(<[^>]+>|[^<]+)/g);
  if (!tokens) return html;

  tokens.forEach((token) => {
    if (/^<\//.test(token)) {
      indent = Math.max(indent - 1, 0);
      formatted += tab.repeat(indent) + token + "\n";
    } else if (/\/>$/.test(token) || /^<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)(\s|>)/i.test(token)) {
      formatted += tab.repeat(indent) + token + "\n";
    } else if (/^<[a-zA-Z]/.test(token)) {
      formatted += tab.repeat(indent) + token + "\n";
      indent++;
    } else {
      const text = token.trim();
      if (text) formatted += tab.repeat(indent) + text + "\n";
    }
  });

  return formatted.trimEnd();
};

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
  const [selectedTemplateName, setSelectedTemplateName] = useState("");

  const { data: session } = useSession();
  const router = useRouter();

  const resetAllStates = () => {
    setSubject("");
    setDisplayText("");
    setFrom("");
    setReplyTo("");
    setHtmlContent("");
    setJsonContent("");
    setSentEmails([]);
    setErrorLogs([]);
    setSelectedTemplateName("");
  };

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch("/api/templates");
        const data = await response.json();
        setTemplates(data);
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };
    fetchTemplates();
  }, []);

  useEffect(() => {
    const selectedTemplate = localStorage.getItem("selectedTemplate");
    if (selectedTemplate) {
      try {
        const template = JSON.parse(selectedTemplate);
        setSubject(template.subject || "");
        setDisplayText(template.displayText || "");
        setFrom(template.from || "");
        setReplyTo(template.replyTo || "");
        setHtmlContent(formatHTML(template.htmlContent || ""));
        setSelectedTemplateName(template.name || "");
        localStorage.removeItem("selectedTemplate");
      } catch (error) {
        console.error("Error loading selected template:", error);
      }
    }
  }, []);

  const handleHTMLChange = (value) => setHtmlContent(value);

  const handleParseJSON = (jsonText) => {
    try {
      const parsedJSON = JSON.parse(jsonText);
      setJsonContent(parsedJSON);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      setErrorLogs((prev) => [...prev, `Error parsing JSON: ${error.message}`]);
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
        (email) => setSentEmails((prev) => [...prev, email]),
        (error) => setErrorLogs((prev) => [...prev, error])
      );
    } catch (error) {
      setErrorLogs((prev) => [...prev, `Error sending emails: ${error.message}`]);
    } finally {
      setSendEmailLoading(false);
    }
  };

  useEffect(() => {
    if (sentEmails.length > 0 || errorLogs.length > 0) {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, [sentEmails, errorLogs]);

  useEffect(() => {
    if (!session) router.push("/signIn");
  }, [session, router]);

  if (!session) return null;

  return (
    <div className="min-h-screen text-white bg-black overflow-x-hidden font-sans">
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="HTB Logo" className="h-8 object-contain" />
            <h1 className="text-xl font-semibold tracking-tight text-white/90">
              Mailer Engine
            </h1>
          </div>

          <div className="flex gap-2 items-center">
            <Button
              size="small"
              onClick={() => router.push("/templates")}
              sx={{
                color: '#aaa',
                textTransform: 'none',
                fontWeight: 500,
                padding: '4px 12px',
                borderRadius: '6px',
                '&:hover': { color: '#fff', backgroundColor: 'rgba(255,255,255,0.05)' }
              }}
            >
              Templates
            </Button>
            {session && ["mailer@htbchennai.in", "test@gmail.com"].includes(session.user.email) && (
              <Button
                size="small"
                onClick={() => router.push("/signUp")}
                sx={{
                  color: '#aaa',
                  textTransform: 'none',
                  fontWeight: 500,
                  padding: '4px 12px',
                  borderRadius: '6px',
                  '&:hover': { color: '#fff', backgroundColor: 'rgba(255,255,255,0.05)' }
                }}
              >
                Add User
              </Button>
            )}
            <div className="w-[1px] h-4 bg-white/10 mx-1" />
            <Button
              size="small"
              onClick={() => signOut()}
              sx={{
                color: '#fff',
                backgroundColor: '#222',
                border: '1px solid #333',
                textTransform: 'none',
                borderRadius: '6px',
                padding: '4px 16px',
                fontWeight: 500,
                '&:hover': { backgroundColor: '#333', borderColor: '#444' }
              }}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto py-8 lg:px-8 flex flex-col gap-8">
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

        {/* Mail Editor & Preview */}
        <div className="flex max-xl:flex-col justify-between gap-6 px-4 lg:px-0">
          <div className="w-[50%] max-xl:w-[100%] glass-panel glass-panel-hover p-6">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
              <h2 className="text-xl font-semibold tracking-tight text-white/90">Mail HTML Editor</h2>
              <div className="relative">
                <select
                  className="appearance-none bg-[#0a0a0a] border border-[#333] hover:border-[#555] rounded-[6px] pl-3 pr-8 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all cursor-pointer outline-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23888'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.5rem center',
                    backgroundSize: '1.2em 1.2em',
                  }}
                  value={selectedTemplateName}
                  onChange={(e) => {
                    const selected = templates.find((tpl) => tpl.name === e.target.value);
                    if (selected) {
                      resetAllStates();
                      setSubject(selected.subject || "");
                      setDisplayText(selected.displayText || "");
                      setFrom(selected.from || "");
                      setReplyTo(selected.replyTo || "");
                      setHtmlContent(formatHTML(selected.htmlContent || ""));
                      setSelectedTemplateName(selected.name);
                      localStorage.setItem("selectedTemplate", JSON.stringify(selected));
                    } else {
                      setHtmlContent("");
                      setSelectedTemplateName("");
                    }
                  }}
                >
                  <option value="" disabled>Select Template</option>
                  {templates.map((tpl, idx) => (
                    <option
                      key={idx}
                      value={tpl.name}
                      style={{ background: "rgba(40, 40, 40, 0.95)", color: "white", padding: "8px" }}
                    >
                      {tpl.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="rounded-[8px] overflow-hidden border border-[#222]">
              {/* ✅ HTMLEditor is now safe — fully loaded before render via dynamic() */}
              <HTMLEditor value={htmlContent} onChange={handleHTMLChange} />
            </div>
          </div>

          <div className="w-[50%] max-xl:w-[100%] glass-panel p-6 flex flex-col">
            <h2 className="text-xl font-semibold tracking-tight text-white/90 mb-6 border-b border-white/5 pb-4">Live Preview</h2>
            <div className="flex-1 min-h-[400px] bg-white rounded-[8px] overflow-hidden border border-[#222]">
              <PreviewScreen htmlContent={htmlContent} />
            </div>
          </div>
        </div>

        {/* JSON Editor & Preview */}
        <div className="flex mt-2 max-xl:flex-col justify-between gap-6 px-4 lg:px-0">
          <div className="w-[50%] max-xl:w-[100%] glass-panel glass-panel-hover p-6">
            <h2 className="text-xl font-semibold tracking-tight text-white/90 mb-6 border-b border-white/5 pb-4">Variables JSON Input</h2>
            <div className="rounded-[8px] overflow-hidden border border-[#222] min-h-[300px]">
              <JSONEditor value={jsonContent} onParse={handleParseJSON} />
            </div>
          </div>
          <div className="w-[50%] max-xl:w-[100%] glass-panel glass-panel-hover p-6">
            <h2 className="text-xl font-semibold tracking-tight text-white/90 mb-6 border-b border-white/5 pb-4">Parsed JSON Data</h2>
            <div className="rounded-[8px] overflow-hidden border border-[#222] h-full">
              <JSONPreview jsonContent={jsonContent} onChange={setJsonContent} />
            </div>
          </div>
        </div>

        {/* Send & Reset Buttons */}
        <div className="flex justify-center gap-4 py-8 px-4">
          <Button
            onClick={resetAllStates}
            variant="outlined"
            size="large"
            sx={{
              borderColor: "#333",
              color: "#aaa",
              fontWeight: "500",
              textTransform: "none",
              borderRadius: "8px",
              padding: "10px 24px",
              "&:hover": { borderColor: "#666", backgroundColor: "rgba(255,255,255,0.02)" }
            }}
          >
            Reset
          </Button>

          <Button
            onClick={sendEmails}
            variant="contained"
            size="large"
            disabled={sendEmailLoading || !from || !subject || !htmlContent}
            sx={{
              backgroundColor: "#fff",
              color: "#000",
              fontWeight: "600",
              textTransform: "none",
              padding: "10px 32px",
              borderRadius: "8px",
              "&:hover": { backgroundColor: "#e5e5e5" },
              "&:disabled": { backgroundColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)" }
            }}
          >
            {sendEmailLoading ? "Deploying..." : "Deploy Campaign"}
          </Button>
        </div>

        {/* Emails + Console Logs */}
        <div className="flex mt-2 mb-12 max-xl:flex-col justify-between gap-6 px-4 lg:px-0">
          <div className="w-[50%] max-xl:w-[100%] glass-panel p-0 overflow-hidden">
            <EmailTable emails={sentEmails} />
          </div>
          <div className="w-[50%] max-xl:w-[100%] glass-panel p-0 overflow-hidden">
            <ConsoleLogsBox
              consoleLogs={[
                ...sentEmails.map((email) => `[SUCCESS] Payload delivered to ${email}`),
                ...errorLogs.map((error) => `[ERROR] ${error}`),
              ]}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;