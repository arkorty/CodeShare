import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import CodeIcon from "@mui/icons-material/Code"; // Import the Code icon
import dotenv from "dotenv";

dotenv.config();

// FullHeightTextField component
const FullHeightTextField = ({ label, value, onChange }) => {
  const [rows, setRows] = useState(1);

  useEffect(() => {
    // Calculate rows based on the height of the screen and average line height
    const calculateRows = () => {
      const lineHeight = 24; // Adjust this value based on your TextField's line height
      const screenHeight = window.innerHeight;
      const rowsCount = Math.floor(screenHeight / lineHeight) - 16;
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
  const [setPastes] = useState([]);
  const [currentPaste] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchPastes();
  }, []); // Added dependency array to run only once

  const fetchPastes = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/pastes`,
      );
      setPastes(response.data);
    } catch (error) {
      console.error("Error fetching pastes:", error);
    }
  };

  const createPaste = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/pastes`,
        { title, content },
      );
      const newPasteId = response.data.id; // Assuming the response contains the ID of the newly created paste
      fetchPastes();
      setTitle("");
      setContent("");
      router.push(`/${newPasteId}`); // Redirect to the newly created paste page
    } catch (error) {
      console.error("Error creating paste:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-gray-600 text-white p-2 flex items-center justify-between">
        <div className="flex items-center">
          <CodeIcon fontSize="large" className="mr-2" />{" "}
          {/* Add the icon here */}
          <h1 className="text-lg">CodeShare</h1>
        </div>
      </header>
      {/* Main Content */}
      <div className="flex flex-1 bg-white">
        {/* Text Box Contents */}
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
