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
        width: "100%",
        height: "100vh",
        flexDirection: "column",
        bgcolor: "#ececee",
      }}
    >
      <Header />

      <Box sx={{ flex: 1, display: "flex", minHeight: 0 }}>
        <Sidebar />

        <Box sx={{ flex: 1, minWidth: 0, overflow: "auto" }}>
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              ml: "64px",
              overflow: "auto",
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default StaffLayout;
