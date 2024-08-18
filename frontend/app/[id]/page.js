"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { TextField, Button, Grid } from "@mui/material";
import CustomTextField from "../../components/CustomTextField";
import CodeIcon from "@mui/icons-material/Code";
import Notification from "../../components/Notification";
import dotenv from "dotenv";
dotenv.config({ path: "./.env.local" });

const PastePage = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [paste, setPaste] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [notification, setNotification] = useState({
    visible: false,
    message: "",
    type: "", // Add type here
  });
  const [originalPaste, setOriginalPaste] = useState(null);

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

  const handleTitleChange = (event) => {
    setPaste({ ...paste, title: event.target.value });
  };

  const handleContentChange = (event) => {
    setPaste({ ...paste, content: event.target.value });
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
        type: "warning", // Set type here
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
        message: "Saved successful!",
        type: "success", // Set type here
        visible: true,
      });
    } catch (error) {
      console.error("Error saving paste:", error);
      setNotification({
        message: "Failed to save. Please try again.",
        type: "error", // Set type here
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

  if (!paste) {
    return null;
  }

  return (
    <div className="flex flex-col bg-zinc-800 h-screen text-slate-100">
      <header className="bg-indigo-500 text-white p-2 flex items-center justify-between">
        <div className="flex items-center">
          <div
            className="w-12 h-12 flex bg-zinc-800 items-center justify-center rounded-lg shadow-custom-dark cursor-pointer"
            onClick={() => router.push("/")}
          >
            <CodeIcon fontSize="large" />
          </div>
          <div
            className={`relative inline-block font-semibold ml-4 ml-4 cursor-pointer rounded-lg ${isCopied ? "bg-indigo-600" : ""}`}
            onClick={handleCopyId}
            style={{
              transition: "background-color 0.3s ease, color 0.3s ease",
            }}
          >
            <div className="absolute inset-0 bg-black opacity-30 rounded-lg"></div>
            <h1 className="relative text-lg text-slate-100 px-2 py-1 rounded-lg">
              {id}
            </h1>
          </div>
        </div>
      </header>
      <div className="flex flex-col flex-1">
        <Grid item xs={12} sm={12}>
          <div className="p-4 h-full flex flex-col">
            <TextField
              label="Title"
              value={paste.title}
              onChange={handleTitleChange}
              variant="outlined"
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
            />
            <CustomTextField
              label="Content"
              value={paste.content}
              onChange={handleContentChange}
            />
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
          </div>
        </Grid>
      </div>
      {notification.visible && (
        <Notification
          message={notification.message}
          type={notification.type} // Pass type here
          onClose={() =>
            setNotification({ visible: false, message: "", type: "" })
          }
        />
      )}
    </div>
  );
};

export default PastePage;
