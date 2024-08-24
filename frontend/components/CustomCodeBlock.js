import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

const CustomCodeBlock = ({ value, onChange, readOnly, language }) => {
  const [height, setHeight] = useState("auto");

  useEffect(() => {
    const calculateHeight = () => {
      const screenHeight = window.innerHeight;
      const calculatedHeight = screenHeight - 256;
      setHeight(`${calculatedHeight}px`);
    };

    calculateHeight();
    window.addEventListener("resize", calculateHeight);
    return () => window.removeEventListener("resize", calculateHeight);
  }, []);

  const handleEditorChange = (newValue) => {
    if (onChange) {
      onChange({ target: { value: newValue } });
    }
  };

  return (
    <div
      className="w-full overflow-auto rounded-md"
      style={{
        height: height,
        border: "1px solid #4b5563",
      }}
    >
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          readOnly: readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: "on",
        }}
      />
    </div>
  );
};

export default CustomCodeBlock;
