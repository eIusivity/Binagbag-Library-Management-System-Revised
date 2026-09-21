import { TextField, InputAdornment } from "@mui/material";
import { useEffect, useRef } from "react";
function CustomTextField({ sx, debounce, onChange, ...props }) {
  const timeout = useRef(null);
  const handleChange = (e) => {
    if (!debounce) {
      onChange?.(e);
      return;
    }
    clearTimeout(timeout.current);
    const value = e.target.value;
    timeout.current = setTimeout(() => {
      onChange?.({
        target: { value },
      });
    }, 500);
  };
  return (
    <TextField
      {...props}
      onChange={handleChange}
      sx={{
        bgcolor: "#FFFFFF",
        borderRadius: 4,
        "& .MuiOutlinedInput-root": {
          borderRadius: 4,
          height: "100%",
        },

        ...sx,
      }}
    />
  );
}

export default CustomTextField;
