import { Box, Stack, Typography, Button } from "@mui/material";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EastOutlinedIcon from "@mui/icons-material/EastOutlined";
import { NavLink } from "react-router-dom";
function Users() {
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
    {
      label: "Edit User Information",
      icon: <EditOutlinedIcon sx={{ fontSize: 44 }} />,
      sublabel:
        "Update user details such as name, email, and other information.",
      to: "/users/edit",
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
