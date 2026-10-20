import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { authClient } from "../../../auth/authClient";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  Typography,
  Breadcrumbs,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import {
  Email as EmailIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  WatchLater as WatchLaterIcon,
  BadgeRounded as BadgeRoundedIcon,
  Edit as EditIcon,
  MenuBook as MenuBookIcon,
  WarningAmber as WarningAmberIcon,
  EventAvailable as EventAvailableIcon,
  BookmarkBorder as BookmarkBorderIcon,
  EventNote as EventNoteIcon,
  AccessTime as AccessTimeIcon,
  QrCode2,
} from "@mui/icons-material";
import { purple } from "@mui/material/colors";
import StateDialog from "../../../components/StateDialog";
import Barcode from "react-barcode";
import { getUserProfileLibrarySummary } from "../../../api/usersApi";

function UserProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [dialog, setDialog] = useState("");
  const [userLibrarySummary, setUserLibrarySummary] = useState([]);
  useEffect(() => {
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

      console.log(data);
      setProfile(data);
      const librarySummary = await getUserProfileLibrarySummary(id);
      setUserLibrarySummary(librarySummary);
      console.log(librarySummary);
    }

    loadProfile();
  }, [id]);

  if (!profile) {
    return <StateDialog title="User not found!" />;
  }

  const userInformationContent = [
    {
      label: "User Type",
      icon: <PersonIcon />,
      target: profile.user_type,
    },
    {
      label: "User Role",
      icon: <WorkIcon />,
      target: profile.role,
    },
    {
      label: "Account Created At",
      icon: <WatchLaterIcon />,
      target: new Date(profile.createdAt).toLocaleDateString("en-US"),
    },
    {
      label: "Status",
      icon: <BadgeRoundedIcon />,
      target: profile.status,
    },
    {
      label: "Email",
      icon: <EmailIcon />,
      target: profile.email,
    },
  ];

  // Replace targets with backend data later.
  const librarySummaryContent = [
    {
      label: "Active Loans",
      icon: <MenuBookIcon />,
      target: userLibrarySummary?.activeLoans,
      color: "blue",
    },
    {
      label: "Overdue Loans",
      icon: <WarningAmberIcon />,
      target: userLibrarySummary?.overdueLoans,
      color: "red",
    },
    {
      label: "Active Reservations",
      icon: <EventAvailableIcon />,
      target: userLibrarySummary?.activeReservations,
      color: "purple,",
    },
    {
      label: "Total Books Borrowed",
      icon: <BookmarkBorderIcon />,
      target: userLibrarySummary?.totalBooksBorrowed,
      color: "green",
    },
    {
      label: "Total Reservations",
      icon: <EventNoteIcon />,
      target: userLibrarySummary?.totalReservations,
      color: "orange",
    },
  ];

  return (
    <>
      <Dialog open={dialog === "barcode"} onClose={() => setDialog("")}>
        <DialogTitle>
          <Typography sx={{ fontWeight: "bold" }}>Barcode Generated</Typography>
        </DialogTitle>
        <DialogContent>
          <Barcode value="LMS-0002" />
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          p: 2,
          gap: 1.5,
        }}
      >
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
            {profile.name}
          </Link>
        </Breadcrumbs>
        {/* PROFILE */}
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
            <PersonIcon />
          </Avatar>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              {profile.name}
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 1,
                my: 0.5,
              }}
            >
              <Chip label={profile.user_type} size="small" color="primary" />

              <Chip
                sx={{
                  bgcolor:
                    profile.status === "Active"
                      ? "green"
                      : profile.status === "Canceled"
                        ? "orange"
                        : profile.status === "Closed"
                          ? "orange"
                          : "black",
                  color: "white",
                }}
                label={profile.status}
                size="small"
              />
            </Box>

            <Typography variant="body2" color="text.secondary">
              {profile.email}
            </Typography>
          </Box>
          <Stack sx={{ gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              component={NavLink}
              sx={{
                flex: 1,
                textTransform: "none",
                display: profile?.status !== "Pending" ? "flex" : "none",
              }}
              to={`/users/manage/${profile.id}`}
            >
              Manage User Account
            </Button>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              component={NavLink}
              to={`/pendingUserDetails/${profile.id}`}
              sx={{
                flex: 1,
                textTransform: "none",
                display: profile?.status === "Pending" ? "flex" : "none",
              }}
            >
              Review Pending User
            </Button>
            <Button
              variant="contained"
              startIcon={<QrCode2 />}
              sx={{ flex: 1, textTransform: "none" }}
              onClick={() => setDialog("barcode")}
            >
              Generate User Barcode
            </Button>
          </Stack>
        </Box>

        {/* INFORMATION + SUMMARY */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1.5,
          }}
        >
          {/* USER INFORMATION */}
          <Box
            sx={{
              bgcolor: "white",
              p: 2,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold" mb={1}>
              User Information
            </Typography>

            {userInformationContent.map((content) => (
              <Box
                key={content.label}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  py: 1,
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
                  {content.icon}
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {content.label}
                  </Typography>

                  <Typography fontWeight={500}>
                    {content.target || "N/A"}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* LIBRARY SUMMARY */}
          <Box
            sx={{
              bgcolor: "white",
              p: 2,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold" mb={1}>
              Library Summary
            </Typography>

            {librarySummaryContent.map((content) => (
              <React.Fragment key={content.label}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    py: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      color: content.color,
                    }}
                  >
                    {content.icon}
                  </Box>

                  <Typography variant="body2" sx={{ flex: 1 }}>
                    {content.label}
                  </Typography>

                  <Typography variant="body2" fontWeight="bold">
                    {content.target}
                  </Typography>
                </Box>

                <Divider />
              </React.Fragment>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default UserProfile;
