// components/InputFields.js
import React from "react";
import TextField from "@material-ui/core/TextField";

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
  return (
    <div className="p-4 bg-gray-100 rounded-md">
      <div className="mb-4">
        <TextField
          label="Subject"
          variant="outlined"
          fullWidth
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <TextField
          label="Display Text"
          variant="outlined"
          fullWidth
          value={displayText}
          onChange={(e) => setDisplayText(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <TextField
          label="From"
          variant="outlined"
          fullWidth
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
      </div>
      <div>
        <TextField
          label="Reply To"
          variant="outlined"
          fullWidth
          value={replyTo}
          onChange={(e) => setReplyTo(e.target.value)}
        />
      </div>
    </div>
  );
};

export default InputFields;
