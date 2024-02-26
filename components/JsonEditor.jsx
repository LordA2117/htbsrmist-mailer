import { useState } from "react";

const JSONEditor = ({ value, onParse }) => {
  const [textareaValue, setTextareaValue] = useState(value);

  const handleTextareaChange = (e) => {
    const newValue = e.target.value;
    setTextareaValue(newValue);
  };

  const handleParseClick = () => {
    onParse(textareaValue);
  };

  const handleResetClick = () => {
    setTextareaValue("");
    onParse(""); // Reset the parsed JSON content as well, if needed
  };

  return (
    <div>
      <textarea
        className="text-black"
        placeholder="Start typing here ...."
        value={textareaValue}
        onChange={handleTextareaChange}
        rows={10}
        cols={80}
      />
      <div>
        <button onClick={handleParseClick}>Parse</button>
        <button onClick={handleResetClick}>Reset</button>
      </div>
    </div>
  );
};

export default JSONEditor;
