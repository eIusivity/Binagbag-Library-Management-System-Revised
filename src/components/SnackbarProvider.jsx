import { Snackbar, Alert } from "@mui/material";
import { useState, createContext, useContext } from "react";
import { socket } from "../socket";
import { useAuth } from "../auth/AuthProvider";
const SnackbarContext = createContext(null);

export function SnackbarProvider({ children }) {
  const { user } = useAuth();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarTitle, setSnackbarTitle] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarAction, setSnackbarAction] = useState(null);

  function triggerSnackbar({
    title,
    content,
    severity = "success",
    action = null,
  }) {
    setSnackbarOpen(true);
    setSnackbarTitle(title);
    setSnackbarMessage(content);
    setSnackbarSeverity(severity);
    setSnackbarAction(action);
  }
  return (
    <SnackbarContext.Provider value={{ triggerSnackbar }}>
      {children}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        action={snackbarAction}
        sx={{
          display: "inline",
          position: "absolute",
          zIndex: 999,
          bottom: "25%",
          left: "15%",
        }}
      >
        <Alert
          severity={snackbarSeverity}
          onClose={() => setSnackbarOpen(false)}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  return useContext(SnackbarContext);
}
