import {
  Box,
  Button,
  IconButton,
  Typography,
  Badge,
  Popover,
  List,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Stack,
  Divider,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import CustomTextField from "./CustomTextField.jsx";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Logo from "../assets/Logo.png";
import { useEffect, useState } from "react";
import { useSnackbar } from "../components/SnackbarProvider.jsx";
import { authClient } from "../auth/authClient.js";
import { useAuth } from "../auth/AuthProvider.jsx";
import {
  getUnreadNotificationCount,
  markNotificationAsRead,
} from "../api/notifyApi.js";
import { getNotifications } from "../api/notifyApi.js";
import { socket } from "../socket.js";
function Header() {
  const { user } = useAuth();
  const { data } = authClient.useSession();
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const openNotificationPopover = async (event) => {
    setNotificationAnchor(event.currentTarget);
    if (!data?.user) return;
    const result = await getNotifications(data.user.id, data.user.role);
    setNotifications(result);
  };
  const closeNotificationPopover = () => {
    setNotificationAnchor(null);
  };
  socket.on("new-registration", async () => {
    const count = await getUnreadNotificationCount(
      data.user.id,
      data.user.role,
    );
    setUnreadNotificationCount(count);
  });
  const iconButtons = [
    {
      symbol: (
        <Badge badgeContent={unreadNotificationCount} max={99} color="error">
          <NotificationsIcon />
        </Badge>
      ),
      action: openNotificationPopover,
    },
  ];

  useEffect(() => {
    if (!data?.user) return;
    async function loadUnreadCount() {
      const count = await getUnreadNotificationCount(
        data.user.id,
        data.user.role,
      );
      setUnreadNotificationCount(count);
    }
    loadUnreadCount();
  }, [data?.user?.id, data?.user?.role]);
  return (
    <>
      {/* Notification Popover */}
      <Popover
        open={Boolean(notificationAnchor)}
        anchorEl={notificationAnchor}
        onClose={closeNotificationPopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: {
              width: 360,
              maxHeight: 450,
              borderRadius: 2,
            },
          },
        }}
      >
        {/* Header */}
        <Stack direction="row">
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "1rem",
              px: 2,
              py: 1.5,
              flex: 1,
            }}
          >
            Notifications
          </Typography>
          <Button
            onClick={async () => {
              try {
                await Promise.all(
                  notifications.map((notif) =>
                    markNotificationAsRead(notif.notification_id, data.user.id),
                  ),
                );

                const [updatedNotifications, updatedCount] = await Promise.all([
                  getNotifications(data.user.id, data.user.role),
                  getUnreadNotificationCount(data.user.id, data.user.role),
                ]);

                setNotifications(updatedNotifications);
                setUnreadNotificationCount(updatedCount);
              } catch (error) {
                console.error(error);
              }
            }}
          >
            Mark All As Read
          </Button>
        </Stack>

        <Divider />

        {/* Notifications */}
        <List disablePadding>
          {notifications.map((notif) => (
            <ListItemButton
              key={notif.notification_id}
              component={NavLink}
              to={`/pendingUserDetails/${notif.reference_id}`}
              sx={{
                px: 2,
                py: 1.25,
                alignItems: "flex-start",
                bgcolor: notif.is_read === 1 && "#777777",
              }}
              onClick={async () => {
                await markNotificationAsRead(
                  notif.notification_id,
                  data.user.id,
                );

                const [updatedNotifications, updatedCount] = await Promise.all([
                  getNotifications(data.user.id, data.user.role),
                  getUnreadNotificationCount(data.user.id, data.user.role),
                ]);

                setNotifications(updatedNotifications);
                setUnreadNotificationCount(updatedCount);
              }}
            >
              <Stack
                sx={{
                  minWidth: 0,
                  width: "100%",
                  gap: 0.25,
                }}
              >
                {/* Title */}
                <Typography
                  noWrap
                  sx={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                  }}
                >
                  {notif.title}
                </Typography>

                {/* Content */}
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    color: "text.secondary",
                    lineHeight: 1.4,

                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {notif.content}
                </Typography>
              </Stack>
            </ListItemButton>
          ))}
        </List>
      </Popover>

      <Box sx={{ display: "flex", flex: 0.05, bgcolor: "primary.main" }}>
        <Box sx={{ display: "flex", flex: 0.5 }}>
          <Button
            sx={{
              color: "background.default",
              gap: 1,
              "&:hover": { opacity: 0.75 },
            }}
          >
            <img src={Logo} width="50" height="50" />{" "}
            <Typography variant="h6">Binagbag NHS</Typography>
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SearchIcon sx={{ color: "background.default", fontSize: 32 }} />
          <CustomTextField
            fullWidth
            placeholder="Search..."
            sx={{ height: "60%" }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flex: 0.5,
            justifyContent: "flex-end",
            alignItems: "center",
            px: 2,
          }}
        >
          {iconButtons.map((icon, i) => {
            return (
              <IconButton
                key={i}
                disableRipple
                sx={{
                  color: "background.default",
                  "&:hover": { bgcolor: "accent.primary" },
                }}
                onClick={icon.action}
              >
                {icon.symbol}
              </IconButton>
            );
          })}
          <Stack sx={{ alignItems: "flex-start" }}>
            <Typography sx={{ color: "white", fontWeight: "bold" }}>
              {user.name}
            </Typography>

            <Typography sx={{ color: "white", fontSize: 13 }}>
              {user.role}
            </Typography>
            <Button
              onClick={async () => await authClient.signOut()}
              sx={{
                color: "white",
                textTransform: "none",
                fontSize: 12,
                p: 0,
                minWidth: 0,
                "&:hover": {
                  bgcolor: "transparent",
                  textDecoration: "underline",
                },
              }}
            >
              Sign out
            </Button>
          </Stack>
        </Box>
      </Box>
    </>
  );
}

export default Header;
