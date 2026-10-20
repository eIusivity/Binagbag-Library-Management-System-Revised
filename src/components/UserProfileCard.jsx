import React from "react";
import { Box, Avatar, Chip, Typography } from "@mui/material";
import Person from "@mui/icons-material/Person";
function UserProfileCard({ user }) {
  return (
    <Box
      sx={{
        bgcolor: "white",
        p: 2,
        display: "flex",
        alignItems: "center",
        borderRadius: 2,
      }}
    >
      <Avatar
        sx={{
          width: 64,
          height: 64,
          mr: 2,
        }}
      >
        <Person />
      </Avatar>

      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" fontWeight="bold">
          {user.name}
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            my: 0.5,
          }}
        >
          <Chip label={user.user_type} size="small" color="primary" />

          <Chip
            sx={{
              bgcolor:
                user.status === "Active"
                  ? "green"
                  : user.status === "Canceled"
                    ? "orange"
                    : user.status === "Closed"
                      ? "orange"
                      : "black",
              color: "white",
            }}
            label={user.status}
            size="small"
          />
        </Box>

        <Typography variant="body2" color="text.secondary">
          {user.email}
        </Typography>
      </Box>
    </Box>
  );
}

export default UserProfileCard;
