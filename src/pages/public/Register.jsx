import {
  Box,
  Button,
  Divider,
  InputAdornment,
  Typography,
  Stack,
  Select,
  MenuItem,
  Link,
} from "@mui/material";
import { useState } from "react";
import { authClient } from "../../auth/authClient";
import { NavLink, useNavigate } from "react-router-dom";
import { createNotification } from "../../api/notifyApi";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import CustomTextField from "../../components/CustomTextField";
import { getImageUrl } from "../../api/imageFetcher";
function Register() {
  const navigate = useNavigate();
  const [registrationPhase, setRegistrationPhase] = useState("registering");
  const [userInfo, setUserInfo] = useState({ user_type: "Student" });
  const [isRegistering, setIsRegistering] = useState(false);
  async function handleAccountCreation(e) {
    e.preventDefault();

    if (isRegistering) return;

    if (userInfo.password !== userInfo.confirm_password) {
      alert("Passwords do not match.");
      return;
    }

    setIsRegistering(true);

    try {
      const { error } = await authClient.signUp.email(
        {
          email: userInfo.email,
          password: userInfo.password,
          name: [userInfo.first_name, userInfo.middle_name, userInfo.last_name]
            .filter(Boolean)
            .join(" "),
          user_type: userInfo.user_type,
          first_name: userInfo.first_name,
          middle_name: userInfo.middle_name ?? "",
          last_name: userInfo.last_name,
        },
        {
          onSuccess: async (ctx) => {
            await createNotification({
              notification_type: "Account Registration",
              title: "New Registration",
              content: `${userInfo.first_name} ${userInfo.last_name} has registered an account. Please review their details.`,
              reference_id: ctx.data.user.id,
              action: "ACCOUNT_REGISTRATION",
              audience: {
                role: "Librarian",
              },
            });
            navigate("/home");
          },
          onError: (ctx) => {
            alert(ctx.error.message);
          },
        },
      );

      if (error) {
        alert(error.message);
      }
    } finally {
      setIsRegistering(false);
    }
  }
  const textfieldInstances = [
    {
      label: "First Name",
      placeholder: "e.g. Juan",
      icon: <PersonIcon sx={{ color: "primary.main" }} />,
      value: "first_name",
      required: true,
    },
    {
      label: "Middle Initial (Optional)",
      placeholder: "e.g. D.",
      icon: <PersonIcon sx={{ color: "primary.main" }} />,
      value: "middle_name",
      required: false,
    },
    {
      label: "Last Name",
      placeholder: "e.g. Dela Cruz",
      icon: <PersonIcon sx={{ color: "primary.main" }} />,
      value: "last_name",
      required: true,
    },
    {
      label: "Password",
      placeholder: "Create a password",
      icon: <LockIcon sx={{ color: "primary.main" }} />,
      type: "password",
      value: "password",
      required: true,
    },
    {
      label: "Confirm Password",
      placeholder: "Confirm password here",
      icon: <LockIcon sx={{ color: "primary.main" }} />,
      type: "password",
      value: "confirm_password",
      required: true,
    },
    {
      label: "Email",
      placeholder: "e.g. juan@gmail.com",
      icon: <EmailIcon sx={{ color: "primary.main" }} />,
      type: "email",
      value: "email",
      required: true,
    },
    {
      label: "Phone (Optional)",
      placeholder: "e.g. 09999999999",
      icon: <LocalPhoneIcon sx={{ color: "primary.main" }} />,
      type: "number",
      value: "phone",
    },
  ];
  const fieldGroups = [
    {
      title: "Personal Information",
      values: ["first_name", "middle_name", "last_name"],
    },
    {
      title: "Contact Information",
      values: ["email", "phone"],
    },
    {
      title: "Account Security",
      values: ["password", "confirm_password"],
    },
  ];
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        outline: 1,
        p: { xs: 4, sm: 6, md: 1 },
        backgroundImage: `
  linear-gradient(
    rgba(245, 243, 238, 0.88),
    rgba(245, 243, 238, 0.94)
  ),
  url(${getImageUrl("RegisterPageCover.webp")})
`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: { md: "fixed", xs: "scroll" },
      }}
    >
      {registrationPhase === "invitation" && (
        <Button
          size="large"
          onClick={() => setRegistrationPhase("registering")}
          sx={{ bgcolor: "primary.main", color: "white" }}
        >
          Create an Account
        </Button>
      )}

      {registrationPhase === "registering" && (
        <>
          <Box
            sx={{
              width: "100%",
              maxWidth: 850,
              mx: "auto",
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              sx={{ fontWeight: "bold", color: "text.primary" }}
            >
              Create an Account
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, color: "#777" }}>
              Fill in the details to get started
            </Typography>

            <Box
              component="form"
              id="submit-account-details"
              onSubmit={handleAccountCreation}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                width: "100%",
                boxSizing: "border-box",
                p: { xs: 2, sm: 3, md: 4 },
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 4,
              }}
            >
              {fieldGroups.map((group) => (
                <Box key={group.title}>
                  <Divider
                    textAlign="left"
                    sx={{
                      mb: 2,
                      color: "primary.main",

                      "&::before": {
                        width: 0,
                      },

                      "&::after": {
                        borderColor: "rgba(27, 42, 74, 0.2)",
                      },
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={700}>
                      {group.title}
                    </Typography>
                  </Divider>

                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    {textfieldInstances
                      .filter((field) => group.values.includes(field.value))
                      .map((field) => (
                        <Stack
                          key={field.value}
                          spacing={0.5}
                          sx={{
                            flex: {
                              xs: "1 1 100%",
                              md: "1 1 calc(50% - 8px)",
                            },
                            minWidth: 0,
                          }}
                        >
                          <Typography variant="body2">
                            {field.label}
                            {field.required && " *"}
                          </Typography>

                          <CustomTextField
                            fullWidth
                            type={field.type ?? "text"}
                            placeholder={field.placeholder}
                            required={field.required ?? false}
                            slotProps={{
                              input: {
                                startAdornment: (
                                  <InputAdornment position="start">
                                    {field.icon}
                                  </InputAdornment>
                                ),
                              },
                            }}
                            onChange={(e) => {
                              setUserInfo((prev) => ({
                                ...prev,
                                [field.value]: e.target.value,
                              }));
                            }}
                          />
                        </Stack>
                      ))}

                    {group.title === "Personal Information" && (
                      <Stack
                        spacing={0.5}
                        sx={{
                          flex: {
                            xs: "1 1 100%",
                            md: "1 1 calc(50% - 8px)",
                          },
                          minWidth: 0,
                        }}
                      >
                        <Typography variant="body2">User Type *</Typography>

                        <Select
                          fullWidth
                          required
                          value={userInfo.user_type}
                          onChange={(e) => {
                            setUserInfo((prev) => ({
                              ...prev,
                              user_type: e.target.value,
                            }));
                          }}
                        >
                          <MenuItem value="Student">Student</MenuItem>
                          <MenuItem value="Faculty">Faculty</MenuItem>
                          <MenuItem value="Non-Faculty">Non-Faculty</MenuItem>
                        </Select>
                      </Stack>
                    )}
                  </Box>
                </Box>
              ))}
              <Button
                type="submit"
                fullWidth
                size="large"
                variant="contained"
                disabled={isRegistering}
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
                {isRegistering ? "Creating Account..." : "Create an Account"}
              </Button>
              <Typography align="center" sx={{ width: "100%" }}>
                Already have an account?{" "}
                <Link
                  component={NavLink}
                  to="/login"
                  underline="hover"
                  sx={{ fontWeight: 600, color: "accent.primary" }}
                >
                  Sign In Here
                </Link>
              </Typography>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}

export default Register;
