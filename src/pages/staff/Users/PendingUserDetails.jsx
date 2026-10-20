import React, { useEffect, useState } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { authClient } from "../../../auth/authClient";
import { useSnackbar } from "../../../components/SnackbarProvider";
import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Divider,
  FormControl,
  InputAdornment,
  Link,
  MenuItem,
  Paper,
  Select,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import {
  BadgeRounded as BadgeIcon,
  CalendarMonthRounded as CalendarIcon,
  CheckRounded as CheckIcon,
  DeleteOutlineRounded as DeleteIcon,
  EmailOutlined as EmailIcon,
  InfoOutlined as InfoIcon,
  PersonOutlineRounded as PersonIcon,
  PhoneOutlined as PhoneIcon,
  WorkOutlineRounded as WorkIcon,
} from "@mui/icons-material";
import { socket } from "../../../socket";
import CustomTextField from "../../../components/CustomTextField";
import StateDialog from "../../../components/StateDialog";

function PendingUserDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { triggerSnackbar } = useSnackbar();
  const [profile, setProfile] = useState(null);
  const [dialog, setDialog] = useState("");
  const [modifications, setModifications] = useState({});
  async function loadProfile() {
    const { data, error } = await authClient.admin.getUser({
      query: {
        id,
      },
    });

    if (error) {
      console.log(error.message);
      return;
    }

    setProfile(data);
  }
  useEffect(() => {
    loadProfile();
  }, [id]);

  if (!profile) {
    return <StateDialog title="User not found!" />;
  }
  if (profile.status === "Active") {
    return (
      <StateDialog
        title="This user has already been approved!"
        description="Would you like to view the user's profile?"
        action={() => navigate(`/users/${profile.id}`)}
        actionLabel="Yes, View their Profile"
      />
    );
  }
  if (profile.status === "Canceled" && profile.status_reason === "Rejected") {
    return (
      <StateDialog
        title="This user has been rejected!"
        description="Would you like to open a review again for this user?"
      />
    );
  }
  if (profile.status === "Blacklisted") {
    return (
      <StateDialog
        title="This user has been blacklisted!"
        description="Manage their records in user banning controls below."
      />
    );
  }

  const editableFields = [
    {
      label: "First Name",
      target: profile.first_name,
      value: "first_name",
      required: true,
    },
    {
      label: "Middle Name",
      target: profile.middle_name,
      value: "middle_name",
      required: false,
    },
    {
      label: "Last Name",
      target: profile.last_name,
      value: "last_name",
      required: true,
    },
  ];

  const profileInformation = [
    {
      label: "Email",
      target: modifications.email ?? profile.email,
      icon: <EmailIcon />,
    },
    {
      label: "Phone Number",
      target: modifications.phone_number ?? profile.phone_number,
      icon: <PhoneIcon />,
    },
    {
      label: "Account Status",
      target: "Active",
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

  const fullName = [profile.first_name, profile.middle_name, profile.last_name]
    .filter(Boolean)
    .join(" ");
  //this is for library qr code
  function generateLibraryId() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";

    for (let i = 0; i < 6; i++) {
      result += characters[Math.floor(Math.random() * characters.length)];
    }

    return `LMS-${result}`;
  }
  async function handleUserReview(verdict) {
    const { data, error } = await authClient.admin.updateUser({
      userId: profile.id,
      data: {
        status: verdict === "approved" ? "Active" : "Canceled",
        status_reason:
          verdict === "approved" ? "Approved Registration" : "Rejected",
        name: [
          modifications.first_name ?? profile.first_name,
          modifications.middle_name ?? profile.middle_name,
          modifications.last_name ?? profile.last_name,
        ]
          .filter(Boolean)
          .join(" "),
        library_id: verdict === "approved" ? generateLibraryId() : null,
        ...modifications,
      },
    });
    if (error) {
      triggerSnackbar({
        title: "Error",
        content: "Failed to process user registration.",
        severity: "error",
      });
      return;
    }
    triggerSnackbar({
      title: "Success!",
      content:
        verdict === "approved"
          ? "User registration approved."
          : "User registration rejected.",
      severity: "success",
    });

    loadProfile();
  }
  function handleSubmission(e) {
    e.preventDefault();
    setDialog("approve");
  }
  return (
    <>
      <Dialog open={dialog === "approve"} onClose={() => setDialog("")}>
        <DialogTitle>
          <Typography sx={{ fontWeight: "bold" }}>Confirm Action</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to accept the user's registration?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog("")}>No, I Changed My Mind</Button>
          <Button
            sx={{ bgcolor: "accent.primary", color: "white" }}
            onClick={() => handleUserReview("approved")}
          >
            Yes, Accept User Registration
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={dialog === "reject"} onClose={() => setDialog("")}>
        <DialogTitle>
          <Typography sx={{ fontWeight: "bold" }}>Confirm Action</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to reject the user's registration?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog("")}>No, I Changed My Mind</Button>
          <Button
            sx={{ bgcolor: "red", color: "white" }}
            onClick={() => handleUserReview("rejected")}
          >
            Yes, Reject User's Registration
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

          <Link component={NavLink} to="/users/pending" underline="hover">
            Pending Registrations
          </Link>

          <Typography color="text.primary">{fullName}</Typography>
        </Breadcrumbs>

        {/* HEADER */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            color: "primary.main",
          }}
        >
          Pending User Details
        </Typography>

        <Typography variant="subtitle1" sx={{ letterSpacing: 1 }}>
          Review the pending user's information before approving or rejecting
          their registration.
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
          {/* EDITABLE INFORMATION */}
          <Paper
            variant="outlined"
            component="form"
            id="edit-information-form"
            onSubmit={(e) => handleSubmission(e)}
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
                Review and correct the user's submitted information.
              </Typography>

              {/* USER TYPE + EMAIL */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 2,
                  mt: 3,
                }}
              >
                <Box>
                  <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                    User Type *
                  </Typography>

                  <FormControl fullWidth>
                    <Select
                      value={modifications?.user_type ?? profile.user_type}
                      onChange={(e) => {
                        setModifications((prev) => ({
                          ...prev,
                          user_type: e.target.value,
                        }));
                      }}
                    >
                      {["Student", "Faculty", "Non-Faculty"].map((userType) => (
                        <MenuItem key={userType} value={userType}>
                          {userType}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box>
                  <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                    Email
                  </Typography>

                  <CustomTextField
                    fullWidth
                    value={modifications.email ?? profile.email ?? ""}
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
              </Box>

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
                  <Box key={field.label}>
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
                      required={field.required}
                      value={modifications[field.value] ?? field.target ?? ""}
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

              {/* PHONE */}
              <Box sx={{ mt: 3, width: "50%" }}>
                <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                  Phone Number
                </Typography>

                <CustomTextField
                  fullWidth
                  value={
                    modifications.phone_number ?? profile.phone_number ?? ""
                  }
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

            {/* ACTIONS */}
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
                  sx={{
                    mr: "auto",
                    textTransform: "none",
                  }}
                  to={`/users/${id}`}
                >
                  Cancel
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  sx={{ textTransform: "none" }}
                  onClick={() => setDialog("reject")}
                >
                  Reject Registration
                </Button>

                <Button
                  variant="contained"
                  type="submit"
                  id="edit-information-form"
                  startIcon={<CheckIcon />}
                  sx={{
                    textTransform: "none",
                    bgcolor: "accent.primary",
                  }}
                >
                  Approve Registration
                </Button>
              </Box>
            </Box>
          </Paper>

          {/* PROFILE PREVIEW */}
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: "white",
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Profile Preview
            </Typography>

            <Typography variant="body2" color="text.secondary">
              This is how the user's information will appear after approval.
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
                  {[
                    modifications.first_name ?? profile.first_name,
                    modifications.middle_name ?? profile.middle_name,
                    modifications.last_name ?? profile.last_name,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                </Typography>

                <Chip
                  label={modifications?.user_type ?? profile.user_type}
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
                          bgcolor: "green",
                          color: "white",
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
                After approval, the user will be able to access the library
                system and use their approved library account.
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  );
}

export default PendingUserDetails;
