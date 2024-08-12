"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { TextField, Button, Grid, IconButton } from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import CopyIcon from "@mui/icons-material/FileCopy";
import dotenv from "dotenv";
dotenv.config({ path: "./.env.local" });

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
      rows={rows}
      multiline
      fullWidth
      variant="outlined"
      style={{ flexGrow: 1 }}
    />
  );
};

const PastePage = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [paste, setPaste] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/codeshare/pastes/${id}`,
        );
        setPaste(response.data);
      } catch (error) {
        console.error("Error fetching paste:", error);
        router.push("/404");
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleContentChange = (event) => {
    setPaste({ ...paste, content: event.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/codeshare/pastes/${id}`,
        paste,
      );
    } catch (error) {
      console.error("Error saving paste:", error);
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
    navigator.clipboard
      .writeText(id)
      .then(() => {
        console.log("ID copied to clipboard");
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy ID:", err);
      });
  };

  if (!paste) {
    return null;
  }

  return (
    <div className="flex flex-col bg-white h-screen">
      <header className="bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 text-white p-2 flex items-center justify-between">
        <div className="flex items-center">
          <div
            className="w-12 h-12 flex items-center justify-center rounded-xl shadow-custom-dark cursor-pointer"
            onClick={() => router.push("/")}
          >
            <CodeIcon fontSize="large" />
          </div>
          <h1 className="text-lg ml-2">{id}</h1>
          <IconButton
            onClick={handleCopyId}
            size="small"
            style={{
              color: isCopied ? "#bbbbbb" : "#ffffff",
              padding: 8,
              transition: "background-color 0.3s ease, color 0.3s ease",
            }}
          >
            <CopyIcon fontSize="small" />
          </IconButton>
        </div>
      </header>
      <div className="flex flex-col flex-1">
        <Grid item xs={12} sm={12}>
          <div className="p-4 h-full flex flex-col">
            <TextField
              label="Title"
              value={paste.title}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              style={{ marginBottom: 16 }}
            />
            <FullHeightTextField
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
    </div>
  );
};

export default PastePage;
