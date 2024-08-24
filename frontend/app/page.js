"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import TextField from "@mui/material/TextField";
import ContentField from "../components/ContentField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import CodeIcon from "@mui/icons-material/Code";
import dotenv from "dotenv";

dotenv.config();

const languageOptions = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "typescript", label: "TypeScript" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "scala", label: "Scala" },
  { value: "haskell", label: "Haskell" },
  { value: "perl", label: "Perl" },
  { value: "lua", label: "Lua" },
  { value: "r", label: "R" },
  { value: "shell", label: "Shell" },
  { value: "matlab", label: "MATLAB" },
];

const Home = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pastes, setPastes] = useState([]);
  const [currentPaste] = useState(null);
  const [pasteId, setSearchCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const router = useRouter();

  useEffect(() => {
    fetchPastes();
  }, []);

  useEffect(() => {
    if (pasteId.length === 6) {
      router.push(`/${pasteId}`);
      setSearchCode("");
    }
  }, [pasteId, router]);

  const fetchPastes = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/codeshare/pastes`,
      );
      setPastes(response.data);
    } catch (error) {
      console.error("Error fetching pastes:", error);
    }
  };

  const createPaste = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/codeshare/pastes`,
        { title, content, language: selectedLanguage },
      );
      const newPasteId = response.data.id;
      fetchPastes();
      setTitle("");
      setContent("");
      setSelectedLanguage("javascript");
      router.push(`/${newPasteId}`);
    } catch (error) {
      console.error("Error creating paste:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-indigo-500 text-white p-2 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-12 h-12 flex bg-gray-800 items-center justify-center rounded-xl shadow-custom-dark cursor-pointer">
            <CodeIcon fontSize="large" />
          </div>
          <h1 className="text-2xl font-bold ml-4">CodeShare</h1>
        </div>
        <div className="relative">
          <h1 className="relative text-lg text-slate-100 px-2 py-1 rounded-lg">
            <input
              type="text"
              value={pasteId}
              onChange={(event) => setSearchCode(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && pasteId.length === 6) {
                  router.push(`/${pasteId}`);
                  setSearchCode("");
                }
              }}
              style={{
                backgroundColor: "transparent",
                color: "#f1f5f9",
                fontSize: "1.125rem",
                fontWeight: "600",
                border: "none",
                borderRadius: "0.5rem",
                borderBottom: "none",
                width: "calc(6ch + 25px)",
                outline: "none",
                padding: "0.25rem 0.5rem",
                boxSizing: "border-box",
                position: "relative",
                background: "rgba(0, 0, 0, 0.3)",
              }}
            />
          </h1>
        </div>
      </header>
      <div className="flex flex-1 bg-zinc-800">
        <div className="flex flex-col flex-1">
          <Grid item xs={12} sm={12}>
            <div className="p-4 h-full flex flex-col relative">
              <div className="flex flex-grow items-center gap-4">
                <TextField
                  label="Title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  fullWidth
                  style={{
                    marginBottom: 16,
                    backgroundColor: "#1e293b",
                    color: "#e2e8f0",
                  }}
                  InputProps={{
                    style: {
                      backgroundColor: "#27272a",
                      color: "#e2e8f0",
                    },
                  }}
                  InputLabelProps={{
                    style: {
                      color: "#e2e8f0",
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#4b5563",
                      },
                      "&:hover fieldset": {
                        borderColor: "#6366f1",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#6366f1",
                      },
                    },
                  }}
                  className="mb-4"
                />
                <TextField
                  select
                  label="Language"
                  value={selectedLanguage}
                  onChange={(event) => setSelectedLanguage(event.target.value)}
                  variant="outlined"
                  style={{
                    width: "144px",
                    marginBottom: 16,
                    backgroundColor: "#1e293b",
                    color: "#e2e8f0",
                  }}
                  InputProps={{
                    style: {
                      backgroundColor: "#27272a",
                      color: "#e2e8f0",
                    },
                  }}
                  InputLabelProps={{
                    style: {
                      color: "#e2e8f0",
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#4b5563",
                      },
                      "&:hover fieldset": {
                        borderColor: "#6366f1",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#6366f1",
                      },
                    },
                  }}
                >
                  {languageOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <ContentField
                label="Content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                language={selectedLanguage}
              />
              <div className="mt-4">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={createPaste}
                >
                  Create Paste
                </Button>
              </div>
              {currentPaste && (
                <div
                  paste={currentPaste}
                  onEdit={editPaste}
                  onDelete={deletePaste}
                />
              )}
            </div>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default Home;
