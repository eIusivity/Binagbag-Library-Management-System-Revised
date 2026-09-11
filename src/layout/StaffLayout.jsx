// layouts/StaffLayout.jsx

import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

function StaffLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        flexDirection: "column",
        bgcolor: "#ececee",
      }}
    >
      <Header />

      <Box sx={{ flex: 1, display: "flex" }}>
        <Sidebar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default StaffLayout;
