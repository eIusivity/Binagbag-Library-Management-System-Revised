import { Box, Stack, Typography, Button } from "@mui/material";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EastOutlinedIcon from "@mui/icons-material/EastOutlined";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import GppBadOutlinedIcon from "@mui/icons-material/GppBadOutlined";
import { NavLink } from "react-router-dom";
import { authClient } from "../../../auth/authClient";
import { useEffect, useState } from "react";
import { getUserCount } from "../../../api/usersApi";
function Users() {
  const [userCount, setUserCount] = useState([]);
  useEffect(() => {
    async function loadCount() {
      const count = await getUserCount();
      setUserCount(count);
      console.log(count);
    }
    loadCount();
  }, []);
  const headerUserCounts = [
    {
      label: "Total Users",
      value: userCount.reduce((total, user) => total + Number(user.count), 0),
      icon: <PeopleIcon />,
      bgcolor: "#FFFFFF",
      color: "#1B2A4A",
      lightColor: "#F3F5F8",
      borderColor: "#F97316",
    },
    {
      label: "Students",
      value: userCount.find((type) => type.user_type === "Student")?.count ?? 0,
      icon: <SchoolIcon />,
      bgcolor: "#2563EB",
      color: "#FFFFFF",
      lightColor: "transparent",
      borderColor: "#2563EB",
    },
    {
      label: "Faculty",
      value: userCount.find((type) => type.user_type === "Faculty")?.count ?? 0,
      icon: <PeopleIcon />,
      bgcolor: "#F97316",
      color: "#FFFFFF",
      lightColor: "transparent",
      borderColor: "#F97316",
    },
    {
      label: "Non-Faculty",
      value:
        userCount.find((type) => type.user_type === "Non-Faculty")?.count ?? 0,
      icon: <PeopleIcon />,
      bgcolor: "#15803D",
      color: "#FFFFFF",
      lightColor: "transparent",
      borderColor: "#15803D",
    },
  ];
  const controlButtons = [
    {
      label: "View & Search Users",
      icon: <PeopleOutlinedIcon sx={{ fontSize: 44 }} />,
      sublabel: "Browse and search all registered library users.",
      to: "/users/search",
    },
    {
      label: "Pending Registrations",
      icon: <PendingActionsIcon sx={{ fontSize: 44 }} />,
      sublabel: "Review and manage pending user registrations.",
      to: "/users/pending",
    },
  ];
  return (
    <Box sx={{ p: 2 }}>
      <Stack>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          User Management
        </Typography>
        <Typography sx={{ opacity: 0.5 }}>
          Manage library users, registrations, roles, and account settings.
        </Typography>
      </Stack>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        {headerUserCounts.map((header, index) => (
          <Stack
            key={header.label}
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{
              flex: 1,
              minWidth: 0,
              p: 2.5,
              bgcolor: header.bgcolor,
              color: header.color,
              border: `1px solid ${index === 0 ? "#E2E5EA" : header.bgcolor}`,
              borderTop: `4px solid ${index === 0 ? "#F97316" : header.bgcolor}`,
              borderRadius: 2,
            }}
          >
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{
                width: 56,
                height: 56,
                flexShrink: 0,
                bgcolor: index === 0 ? "#F3F5F8" : "transparent",
                borderRadius: 2,
                "& .MuiSvgIcon-root": { fontSize: 30 },
              }}
            >
              {header.icon}
            </Stack>

            <Stack>
              <Typography
                variant="body2"
                sx={{ color: index === 0 ? "#667085" : "inherit" }}
              >
                {header.label}
              </Typography>

              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {header.value}
              </Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>
      <Typography variant="h5" sx={{ fontWeight: "bold", pt: 4 }}>
        Your Controls
      </Typography>
      <Stack direction="row" spacing={2}>
        {controlButtons.map((button, i) => {
          return (
            <Button
              key={i}
              component={NavLink}
              to={button.to}
              sx={{
                flex: 1,
                p: 2,
                gap: 2,
                bgcolor: "#ffffff",
                borderRadius: 4,
                border: 1,
                borderColor: "rgba(0,0,0,0.18)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Stack>
                {button.icon}
                <Stack>
                  <Typography align="left">{button.label}</Typography>
                  <Typography align="left">{button.sublabel}</Typography>
                </Stack>
              </Stack>
              <EastOutlinedIcon />
            </Button>
          );
        })}
      </Stack>
    </Box>
  );
}

export default Users;
