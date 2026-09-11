// layouts/PublicLayout.jsx

import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

function PublicLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        px: { xs: 2, md: 8 },
      }}
    >
      <Outlet />
    </Box>
  );
}

export default PublicLayout;
