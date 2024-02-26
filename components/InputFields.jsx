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
  const containerStyles2 = {
    padding: "1rem",
    borderRadius: "24px 24px 16px 16px",
    background:
      "linear-gradient(268.56deg, rgba(150, 150, 150, 0.1), rgba(150, 150, 150, 0.1))",

    boxShadow:
      "1.2396273612976074px 1.2396273612976074px 13.64px rgba(0, 0, 0, 0.25) inset",
    border: "0.6px solid #545151",
    transition: "transform 0.3s, background 0.3s",
    width: "300px",
    // borderColor: "white",
    // transform: isHovered ? "scale(1.02)" : "scale(1)",
  };
  const mails = [
    {
      value: "community@htbsrmist.tech",
      label: "community@htbsrmist.tech",
    },
    {
      value: "technical@htbsrmist.tech",
      label: "technical@htbsrmist.tech",
    },
    {
      value: "corporate@htbsrmist.tech",
      label: "corporate@htbsrmist.tech",
    },
    {
      value: "creatives@htbsrmist.tech",
      label: "creatives@htbsrmist.tech",
    },
  ];
  return (
    <div style={containerStyles} className="w-[50%] mx-auto">
      <h1 className="text-center text-3xl">Mail Config</h1>
      <div className=" flex justify-evenly">
        <div>
          <div>
            <TextField
              id="outlined-basic"
              label="Subject"
              variant="outlined"
              color="success"
              InputLabelProps={{ style: { color: "white" } }}
              InputProps={{ style: { color: "white" } }}
              // style={{ borderColor: "neonGreen" }}
              style={containerStyles2}
              // focused
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div>
            <TextField
              id="outlined-basic"
              label="Display Text"
              variant="outlined"
              color="success"
              InputLabelProps={{ style: { color: "white" } }}
              InputProps={{ style: { color: "white" } }}
              // style={{ width: "100%", borderColor: "white" }}
              style={containerStyles2}
              // focused
              value={displayText}
              onChange={(e) => setDisplayText(e.target.value)}
            />
          </div>
        </div>
        <div>
          <div>
            <TextField
              select
              label="From"
              defaultValue="EUR"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              InputLabelProps={{ style: { color: "white" } }}
              InputProps={{ style: { color: "white", borderColor: "#ffffff" } }}
              variant="filled"
              color="success"
              // focused
              // style={{ width: "300px" }}
              style={containerStyles2}
            >
              {mails.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  style={{ color: "black" }}
                >
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div>
            <TextField
              select
              label="Reply To"
              defaultValue="EUR"
              InputLabelProps={{ style: { color: "white" } }}
              InputProps={{ style: { color: "white", borderColor: "#ffffff" } }}
              variant="filled"
              value={replyTo}
              color="success"
              onChange={(e) => setReplyTo(e.target.value)}
              style={containerStyles2}
            >
              {mails.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  style={{ color: "black" }}
                >
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputFields;
