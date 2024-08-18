import { useEffect, useState } from "react";
import { TextField } from "@mui/material";

const CustomTextField = ({ label, value, onChange }) => {
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
  );
};

export default CustomTextField;
