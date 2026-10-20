import React from "react";
import { NavLink } from "react-router-dom";
import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Divider,
  InputAdornment,
  Link,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import StateDialog from "../../../components/StateDialog";
import { useState, useEffect } from "react";
import {
  SearchRounded as SearchIcon,
  PersonOutlineRounded as PersonIcon,
  MenuBookRounded as BookIcon,
  EventAvailableRounded as ReservationIcon,
  WarningAmberRounded as WarningIcon,
  InfoOutlined as InfoIcon,
  BlockRounded as DeactivateIcon,
  ChevronRightRounded as ChevronRightIcon,
} from "@mui/icons-material";
import { authClient } from "../../../auth/authClient";

function DeactivateUser() {
  const [prompt, setPrompt] = useState("");
  useEffect(() => {
    let ignore = false;
    async function fetchUsers() {
      if (prompt.trim().length === 0) {
        setUserResults([]);
        return;
      }
      const { data: users } = await authClient.admin.listUsers({
        query: {
          searchValue: prompt,
          searchField: "name",
          searchOperator: "contains",
          offset: paginationOffset,
          limit: 9,
          sortBy: "name",
          sortDirection: "desc",
        },
      });
      if (ignore) return;
      setUserResults(users?.users ?? []);
      setPaginationCount(Math.ceil(users.total / 9));
    }
    fetchUsers();
    return () => {
      ignore = true;
    };
  }, [prompt, paginationOffset]);
  const users = [
    {
      id: "LMS-0023",
      name: "Juan Dela Cruz",
      type: "Student",
      email: "juan.dc@binagbagnhs.edu.ph",
      status: "Active",
    },
    {
      id: "LMS-0118",
      name: "Juanita Alfonso",
      type: "Faculty",
      email: "juanita@binagbagnhs.edu.ph",
      status: "Active",
    },
    {
      id: "LMS-0195",
      name: "Juan Miguel Reyes",
      type: "Student",
      email: "jm.reyes@binagbagnhs.edu.ph",
      status: "Pending",
    },
  ];

  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        p: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* BREADCRUMBS */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ my: 0.5, opacity: 0.5 }}>
        <Link component={NavLink} to="/users" underline="hover">
          User
        </Link>

        <Typography color="text.primary">Deactivate User</Typography>
      </Breadcrumbs>

      {/* HEADER */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 800,
          color: "primary.main",
        }}
      >
        Deactivate User
      </Typography>

      <Typography
        variant="subtitle1"
        sx={{
          letterSpacing: 1,
        }}
      >
        Deactivate a user account and restrict their access to library services.
      </Typography>

      {/* CONTENT */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: 2,
          mt: 2,
          flex: 1,
        }}
      >
        {/* LEFT SIDE */}
        <Paper
          variant="outlined"
          sx={{
            display: "flex",
            flexDirection: "column",
            borderRadius: 2,
            bgcolor: "white",
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold">
              Find User
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Search and select the account you want to deactivate.
            </Typography>

            {/* SEARCH */}
            <TextField
              fullWidth
              placeholder="Search by name, email, or library ID..."
              sx={{
                mt: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* RESULT HEADER */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mt: 3,
                mb: 1.5,
              }}
            >
              <Typography variant="body2" fontWeight="bold" sx={{ flex: 1 }}>
                Search Results
              </Typography>

              <Typography variant="body2" color="text.secondary">
                3 users found
              </Typography>
            </Box>

            {/* USERS */}
            <Stack spacing={1.5}>
              {users.map((user, index) => (
                <Paper
                  key={user.id}
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    cursor: "pointer",
                    bgcolor: "white",
                    borderColor: index === 0 ? "primary.main" : "divider",

                    "&:hover": {
                      borderColor: "primary.main",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 55,
                        height: 55,
                      }}
                    >
                      <PersonIcon sx={{ fontSize: 32 }} />
                    </Avatar>

                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        color="primary.main"
                      >
                        {user.name}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {user.id} • {user.type}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>

                    <Chip
                      label={user.status}
                      size="small"
                      sx={{
                        bgcolor: user.status === "Active" ? "green" : "orange",
                        color: "white",
                      }}
                    />

                    <ChevronRightIcon sx={{ color: "text.secondary" }} />
                  </Box>
                </Paper>
              ))}
            </Stack>
          </Box>
        </Paper>

        {/* RIGHT SIDE */}
        <Paper
          variant="outlined"
          sx={{
            borderRadius: 2,
            bgcolor: "white",
            alignSelf: "start",
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold">
              Deactivate Account
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Review the user's information and provide a reason for
              deactivation.
            </Typography>

            {/* USER PREVIEW */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                my: 3,
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                }}
              >
                <PersonIcon sx={{ fontSize: 45 }} />
              </Avatar>

              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight="bold">
                  Juan Dela Cruz
                </Typography>

                <Chip
                  label="Student"
                  size="small"
                  color="primary"
                  sx={{ mt: 0.5 }}
                />

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  LMS-0023
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  juan.dc@binagbagnhs.edu.ph
                </Typography>
              </Box>

              <Chip
                label="Active"
                size="small"
                sx={{
                  bgcolor: "green",
                  color: "white",
                }}
              />
            </Box>

            <Divider />

            {/* LIBRARY SUMMARY */}
            <Typography variant="body2" fontWeight="bold" sx={{ mt: 3, mb: 1 }}>
              Library Summary
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 1.5,
              }}
            >
              <SummaryCard label="Active Loans" value="0" icon={<BookIcon />} />

              <SummaryCard
                label="Active Reservations"
                value="1"
                icon={<ReservationIcon />}
              />

              <SummaryCard
                label="Overdue Books"
                value="0"
                icon={<WarningIcon />}
              />

              <SummaryCard
                label="Total Books Borrowed"
                value="12"
                icon={<BookIcon />}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* REASON */}
            <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
              Reason for Deactivation *
            </Typography>

            <TextField select fullWidth defaultValue="">
              <MenuItem value="" disabled>
                Select a reason...
              </MenuItem>

              <MenuItem value="graduated">Graduated</MenuItem>

              <MenuItem value="transferred">Transferred</MenuItem>

              <MenuItem value="employment-ended">Employment Ended</MenuItem>

              <MenuItem value="violation">Library Policy Violation</MenuItem>

              <MenuItem value="other">Other</MenuItem>
            </TextField>

            {/* NOTES */}
            <Typography variant="body2" fontWeight="bold" sx={{ mt: 3, mb: 1 }}>
              Additional Notes
            </Typography>

            <TextField
              fullWidth
              multiline
              minRows={3}
              placeholder="Enter additional details..."
            />

            {/* NOTICE */}
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                mt: 3,
                p: 2,
                borderRadius: 2,
                bgcolor: "primary.light",
              }}
            >
              <InfoIcon sx={{ color: "white" }} />

              <Typography variant="body2" sx={{ color: "white" }}>
                Deactivating this account will restrict the user from accessing
                library services until the account is restored.
              </Typography>
            </Box>
          </Box>

          {/* ACTIONS */}
          <Divider />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 3,
            }}
          >
            <Button
              variant="text"
              color="inherit"
              sx={{
                mr: "auto",
                textTransform: "none",
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              color="error"
              startIcon={<DeactivateIcon />}
              sx={{
                textTransform: "none",
              }}
            >
              Deactivate Account
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

function SummaryCard({ label, value, icon }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: "white",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 38,
            height: 38,
            borderRadius: 1,
            bgcolor: "primary.light",
            color: "primary.main",
          }}
        >
          {icon}
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>

          <Typography fontWeight="bold">{value}</Typography>
        </Box>
      </Box>
    </Paper>
  );
}

export default DeactivateUser;
