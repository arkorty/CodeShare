"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import TextField from "@mui/material/TextField";
import CustomTextField from "../components/CustomTextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import CodeIcon from "@mui/icons-material/Code";
import dotenv from "dotenv";

dotenv.config();

const Home = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pastes, setPastes] = useState([]);
  const [currentPaste] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchPastes();
  }, []);

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
        { title, content },
      );
      const newPasteId = response.data.id;
      fetchPastes();
      setTitle("");
      setContent("");
      router.push(`/${newPasteId}`);
    } catch (error) {
      console.error("Error creating paste:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-indigo-500 text-white p-2 flex items-center justify-between">
        <div className="flex items-center">
          <div
            className="w-12 h-12 flex bg-gray-800 items-center justify-center rounded-xl shadow-custom-dark cursor-pointer"
            onClick={() => router.push("/")}
          >
            <CodeIcon fontSize="large" />
          </div>
          <h1 className="text-2xl font-bold ml-4">CodeShare</h1>
        </div>
      </header>
      <div className="flex flex-1 bg-zinc-800">
        <div className="flex flex-col flex-1">
          <Grid item xs={12} sm={12}>
            <div className="p-4">
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
              <CustomTextField
                label="Content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
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
