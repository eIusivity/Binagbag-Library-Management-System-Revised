import React from "react";
import { Box, Button, Typography, Stack, Divider } from "@mui/material";
import { authClient } from "../../auth/authClient";
import StateDialog from "../../components/StateDialog";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import QRCode from "react-qr-code";
import Logo from "../../assets/Logo.png";
function Home() {
  const { data, isPending, error } = authClient.useSession();
  if (isPending) return null;
  if (error || !data?.user) return null;
  const { user } = data;
  return (
    <Box
      sx={{
        flex: 1,
        p: 1,
        display: "flex",
        justfyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {user.status === "Pending" && (
        <StateDialog
          icon={<HourglassBottomIcon sx={{ fontSize: 75 }} />}
          title="Registration pending..."
          description="Please await for approval by your library staff."
          action={async () => await authClient.signOut()}
          actionLabel="Sign Out"
        />
      )}
      {user.status === "Active" && (
        <Stack
          spacing={2}
          sx={{
            width: "100%",
            maxWidth: 520,
            p: { xs: 1, sm: 2 },
          }}
        >
          {/* PAGE HEADING */}
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: "primary.main",
              }}
            >
              Hello there, {user.name}!
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                mt: 0.5,
              }}
            >
              Here's your digital library card.
            </Typography>
          </Box>

          {/* DIGITAL LIBRARY CARD */}
          <Stack
            sx={{
              width: "100%",
              bgcolor: "white",
              borderRadius: 4,
              overflow: "hidden",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            }}
          >
            {/* NAVY + ORANGE STRIP */}
            <Box
              sx={{
                height: 12,
                bgcolor: "primary.main",
              }}
            />

            <Box
              sx={{
                height: 5,
                bgcolor: "#F97316",
              }}
            />

            {/* SCHOOL HEADER */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{
                p: 2.5,
                pb: 2,
              }}
            >
              <Box
                component="img"
                src={Logo}
                alt="School Logo"
                sx={{
                  width: 52,
                  height: 52,
                  objectFit: "contain",
                }}
              />

              <Box>
                <Typography
                  sx={{
                    fontSize: { xs: 13, sm: 15 },
                    fontWeight: 800,
                    color: "primary.main",
                    lineHeight: 1.2,
                  }}
                >
                  BINAGBAG NATIONAL HIGH SCHOOL
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    letterSpacing: 1,
                  }}
                >
                  DIGITAL LIBRARY PASS
                </Typography>
              </Box>
            </Stack>

            <Divider />

            {/* CARD CONTENT */}
            <Stack
              alignItems="center"
              spacing={2}
              sx={{
                px: 3,
                py: 3,
              }}
            >
              {/* QR */}
              <Box
                sx={{
                  display: "flex",
                  bgcolor: "white",
                  p: 1.5,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <QRCode value={user.library_id || "NO-LIBRARY-ID"} size={170} />
              </Box>

              {/* USER INFORMATION */}
              <Stack
                alignItems="center"
                spacing={0.5}
                sx={{
                  width: "100%",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    color: "primary.main",
                    textAlign: "center",
                  }}
                >
                  {user.name}
                </Typography>

                <Typography
                  align="center"
                  variant="body2"
                  color="text.secondary"
                >
                  {`${user.role}, ${user.user_type}`}
                </Typography>

                <Typography
                  align="center"
                  sx={{
                    mt: 1,
                    fontWeight: 700,
                    letterSpacing: 3,
                    color: "primary.main",
                  }}
                >
                  {user.library_id}
                </Typography>
              </Stack>

              {/* STATUS */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  px: 2,
                  py: 0.5,
                  borderRadius: 10,
                  bgcolor: "rgba(27, 42, 74, 0.08)",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 800,
                    color:
                      user.status === "Active" ? "limegreen" : "primary.main",
                    letterSpacing: 1,
                  }}
                >
                  ● {user.status.toUpperCase()}
                </Typography>
              </Box>
            </Stack>

            {/* FOOTER */}
            <Box
              sx={{
                bgcolor: "#F5F3EE",
                px: 3,
                py: 1.5,
                textAlign: "center",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Present this QR code to library staff when using library
                services.
              </Typography>
            </Box>
          </Stack>

          {/* ACCOUNT ACTION */}
          <Button
            variant="text"
            color="inherit"
            onClick={async () => await authClient.signOut()}
            sx={{
              alignSelf: "center",
              color: "text.secondary",
            }}
          >
            Sign Out
          </Button>
        </Stack>
      )}
    </Box>
  );
}

export default Home;
