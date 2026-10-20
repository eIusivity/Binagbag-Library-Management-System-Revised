import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { authClient } from "../../../auth/authClient";
import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  InputAdornment,
  Link,
  Paper,
  Typography,
} from "@mui/material";

import {
  BadgeRounded as BadgeIcon,
  CalendarMonthRounded as CalendarIcon,
  EmailOutlined as EmailIcon,
  InfoOutlined as InfoIcon,
  PersonOutlineRounded as PersonIcon,
  PhoneOutlined as PhoneIcon,
  WorkOutlineRounded as WorkIcon,
  SaveRounded as SaveIcon,
  LockResetRounded as ResetPasswordIcon,
  RestoreRounded as RestoreIcon,
} from "@mui/icons-material";

import CustomTextField from "../../../components/CustomTextField";

function ManageUserAccount() {
  const { id } = useParams();
  const [dialog, setDialog] = useState("");
  // Replace with your fetched profile later
  const profile = {
    id: "user-001",
    first_name: "Lara",
    middle_name: "",
    last_name: "Navarro",
    email: "test12@example.com",
    phone_number: "",
    user_type: "Student",
    role: "Patron",
    status: "Blacklisted",
    status_reason: "Unreturned library materials",
    createdAt: "2026-09-21",
  };

  const [modifications, setModifications] = useState({
    first_name: profile.first_name,
    middle_name: profile.middle_name,
    last_name: profile.last_name,
    email: profile.email,
    phone_number: profile.phone_number,
  });

  const editableFields = [
    {
      label: "First Name",
      value: "first_name",
      required: true,
    },
    {
      label: "Middle Name",
      value: "middle_name",
      required: false,
    },
    {
      label: "Last Name",
      value: "last_name",
      required: true,
    },
  ];

  const fullName = [
    modifications.first_name,
    modifications.middle_name,
    modifications.last_name,
  ]
    .filter(Boolean)
    .join(" ");

  const profileInformation = [
    {
      label: "Email",
      target: modifications.email,
      icon: <EmailIcon />,
    },
    {
      label: "Phone Number",
      target: modifications.phone_number,
      icon: <PhoneIcon />,
    },
    {
      label: "Account Status",
      target: profile.status,
      icon: <BadgeIcon />,
    },
    {
      label: "User Role",
      target: profile.role,
      icon: <WorkIcon />,
    },
    {
      label: "Account Created",
      target: new Date(profile.createdAt).toLocaleDateString("en-US"),
      icon: <CalendarIcon />,
    },
  ];

  function handleSaveChanges() {
    // TODO: Better Auth updateUser
    console.log(modifications);
  }

  function handleRestoreAccount() {
    // TODO: Account restoration logic
    console.log("Restore account");
    setDialog("");
  }

  function handleResetPassword() {
    // TODO: Librarian-assisted password reset
    console.log("Reset password");
    setDialog("");
  }

  return (
    <>
      {/* RESTORE ACCOUNT DIALOG */}
      <Dialog open={dialog === "restore"} onClose={() => setDialog("")}>
        <DialogTitle>
          <Typography sx={{ fontWeight: "bold" }}>Confirm Action</Typography>
        </DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to restore this user's account?
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDialog("")} sx={{ textTransform: "none" }}>
            No, I Changed My Mind
          </Button>

          <Button
            variant="contained"
            startIcon={<RestoreIcon />}
            sx={{
              bgcolor: "accent.primary",
              textTransform: "none",
            }}
            onClick={handleRestoreAccount}
          >
            Yes, Restore Account
          </Button>
        </DialogActions>
      </Dialog>

      {/* PASSWORD RESET DIALOG */}
      <Dialog open={dialog === "resetPassword"} onClose={() => setDialog("")}>
        <DialogTitle>
          <Typography sx={{ fontWeight: "bold" }}>
            Reset User Password
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Typography>
            Start a librarian-assisted password reset for this user?
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDialog("")} sx={{ textTransform: "none" }}>
            Cancel
          </Button>

          <Button
            variant="contained"
            startIcon={<ResetPasswordIcon />}
            sx={{
              bgcolor: "accent.primary",
              textTransform: "none",
            }}
            onClick={handleResetPassword}
          >
            Continue Password Reset
          </Button>
        </DialogActions>
      </Dialog>

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

          <Link component={NavLink} to="/users/search" underline="hover">
            View & Search User
          </Link>

          <Link
            component={NavLink}
            to={`/users/${profile.id}`}
            underline="hover"
          >
            {fullName}
          </Link>

          <Typography color="text.primary">Manage Account</Typography>
        </Breadcrumbs>

        {/* HEADER */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            color: "primary.main",
          }}
        >
          Manage User Account
        </Typography>

        <Typography variant="subtitle1" sx={{ letterSpacing: 1 }}>
          Update the user's information and manage their library account.
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
          {/* LEFT */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* USER INFORMATION */}
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
                  User Information
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Update the user's personal information.
                </Typography>

                {/* NAME FIELDS */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 2,
                    mt: 3,
                  }}
                >
                  {editableFields.map((field) => (
                    <Box key={field.value}>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        sx={{ mb: 1 }}
                      >
                        {field.label}
                        {field.required && " *"}
                      </Typography>

                      <CustomTextField
                        fullWidth
                        value={modifications[field.value] ?? ""}
                        onChange={(e) =>
                          setModifications((prev) => ({
                            ...prev,
                            [field.value]: e.target.value,
                          }))
                        }
                      />
                    </Box>
                  ))}
                </Box>

                {/* EMAIL + PHONE */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 2,
                    mt: 3,
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      sx={{ mb: 1 }}
                    >
                      Email
                    </Typography>

                    <CustomTextField
                      fullWidth
                      value={modifications.email ?? ""}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon />
                            </InputAdornment>
                          ),
                        },
                      }}
                      onChange={(e) =>
                        setModifications((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                  </Box>

                  <Box>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      sx={{ mb: 1 }}
                    >
                      Phone Number
                    </Typography>

                    <CustomTextField
                      fullWidth
                      value={modifications.phone_number ?? ""}
                      helperText="Enter a valid Philippine mobile number."
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIcon />
                            </InputAdornment>
                          ),
                        },
                      }}
                      onChange={(e) =>
                        setModifications((prev) => ({
                          ...prev,
                          phone_number: e.target.value,
                        }))
                      }
                    />
                  </Box>
                </Box>
              </Box>

              {/* USER INFO ACTIONS */}
              <Box sx={{ mt: "auto" }}>
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
                    component={NavLink}
                    color="inherit"
                    to={`/users/${profile.id}`}
                    sx={{
                      mr: "auto",
                      textTransform: "none",
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    sx={{
                      textTransform: "none",
                      bgcolor: "accent.primary",
                    }}
                    onClick={handleSaveChanges}
                  >
                    Save Changes
                  </Button>
                </Box>
              </Box>
            </Paper>

            {/* ACCOUNT MANAGEMENT */}
            <Paper
              variant="outlined"
              sx={{
                borderRadius: 2,
                bgcolor: "white",
              }}
            >
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Account Management
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Administrative controls for the user's library account.
                </Typography>

                {/* STATUS */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mt: 3,
                    py: 1,
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 0.5,
                      }}
                    >
                      <Typography variant="body2" fontWeight="bold">
                        Account Status
                      </Typography>

                      <Chip label={profile.status} size="small" />
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                      {profile.status_reason || "No status reason provided."}
                    </Typography>
                  </Box>

                  {profile.status !== "Active" && (
                    <Button
                      variant="outlined"
                      startIcon={<RestoreIcon />}
                      sx={{ textTransform: "none" }}
                      onClick={() => setDialog("restore")}
                    >
                      {profile.status === "Blacklisted"
                        ? "Lift Blacklist"
                        : profile.status === "Closed"
                          ? "Reopen Account"
                          : "Restore Account"}
                    </Button>
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* PASSWORD */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    py: 1,
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      Password
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      Assist the user with resetting their account password.
                    </Typography>
                  </Box>

                  <Button
                    variant="outlined"
                    startIcon={<ResetPasswordIcon />}
                    sx={{ textTransform: "none" }}
                    onClick={() => setDialog("resetPassword")}
                  >
                    Reset Password
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Box>

          {/* PROFILE PREVIEW */}
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: "white",
              alignSelf: "start",
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Profile Preview
            </Typography>

            <Typography variant="body2" color="text.secondary">
              This is how the user's information will appear after saving.
            </Typography>

            {/* USER */}
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

              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {fullName}
                </Typography>

                <Chip
                  label={profile.user_type}
                  size="small"
                  color="primary"
                  sx={{ mt: 0.5 }}
                />
              </Box>
            </Box>

            {/* INFORMATION */}
            <Box>
              {profileInformation.map((information) => (
                <React.Fragment key={information.label}>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "32px 1fr 1.2fr",
                      alignItems: "center",
                      gap: 1,
                      py: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        color: "primary.main",
                      }}
                    >
                      {information.icon}
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                      {information.label}
                    </Typography>

                    {information.label === "Account Status" ? (
                      <Chip
                        label={information.target}
                        size="small"
                        sx={{
                          justifySelf: "start",
                        }}
                      />
                    ) : (
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        sx={{
                          overflowWrap: "anywhere",
                        }}
                      >
                        {information.target || "N/A"}
                      </Typography>
                    )}
                  </Box>

                  <Divider />
                </React.Fragment>
              ))}
            </Box>

            {/* NOTICE */}
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                mt: 3,
                p: 2,
                borderRadius: 2,
                bgcolor: "primary.light",
                color: "primary.main",
              }}
            >
              <InfoIcon sx={{ color: "white" }} />

              <Typography variant="body2" sx={{ color: "white" }}>
                Changes to the user's information will appear here before they
                are saved.
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  );
}

export default ManageUserAccount;
