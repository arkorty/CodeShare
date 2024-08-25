import React, { useState, useEffect, useRef, useMemo } from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-rust";
import "ace-builds/src-noconflict/mode-golang";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-sql";
import "ace-builds/src-noconflict/mode-sh";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-typescript";

import "ace-builds/src-noconflict/theme-monokai";

import debounce from "lodash.debounce";

const ContentField = ({ value, onChange, readOnly, language }) => {
  const [height, setHeight] = useState("auto");
  const editorRef = useRef(null);

  const calculateHeight = useMemo(
    () =>
      debounce(() => {
        const screenHeight = window.innerHeight;
        setHeight(`${screenHeight - 220}px`);
      }, 200),
    [],
  );

  useEffect(() => {
    calculateHeight();
    window.addEventListener("resize", calculateHeight);
    return () => window.removeEventListener("resize", calculateHeight);
  }, [calculateHeight]);

  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current.editor;
      editor.getSession().setUseWrapMode(true);
    }
  }, []);

  const handleChange = (newValue) => {
    if (onChange) {
      onChange({ target: { value: newValue } });
    }
  };

  return (
    <AceEditor
      ref={editorRef}
      mode={language}
      theme="monokai"
      onChange={handleChange}
      value={value}
      name="UNIQUE_ID_OF_DIV"
      editorProps={{ $blockScrolling: true }}
      setOptions={{
        useWorker: false,
        showPrintMargin: false,
        readOnly: readOnly,
      }}
      style={{
        width: "100%",
        height: height,
        border: "1px solid #4b5563",
      }}
      fontSize={14}
    />
  );
};

export default ContentField;
