import { getImageUrl } from "../../api/imageFetcher";
import { authClient } from "../../auth/authClient";

import {
  Box,
  Stack,
  Typography,
  InputAdornment,
  Link,
  Button,
  IconButton,
} from "@mui/material";

import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import CustomTextField from "../../components/CustomTextField";

import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { socket } from "../../socket";

function Login() {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    setIsLoggingIn(true);
    setLoginError("");
    try {
      const { data, error } = await authClient.signIn.email({
        email: userInfo.email,
        password: userInfo.password,
      });
    } catch (error) {
      setLoginError("Unable to reach the server. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        bgcolor: "#F5F3EE",
      }}
    >
      {/* School cover */}
      <Box
        sx={{
          position: "relative",
          display: {
            xs: "none",
            md: "block",
          },
          width: {
            md: "48%",
            lg: "52%",
          },
          minHeight: "100vh",
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={getImageUrl("LoginCover")}
          alt="Binagbag National High School"
          sx={{
            width: "100%",
            height: "100%",
            position: "absolute",
            inset: 0,
            objectFit: "cover",
            objectPosition: "center",
          }}
        />

        {/* Dark overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(27,42,74,0.05) 35%, rgba(13,25,48,0.88) 100%)",
          }}
        />

        {/* School identity */}
        <Stack
          spacing={1}
          sx={{
            position: "absolute",
            left: { md: 5, lg: 7 },
            right: 5,
            bottom: { md: 5, lg: 7 },
            color: "white",
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 3,
              mb: 1,
              bgcolor: "white",
              borderRadius: 999,
            }}
          />

          <Typography
            variant="h3"
            sx={{
              maxWidth: 520,
              fontWeight: 700,
              lineHeight: 1.05,
            }}
          >
            Binagbag National
            <br />
            High School
          </Typography>

          <Typography
            variant="subtitle1"
            sx={{
              letterSpacing: {
                md: 3,
                lg: 5,
              },
              textTransform: "uppercase",
            }}
          >
            Blaine Baird Learning Center
          </Typography>

          <Typography sx={{ pt: 1, fontStyle: "italic", opacity: 0.9 }}>
            Knowledge today. A brighter tomorrow.
          </Typography>
        </Stack>
      </Box>

      {/* Login area */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: {
            xs: 2,
            sm: 4,
            md: 6,
          },
          py: 4,
        }}
      >
        <Stack
          component="form"
          id="submit-login"
          onSubmit={handleLogin}
          spacing={2}
          sx={{
            width: "100%",
            maxWidth: 570,
          }}
        >
          {/* Mobile identity */}
          <Typography
            variant="overline"
            sx={{
              display: {
                xs: "block",
                md: "none",
              },
              color: "primary.main",
              fontWeight: 700,
              letterSpacing: 2,
              textAlign: "center",
            }}
          >
            BINAGBAG NATIONAL HIGH SCHOOL LIBRARY
          </Typography>

          <Stack spacing={0.5} sx={{ mb: 2, alignItems: "center" }}>
            <Typography
              component="h1"
              sx={{
                color: "primary.main",
                fontWeight: 700,
                fontSize: {
                  xs: "2.25rem",
                  sm: "2.75rem",
                  md: "3rem",
                },
              }}
            >
              Welcome back
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                textAlign: "center",
              }}
            >
              Sign in to access library resources
            </Typography>
          </Stack>

          <CustomTextField
            fullWidth
            required
            type="email"
            placeholder="Email address"
            autoComplete="email"
            value={userInfo.email}
            onChange={(e) => {
              setUserInfo((prev) => ({
                ...prev,
                email: e.target.value,
              }));
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: "primary.main" }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          <CustomTextField
            fullWidth
            required
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            autoComplete="current-password"
            value={userInfo.password}
            onChange={(e) => {
              setUserInfo((prev) => ({
                ...prev,
                password: e.target.value,
              }));
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "primary.main" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      type="button"
                      edge="end"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Link
            component={RouterLink}
            to="/forgot-password"
            underline="hover"
            sx={{
              alignSelf: "flex-end",
              color: "primary.main",
            }}
          >
            Forgot password?
          </Link>

          {loginError && (
            <Typography
              role="alert"
              variant="body2"
              sx={{
                color: "error.main",
                textAlign: "center",
              }}
            >
              {loginError}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            size="large"
            variant="contained"
            disabled={isLoggingIn}
            sx={{
              minHeight: 52,
              bgcolor: "primary.main",
              color: "white",
              fontWeight: 700,
              textTransform: "none",

              "&:hover": {
                bgcolor: "accent.primary",
              },
            }}
          >
            {isLoggingIn ? "Signing in..." : "Sign In"}
          </Button>

          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            flexWrap="wrap"
          >
            <Typography color="text.secondary">
              Don&apos;t have an account?
            </Typography>

            <Link
              component={RouterLink}
              to="/register"
              underline="hover"
              sx={{ fontWeight: 600, color: "accent.primary" }}
            >
              Create an account
            </Link>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}

export default Login;
