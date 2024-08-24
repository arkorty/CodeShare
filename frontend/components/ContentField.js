import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { TextField } from "@mui/material";
import SimpleContentField from "./SimpleContentField";
import debounce from "lodash.debounce";

const ContentField = ({ value, onChange, readOnly, language }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [height, setHeight] = useState("auto");

  const options = {
    readOnly: readOnly,
    minimap: { enabled: false },
    fontSize: 14,
    wordWrap: "on",
    lineNumbers: "on",
    contextmenu: false,
    scrollBeyondLastLine: false,
    folding: false,
    highlightActiveIndentGuide: false,
    renderLineHighlight: "none",
    renderWhitespace: "none",
    overviewRulerBorder: false,
    overviewRulerLanes: 0,
    renderIndentGuides: true,
    automaticLayout: true,
    cursorStyle: "line",
    links: false,
    occurrencesHighlight: false,
    selectionHighlight: false,
    suggestOnTriggerCharacters: false,
    acceptSuggestionOnEnter: "off",
    tabCompletion: "off",
    wordBasedSuggestions: false,
    quickSuggestions: false,
    lightbulb: { enabled: false },
    forceLargeFileMode: true,
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      const calculateHeight = () => {
        const screenHeight = window.innerHeight;
        const calculatedHeight = screenHeight - 256;
        setHeight(`${calculatedHeight}px`);
      };

      const debouncedCalculateHeight = debounce(calculateHeight, 200);

      calculateHeight();
      window.addEventListener("resize", debouncedCalculateHeight);
      return () =>
        window.removeEventListener("resize", debouncedCalculateHeight);
    }
  }, [isMobile]);

  const handleEditorChange = (newValue) => {
    if (onChange) {
      onChange({ target: { value: newValue } });
    }
  };

  if (isMobile && !readOnly) {
    return (
      <SimpleContentField
        label="Code"
        value={value}
        onChange={(e) => handleEditorChange(e.target.value)}
      />
    );
  }

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
        options={options}
      />
    </div>
  );
};

export default ContentField;
