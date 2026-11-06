// layouts/StaffLayout.jsx

import { Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import StateDialog from "../components/StateDialog";
import DevicesIcon from "@mui/icons-material/Devices";

function StaffLayout() {
  const theme = useTheme();
  const isSmallerThanLaptop = useMediaQuery(theme.breakpoints.down("lg"));

  if (isSmallerThanLaptop) {
    return (
      <Box sx={{ display: "flex", minHeight: "100vh", p: 2 }}>
        <StateDialog
          icon={<DevicesIcon sx={{ fontSize: 52 }} />}
          title="Librarian/Administrator controls unavailable in mobile"
          description="Please use a laptop or larger screen to access staff controls."
        />
      </Box>
    );
  }

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
