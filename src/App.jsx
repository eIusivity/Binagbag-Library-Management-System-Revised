import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Box, Snackbar, Alert, Button } from "@mui/material";
import PublicLayout from "./layout/PublicLayout";
import StaffLayout from "./layout/StaffLayout";
import BooksEncode from "./pages/staff/BooksEncode";
import Register from "./pages/public/Register";
function App() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarAction, setSnackbarAction] = useState(null);
  const [role, setRole] = useState("patron");
  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: 8,
          right: 8,
          zIndex: 9999,
          bgcolor: "white",
        }}
      >
        <Button onClick={() => setRole("patron")}>Patron</Button>

        <Button onClick={() => setRole("librarian")}>Librarian</Button>
      </Box>
      <Routes>
        {role === "patron" ? (
          <Route element={<PublicLayout />}>
            <Route path="/register" element={<Register />} />
          </Route>
        ) : (
          <Route element={<StaffLayout />}>
            <Route path="/encodebook" element={<BooksEncode />} />
          </Route>
        )}
      </Routes>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        action={snackbarAction}
      >
        <Alert
          severity={snackbarSeverity}
          onClose={() => setSnackbarOpen(false)}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default App;
