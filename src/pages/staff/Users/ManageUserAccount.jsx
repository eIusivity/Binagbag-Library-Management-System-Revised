import React, { useEffect, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Link,
  Typography,
  Stack,
  Button,
} from "@mui/material";
import { NavLink, useParams } from "react-router-dom";
import { authClient } from "../../../auth/authClient";
import CustomTextField from "../../../components/CustomTextField";
function ManageUserAccount() {
  const { id } = useParams();
  const [profile, setProfile] = useState({});
  const [draftProfile, setDraftProfile] = useState({});
  const userInformationFields = [];

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  //ADMINISTRATIVE CONTROLS
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [banReason, setBanReason] = useState("");
  const [banDays, setBanDays] = useState("");
  const [banSaving, setBanSaving] = useState(false);
  const [banError, setBanError] = useState("");
  const [banSuccess, setBanSuccess] = useState("");

  useEffect(() => {
    if (!id) return;

    async function loadUser() {
      const { data, error } = await authClient.admin.getUser({
        query: { id },
      });

      if (error) {
        console.error("Failed to get user:", error);
        return;
      }

      setProfile(data);
      console.log(data);
    }

    loadUser();
  }, [id]);

  useEffect(() => {
    setDraftProfile({
      first_name: profile?.first_name ?? "",
      middle_name: profile?.middle_name ?? "",
      last_name: profile?.last_name ?? "",
    });
    setSaveError("");
    setSaveSuccess("");
  }, [profile]);

  async function saveUserInformation() {
    const first_name = (draftProfile.first_name ?? "").trim();
    const middle_name = (draftProfile.middle_name ?? "").trim();
    const last_name = (draftProfile.last_name ?? "").trim();

    setSaveError("");
    setSaveSuccess("");

    if (!first_name || !last_name) {
      setSaveError("First name and last name are required.");
      return;
    }

    const updatedInformation = {
      first_name,
      middle_name,
      last_name,
      name: [first_name, middle_name, last_name].filter(Boolean).join(" "),
    };

    setSaving(true);

    try {
      const { error } = await authClient.admin.updateUser({
        userId: id,
        data: updatedInformation,
      });

      if (error) {
        setSaveError(error.message || "Failed to update user information.");
        return;
      }

      setProfile((prev) => ({
        ...prev,
        ...updatedInformation,
      }));

      setSaveSuccess("User information updated successfully.");
    } catch (error) {
      setSaveError(error.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }
  async function handleSetPassword() {
    setPasswordError("");
    setPasswordSuccess("");

    if (!profile?.id) return;

    if (!newPassword) {
      setPasswordError("Enter a new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setPasswordSaving(true);

    try {
      const { error } = await authClient.admin.setUserPassword({
        userId: profile.id,
        newPassword,
      });

      if (error) {
        setPasswordError(error.message || "Failed to set password.");
        return;
      }

      setNewPassword("");
      setConfirmPassword("");
      setPasswordSuccess("Password updated successfully.");
    } catch (error) {
      setPasswordError(error.message || "Failed to set password.");
    } finally {
      setPasswordSaving(false);
    }
  }
  async function handleBanUser() {
    setBanError("");
    setBanSuccess("");

    if (!profile?.id) return;

    if (!banReason.trim()) {
      setBanError("Enter a reason for closing this user's account.");
      return;
    }

    const days = Number(banDays);

    if (
      banDays !== "" &&
      (!Number.isFinite(days) || days <= 0 || !Number.isInteger(days))
    ) {
      setBanError("Enter a positive whole number of days, or leave it empty.");
      return;
    }

    setBanSaving(true);

    try {
      const { error } = await authClient.admin.banUser({
        userId: profile.id,
        banReason: banReason.trim(),
        ...(banDays !== "" && {
          banExpiresIn: days * 24 * 60 * 60,
        }),
      });

      if (error) {
        setBanError(error.message || "Failed to ban user.");
        return;
      }

      setProfile((prev) => ({
        ...prev,
        banned: true,
        banReason: banReason.trim(),
      }));

      setBanSuccess("User banned successfully.");
    } catch (error) {
      setBanError(error.message || "Failed to ban user.");
    } finally {
      setBanSaving(false);
    }
  }
  async function handleUnbanUser() {
    setBanError("");
    setBanSuccess("");

    if (!profile?.id) return;

    setBanSaving(true);

    try {
      const { error } = await authClient.admin.unbanUser({
        userId: profile.id,
      });

      if (error) {
        setBanError(error.message || "Failed to unban user.");
        return;
      }

      setProfile((prev) => ({
        ...prev,
        banned: false,
        banReason: null,
        banExpires: null,
        status: "Active",
      }));

      setBanReason("");
      setBanDays("");
      setBanSuccess("User unbanned successfully.");
    } catch (error) {
      setBanError(error.message || "Failed to unban user.");
    } finally {
      setBanSaving(false);
    }
  }
  return (
    <Box sx={{ p: 2 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ my: 0.5, opacity: 0.5 }}>
        <Link component={NavLink} to="/users" underline="hover">
          User
        </Link>
        <Link component={NavLink} to="/users/search" underline="hover">
          View & Search User
        </Link>
        <Link
          component={NavLink}
          to={`/users/${profile?.id}`}
          underline="hover"
        >
          {profile?.name}
        </Link>
        <Link underline="hover">Manage Account</Link>
      </Breadcrumbs>
      <Typography variant="h5" sx={{ fontWeight: 800, color: "primary.main" }}>
        Manage User Account
      </Typography>
      <Typography variant="subtitle1" sx={{ letterSpacing: 2 }}>
        Manage the user's library account.
      </Typography>
      <Stack spacing={2}>
        {/* user information */}
        <Stack sx={{ bgcolor: "white", p: 2 }}>
          <Typography variant="h6">User Information</Typography>
          <Typography>Update the user's library information.</Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            {[
              { field: "first_name", label: "First Name", required: true },
              { field: "middle_name", label: "Middle Name", required: false },
              { field: "last_name", label: "Last Name", required: true },
            ].map(({ field, label, required }) => (
              <CustomTextField
                key={field}
                label={label}
                required={required}
                fullWidth
                disabled={saving || !profile?.id}
                value={draftProfile[field] ?? ""}
                onChange={(e) => {
                  const value = e.target.value;

                  setDraftProfile((prev) => ({
                    ...prev,
                    [field]: value,
                  }));

                  setSaveError("");
                  setSaveSuccess("");
                }}
              />
            ))}

            {saveError && (
              <Typography color="error" variant="body2">
                {saveError}
              </Typography>
            )}

            {saveSuccess && (
              <Typography color="success.main" variant="body2">
                {saveSuccess}
              </Typography>
            )}

            <Button
              variant="contained"
              onClick={saveUserInformation}
              disabled={saving || !profile?.id}
              sx={{ textTransform: "none", alignSelf: "flex-start" }}
            >
              {saving ? "Saving..." : "Save User Information"}
            </Button>
          </Stack>
        </Stack>
        <Stack sx={{ bgcolor: "white", p: 2 }}>
          <Typography variant="h6">Account </Typography>
          <Typography>
            Account controls for the user's library account.
          </Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Typography fontWeight="bold">Set Password</Typography>

            <CustomTextField
              label="New Password"
              type="password"
              autoComplete="new-password"
              fullWidth
              required
              value={newPassword}
              disabled={passwordSaving || !profile?.id}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setPasswordError("");
                setPasswordSuccess("");
              }}
            />

            <CustomTextField
              label="Confirm New Password"
              type="password"
              autoComplete="new-password"
              fullWidth
              required
              value={confirmPassword}
              disabled={passwordSaving || !profile?.id}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setPasswordError("");
                setPasswordSuccess("");
              }}
            />

            {passwordError && (
              <Typography color="error" variant="body2">
                {passwordError}
              </Typography>
            )}

            {passwordSuccess && (
              <Typography color="success.main" variant="body2">
                {passwordSuccess}
              </Typography>
            )}

            <Button
              variant="contained"
              onClick={handleSetPassword}
              disabled={passwordSaving || !profile?.id}
              sx={{ alignSelf: "flex-start", textTransform: "none" }}
            >
              {passwordSaving ? "Saving..." : "Set Password"}
            </Button>

            <Typography fontWeight="bold" sx={{ pt: 2 }}>
              {profile?.banned ? "Reopen Account" : "Close Account"}
            </Typography>

            {!profile?.banned && (
              <>
                <CustomTextField
                  label="Account Closing Reason"
                  fullWidth
                  required
                  multiline
                  minRows={2}
                  value={banReason}
                  disabled={banSaving || !profile?.id}
                  onChange={(e) => {
                    setBanReason(e.target.value);
                    setBanError("");
                    setBanSuccess("");
                  }}
                />

                <CustomTextField
                  label="Close Duration (Days)"
                  type="number"
                  fullWidth
                  helperText="Leave empty for a permanent account close."
                  value={banDays}
                  disabled={banSaving || !profile?.id}
                  onChange={(e) => {
                    setBanDays(e.target.value);
                    setBanError("");
                    setBanSuccess("");
                  }}
                />
              </>
            )}

            {banError && (
              <Typography color="error" variant="body2">
                {banError}
              </Typography>
            )}

            {banSuccess && (
              <Typography color="success.main" variant="body2">
                {banSuccess}
              </Typography>
            )}

            <Button
              variant="contained"
              color={profile?.banned ? "success" : "error"}
              onClick={profile?.banned ? handleUnbanUser : handleBanUser}
              disabled={banSaving || !profile?.id}
              sx={{ alignSelf: "flex-start", textTransform: "none" }}
            >
              {banSaving
                ? "Processing..."
                : profile?.banned
                  ? "Unban User / Reopen Account"
                  : "Close User Account"}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}

export default ManageUserAccount;
