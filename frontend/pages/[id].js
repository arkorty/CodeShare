import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { TextField, Button, Grid } from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const FullHeightTextField = ({ label, value, onChange }) => {
  const [rows, setRows] = useState(1);

  useEffect(() => {
    // Calculate rows based on the height of the screen and average line height
    const calculateRows = () => {
      const lineHeight = 24; // Adjust this value based on your TextField's line height
      const screenHeight = window.innerHeight;
      const rowsCount = Math.floor(screenHeight / lineHeight) - 6;
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
  const { id } = router.query;
  const [paste, setPaste] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/pastes/${id}`,
        );
        setPaste(response.data);
      } catch (error) {
        console.error("Error fetching paste:", error);
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/pastes/${id}`,
        paste,
      );
      router.push("/");
    } catch (error) {
      console.error("Error saving paste:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pastes/${id}`);
      setPaste(null);
      router.push("/");
    } catch (error) {
      console.error("Error deleting paste:", error);
    }
  };

  if (!paste) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col bg-white h-screen">
      <header className="bg-gray-600 text-white p-2 flex items-center justify-between">
        <div className="flex items-center">
          <CodeIcon fontSize="large" className="mr-2" />
          <h1 className="text-lg">{paste.title}</h1>
        </div>
      </header>
      <Grid container direction="column" style={{ flexGrow: 1 }}>
        <Grid item xs={12} sm={12} style={{ flex: 1 }}>
          <div className="p-4 h-full flex flex-col">
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
      </Grid>
    </div>
  );
};

export default PastePage;
