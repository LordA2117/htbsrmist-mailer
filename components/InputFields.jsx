// components/InputFields.js
import React from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

const InputFields = ({
  subject,
  displayText,
  from,
  replyTo,
  setSubject,
  setDisplayText,
  setFrom,
  setReplyTo,
}) => {
  const containerStyles2 = {
    width: "100%",
    maxWidth: "400px",
  };
  const mails = [
    {
      value: "HackTheBox CHENNAI <community@htbchennai.in>",
      label: "community@htbchennai.in",
    },
    {
      value: "HackTheBox CHENNAI <technical@htbchennai.in>",
      label: "technical@htbchennai.in",
    },
    {
      value: "HackTheBox CHENNAI <corporate@htbchennai.in>",
      label: "corporate@htbchennai.in",
    },
    {
      value: "HackTheBox CHENNAI <creatives@htbchennai.in>",
      label: "creatives@htbchennai.in",
    },
    {
      value: "HackTheBox CHENNAI <security@htbchennai.in>",
      label: "security@htbchennai.in",
    },
  ];
  return (
    <div className="w-full lg:w-[80%] mx-auto glass-panel p-8">
      <h1 className="text-center text-3xl font-bold tracking-tight mb-8 border-b border-white/5 pb-4">Campaign Configuration</h1>
      <div className="flex flex-col md:flex-row justify-center gap-8 lg:gap-16">
        <div className="flex flex-col w-full md:w-1/2 gap-6">
          <TextField
            fullWidth
            label="Subject"
            variant="outlined"
            InputLabelProps={{ style: { color: "#888" } }}
            sx={{
              input: { color: '#fff' },
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#0a0a0a',
                borderRadius: '8px',
                '& fieldset': { borderColor: '#333' },
                '&:hover fieldset': { borderColor: '#555' },
                '&.Mui-focused fieldset': { borderColor: '#fff', borderWidth: '1px' },
              },
            }}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <TextField
            fullWidth
            label="Sender Map (Display Text)"
            variant="outlined"
            InputLabelProps={{ style: { color: "#888" } }}
            sx={{
              input: { color: '#fff' },
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#0a0a0a',
                borderRadius: '8px',
                '& fieldset': { borderColor: '#333' },
                '&:hover fieldset': { borderColor: '#555' },
                '&.Mui-focused fieldset': { borderColor: '#fff', borderWidth: '1px' },
              },
            }}
            value={displayText}
            onChange={(e) => setDisplayText(e.target.value)}
          />
        </div>

        <div className="flex flex-col w-full md:w-1/2 gap-6">
          <TextField
            select
            fullWidth
            label="From (Verified Identities)"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            InputLabelProps={{ style: { color: "#888" } }}
            variant="outlined"
            sx={{
              '& .MuiSelect-select': { color: '#fff' },
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#0a0a0a',
                borderRadius: '8px',
                '& fieldset': { borderColor: '#333' },
                '&:hover fieldset': { borderColor: '#555' },
                '&.Mui-focused fieldset': { borderColor: '#fff', borderWidth: '1px' },
              },
              '& .MuiSvgIcon-root': { color: '#888' }
            }}
          >
            {mails.map((option) => (
              <MenuItem key={option.value} value={option.value} style={{ color: "black" }}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="Reply To"
            value={replyTo}
            onChange={(e) => setReplyTo(e.target.value)}
            InputLabelProps={{ style: { color: "#888" } }}
            variant="outlined"
            sx={{
              '& .MuiSelect-select': { color: '#fff' },
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#0a0a0a',
                borderRadius: '8px',
                '& fieldset': { borderColor: '#333' },
                '&:hover fieldset': { borderColor: '#555' },
                '&.Mui-focused fieldset': { borderColor: '#fff', borderWidth: '1px' },
              },
              '& .MuiSvgIcon-root': { color: '#888' }
            }}
          >
            {mails.map((option) => (
              <MenuItem key={option.value} value={option.value} style={{ color: "black" }}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </div>
      </div>
    </div>
  );
};

export default InputFields;
