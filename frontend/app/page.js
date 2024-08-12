"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import CodeIcon from "@mui/icons-material/Code";
import dotenv from "dotenv";

dotenv.config();

const FullHeightTextField = ({ label, value, onChange }) => {
  const [rows, setRows] = useState(1);

  useEffect(() => {
    const calculateRows = () => {
      const lineHeight = 24;
      const screenHeight = window.innerHeight;
      const rowsCount = Math.floor(screenHeight / lineHeight) - 10;
      setRows(rowsCount);
    };

    calculateRows();
    window.addEventListener("resize", calculateRows);

    return () => window.removeEventListener("resize", calculateRows);
  }, []);

  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      multiline
      rows={rows}
      fullWidth
      className="mb-4"
    />
  );
};

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
      <header className="bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 text-white p-2 flex items-center justify-between">
        <div className="flex items-center">
          <div
            className="w-12 h-12 flex items-center justify-center rounded-xl shadow-custom-dark cursor-pointer"
            onClick={() => router.push("/")}
          >
            <CodeIcon fontSize="large" />
          </div>
          <h1 className="text-lg ml-2">CodeShare</h1>
        </div>
      </header>
      <div className="flex flex-1 bg-white">
        <div className="flex flex-col flex-1">
          <Grid item xs={12} sm={12}>
            <div className="p-4">
              <TextField
                label="Title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                fullWidth
                className="mb-4"
              />
              <FullHeightTextField
                label="Content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
              />
              <Button variant="contained" color="primary" onClick={createPaste}>
                Create Paste
              </Button>
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
