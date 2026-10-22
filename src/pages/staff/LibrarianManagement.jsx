import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import CustomTextField from "../../components/CustomTextField";
import { getUserByLibraryID } from "../../api/usersApi";
import { authClient } from "../../auth/authClient";
function LibrarianManagement() {
  const [dialog, setDialog] = useState("");
  const [lmsId, setLmsId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [librarians, setLibrarians] = useState([]);
  async function loadLibrarians() {
    try {
      const { data, error } = await authClient.admin.listUsers({
        query: {
          filterField: "role",
          filterValue: "Librarian",
          filterOperator: "eq",
        },
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setLibrarians(data?.users ?? []);
    } catch (error) {
      setErrorMessage(error.message || "Failed to load librarians.");
    }
  }
  async function handleAssignation(e) {
    e.preventDefault();
    setErrorMessage("");
    try {
      const selectedUser = await getUserByLibraryID(lmsId.trim());
      if (!selectedUser?.user) {
        return setErrorMessage("User not found.");
      }
      const { error } = await authClient.admin.setRole({
        userId: selectedUser.user.id,
        role: "Librarian",
      });
      if (error) {
        setErrorMessage(error.message);
        return;
      }
      setDialog("");
      setLmsId("");
      await loadLibrarians();
    } catch (error) {
      setErrorMessage(error.message || "Failed to assign librarian.");
    }
  }
  useEffect(() => {
    loadLibrarians();
  }, []);
  return (
    <>
      <Dialog
        component="form"
        onSubmit={(e) => handleAssignation(e)}
        open={dialog === "assign"}
        onClose={() => setDialog("")}
      >
        <DialogTitle>Assign a new Librarian</DialogTitle>
        <DialogContent>
          <Typography>
            Type the Library ID of the user to assign them the Librarian role.
          </Typography>

          <CustomTextField
            fullWidth
            placeholder="Library ID here..."
            required
            value={lmsId}
            onChange={(e) => setLmsId(e.target.value)}
          />
          {errorMessage.trim() && <Typography>{errorMessage}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={() => setDialog("")}>
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            sx={{ bgcolor: "accent.primary" }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Box
        sx={{ p: 2, display: "flex", flex: 1, flexDirection: "column", gap: 2 }}
      >
        <Stack direction="row">
          <Stack sx={{ flex: 1 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, color: "primary.main" }}
            >
              Librarian Management
            </Typography>
            <Typography variant="subtitle1" sx={{ letterSpacing: 2 }}>
              Assign and manage librarian access to the system.
            </Typography>
          </Stack>
          <Button
            onClick={() => setDialog("assign")}
            variant="contained"
            sx={{ bgcolor: "accent.primary" }}
          >
            + Assign Librarian
          </Button>
        </Stack>
        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Library ID</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {librarians.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No librarians found.
                  </TableCell>
                </TableRow>
              ) : (
                librarians.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.library_id || "—"}</TableCell>
                    <TableCell>{user.email || "—"}</TableCell>
                    <TableCell>—</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

export default LibrarianManagement;
