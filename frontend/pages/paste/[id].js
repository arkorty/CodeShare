import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, TextField, Container, Button } from '@mui/material';
import Grid from "@mui/material/Grid";
import dotenv from 'dotenv';

dotenv.config({path: './.env'});

const PastePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [paste, setPaste] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pastes/${id}`);
        setPaste(response.data);
      } catch (error) {
        console.error('Error fetching paste:', error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleContentChange = (event) => {
    // Update the content state when the text field changes
    setPaste({ ...paste, content: event.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pastes/${id}`, paste);
      router.push('/');
    } catch (error) {
      console.error('Error saving paste:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pastes/${id}`);
      setPaste(null); // Resetting the local state after deletion
      router.push('/');
    } catch (error) {
      console.error('Error deleting paste:', error);
    }
  };

  if (!paste) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col bg-white h-screen">
      <header className="bg-gray-600 text-white p-2 flex items-center justify-between">
        <h1 className="text-lg">{paste.title}</h1>
      </header>
      <Grid item xs={12} sm={12}>
        <div className="p-4">
          <TextField
            label="Content"
            multiline
            fullWidth
            fullHeight
            value={paste.content}
            onChange={handleContentChange}
          />
          <div className="mt-4">
            <div className="space-x-4">
              <Button variant="contained" color="primary" onClick={handleSave}>
                Save
              </Button>
              <Button variant="contained" color="error" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      </Grid>
    </div>
  );
};

export default PastePage;
