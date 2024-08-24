"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  IconButton,
  Switch,
  MenuItem,
} from "@mui/material";
import CustomCodeBlock from "../../components/CustomCodeBlock";
import CodeIcon from "@mui/icons-material/Code";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Notification from "../../components/Notification";
import dotenv from "dotenv";
dotenv.config({ path: "./.env.local" });

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

const PastePage = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [paste, setPaste] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [notification, setNotification] = useState({
    visible: false,
    message: "",
    type: "",
  });
  const [originalPaste, setOriginalPaste] = useState(null);
  const [liveMode, setLiveMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("python");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/codeshare/pastes/${id}`,
        );
        setPaste(response.data);
        setOriginalPaste(response.data);
      } catch (error) {
        console.error("Error fetching paste:", error);
        router.push("/error");
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  useEffect(() => {
    let interval;
    if (liveMode) {
      interval = setInterval(async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/codeshare/pastes/${id}`,
          );
          setPaste(response.data);
        } catch (error) {
          console.error("Error fetching live updates:", error);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [liveMode, id]);

  const handleTitleChange = (event) => {
    setPaste({ ...paste, title: event.target.value });
  };

  const handleContentChange = (event) => {
    setPaste({ ...paste, content: event.target.value });
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const hasChanges = () => {
    return (
      paste.title !== originalPaste.title ||
      paste.content !== originalPaste.content
    );
  };

  const handleSave = async () => {
    if (!hasChanges()) {
      setNotification({
        message: "Did you make any changes?",
        type: "warning",
        visible: true,
      });
      return;
    }

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/codeshare/pastes/${id}`,
        paste,
      );
      setOriginalPaste(paste);
      setNotification({
        message: "Your code is safe with us!",
        type: "success",
        visible: true,
      });
    } catch (error) {
      console.error("Error saving paste:", error);
      setNotification({
        message: "Failed to save. Please try again.",
        type: "error",
        visible: true,
      });
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/codeshare/pastes/${id}`,
      );
      setPaste(null);
      router.push("/");
    } catch (error) {
      console.error("Error deleting paste:", error);
    }
  };

  const handleCopyId = () => {
    const fullUrl = `${window.location.origin}/${id}`;
    navigator.clipboard
      .writeText(fullUrl)
      .then(() => {
        console.log("URL copied to clipboard:", fullUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy URL:", err);
      });
  };

  const handleCopyContent = () => {
    navigator.clipboard
      .writeText(paste.content)
      .then(() => {
        setNotification({
          message: "Copied to clipboard!",
          type: "success",
          visible: true,
        });
      })
      .catch((err) => {
        console.error("Failed to copy content:", err);
      });
  };

  const handleToggleLiveMode = () => {
    setLiveMode((prevMode) => !prevMode);
  };

  if (!paste) {
    return null;
  }

  return (
    <div className="flex flex-col bg-zinc-800 h-screen text-slate-100">
      <header className="bg-indigo-500 text-white p-2 overflow-x-auto scrollbar-hide">
        <div className="flex items-center justify-between min-w-max">
          <div className="flex items-center">
            <div
              className="w-12 h-12 flex bg-zinc-800 items-center justify-center rounded-xl shadow-custom-dark cursor-pointer"
              onClick={() => router.push("/")}
            >
              <CodeIcon fontSize="large" />
            </div>
            <h1 className="text-2xl font-bold ml-4">CodeShare</h1>
          </div>
          <div className="flex items-center space-x-2 mr-2">
            <div
              className={`w-4 h-4 rounded-full ${
                liveMode
                  ? "bg-red-500 border border-gray-700 animate-blink"
                  : "bg-indigo-500"
              }`}
              style={{ marginRight: 8 }}
            ></div>
            <Switch
              checked={liveMode}
              onChange={handleToggleLiveMode}
              color="default"
              inputProps={{ "aria-label": "Live Mode Toggle" }}
            />
            <div
              className={`relative inline-block font-semibold cursor-copy rounded-lg ${
                isCopied ? "bg-indigo-600" : ""
              }`}
              onClick={handleCopyId}
              style={{
                transition: "background-color 0.3s ease, color 0.3s ease",
                userSelect: "none",
              }}
            >
              <div className="absolute inset-0 bg-black opacity-30 rounded-lg"></div>
              <h1 className="relative text-lg text-slate-100 px-2 py-1 rounded-lg">
                {id}
              </h1>
            </div>
          </div>
        </div>
      </header>
      <div className="flex flex-col flex-1">
        <Grid item xs={12} sm={12}>
          <div className="p-4 h-full flex flex-col relative">
            <div className="flex flex-grow items-center gap-4 mb-4">
              <TextField
                label="Title"
                value={paste.title}
                onChange={handleTitleChange}
                variant="outlined"
                style={{
                  flexGrow: 1,
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
              />
              <TextField
                select
                label="Language"
                value={selectedLanguage}
                onChange={handleLanguageChange}
                variant="outlined"
                style={{
                  width: "128px",
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
            <div className="relative flex-1">
              <CustomCodeBlock
                value={paste.content}
                onChange={handleContentChange}
                readOnly={liveMode}
                language={selectedLanguage}
              />
              <IconButton
                onClick={handleCopyContent}
                sx={{
                  position: "absolute",
                  bottom: 8,
                  right: 8,
                  color: "white",
                  backgroundColor: "#6366f1",
                  "&:hover": {
                    backgroundColor: "#4f46e5",
                  },
                }}
              >
                <ContentCopyIcon />
              </IconButton>
            </div>
            {!liveMode && (
              <div className="mt-4">
                <div className="space-x-4">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Grid>
      </div>
      {notification.visible && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() =>
            setNotification({ visible: false, message: "", type: "" })
          }
        />
      )}
    </div>
  );
};

export default PastePage;
