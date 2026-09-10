import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Box, Snackbar, Alert } from "@mui/material";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import BooksEncode from "./pages/BooksEncode";
function App() {
  const [snackbarOpen, setSnackbarOpen] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState("test");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarAction, setSnackbarAction] = useState(null);
  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        flexDirection: "column",
        bgcolor: "#ececee",
      }}
    >
      <Header />
      <Box sx={{ flex: 1, display: "flex" }}>
        <Sidebar />
        <Routes>
          <Route path="/encodebook" element={<BooksEncode />} />
        </Routes>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        action={snackbarAction}
      >
        <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
      </Snackbar>
    </Box>
  );
}

export default App;
