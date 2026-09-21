import { Box, Stack, Typography } from "@mui/material";
import { authClient } from "../../auth/authClient";
import { useEffect, useState } from "react";
import { data } from "react-router-dom";
function PendingUserDetails() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPendingUsers() {
      const { data, error } = await authClient.admin.listUsers({
        query: {
          filterField: "status",
          filterValue: "Pending",
          filterOperator: "eq",
        },
      });

      if (error) {
        setError(error);
        setLoading(false);
        return;
      }

      setUsers(data.users);
      setLoading(false);
    }

    fetchPendingUsers();
  }, []);

  const userInformationRows = [
    { label: "Full Name" },
    { label: "Email" },
    { label: "Phone Number" },
    { label: "User Type" },
    { label: "Registration Date" },
  ];
  return (
    <Box
      sx={{ flex: 1, display: "flex", flexDirection: "column", p: 2, gap: 2 }}
    >
      <Stack>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Pending User Details
        </Typography>
        <Typography>
          Review the pending user's information and approve or reject the
          registration.
        </Typography>
      </Stack>
      <Stack direction="row" spacing={2} sx={{ flex: 1 }}>
        <Box
          sx={{
            flex: 1,
            outline: 1,
            display: "flex",
            flexDirection: "column",
            p: 2,
          }}
        >
          <Typography variant="h6" sx={{ flex: 1, fontWeight: "bold" }}>
            User Information
          </Typography>
          <Stack sx={{ Flex: 1 }}>
            <Stack direction="row"></Stack>
          </Stack>
        </Box>
        <Box sx={{ flex: 1, outline: 1 }}></Box>
      </Stack>
      <Stack direction="row" sx={{ outline: 1 }}></Stack>
    </Box>
  );
}

export default PendingUserDetails;
