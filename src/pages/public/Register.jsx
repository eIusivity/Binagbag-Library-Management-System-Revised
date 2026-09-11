import {
  Box,
  Button,
  InputAdornment,
  Typography,
  Stack,
  Select,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { createUser, getUser } from "../../api/usersApi";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import StateDialog from "../../components/StateDialog";
import CustomTextField from "../../components/CustomTextField";
function Register() {
  const [registrationPhase, setRegistrationPhase] = useState("invitation");
  const [userType, setUserType] = useState("Student");
  const [registrationStatus, setRegistrationStatus] = useState("");
  const [userInfo, setUserInfo] = useState({});
  async function handleAccountCreation(e) {
    e.preventDefault();
    const data = await createUser(userInfo);
    const status = await getUser(data.user_record_id);
    setRegistrationStatus(status.status);
    setRegistrationPhase("status");
    console.log(status.status);
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
      label: "Middle Name or Initial",
      placeholder: "e.g. D.C.",
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
      label: "Email (Optional)",
      placeholder: "e.g. juan@gmail.com",
      icon: <EmailIcon sx={{ color: "primary.main" }} />,
      type: "email",
      value: "email",
    },
    {
      label: "Phone (Optional)",
      placeholder: "e.g. 09999999999",
      icon: <LocalPhoneIcon sx={{ color: "primary.main" }} />,
      type: "number",
      value: "phone",
    },
  ];
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        pt: { xs: 4, sm: 6, md: 1 },
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
        <Box
          component="form"
          id="submit-account-details"
          onSubmit={handleAccountCreation}
          sx={{ display: "flex", flexDirection: "column" }}
        >
          <Typography
            align="left"
            variant="h4"
            sx={{ fontWeight: "bold", color: "text.primary" }}
          >
            Create an Account
          </Typography>
          <Typography
            align="left"
            variant="body1"
            sx={{ mb: 2, color: "#777777" }}
          >
            Fill in the details to get started
          </Typography>
          {textfieldInstances.map((field, i) => {
            return (
              <Stack key={i}>
                <Typography>{field.label}</Typography>
                <CustomTextField
                  type={field.type}
                  placeholder={field.placeholder}
                  required={field.required}
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
            );
          })}
          <Typography>Role</Typography>
          <Select
            sx={{
              bgcolor: "accent.secondary",
              color: "text.primary",
              minWidth: 120,
              mb: 2,
            }}
            value={userType}
            onChange={(e) => {
              setUserType(e.target.value);
              setUserInfo((prev) => ({
                ...prev,
                ["user_type"]: e.target.value,
              }));
            }}
          >
            <MenuItem value="Student">Student</MenuItem>
            <MenuItem value="Faculty">Faculty</MenuItem>
            <MenuItem value="Non-Faculty">Non-Faculty</MenuItem>
          </Select>
          <Button
            size="large"
            type="submit"
            id="submit-account-details"
            sx={{ bgcolor: "primary.main", color: "white" }}
          >
            Create an Account
          </Button>
        </Box>
      )}

      {registrationPhase === "status" && (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            pt: { xs: 4, sm: 6, md: 1 },
          }}
        >
          {registrationStatus === "Pending" && (
            <StateDialog
              icon={<HourglassBottomIcon />}
              title={"Registration Complete!"}
              description="Your registration is pending, please wait for the Librarian to approve your request."
            />
          )}
        </Box>
      )}
    </Box>
  );
}

export default Register;
