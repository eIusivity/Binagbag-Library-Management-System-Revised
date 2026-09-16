// layouts/PublicLayout.jsx

import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

function PublicLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
        bgcolor: "white",
      }}
    >
      <Outlet />
    </Box>
  );
}

export default PublicLayout;
