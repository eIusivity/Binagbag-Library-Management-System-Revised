import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { socket } from "./socket.js";
import { HashRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { AccessProvider } from "./context/AccessProvider.jsx";
import App from "./App.jsx";
import theme from "./theme/theme";
import { AuthProvider } from "./auth/AuthProvider.jsx";
import { SnackbarProvider } from "./components/SnackbarProvider.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter>
        <AuthProvider>
          <SnackbarProvider>
            <AccessProvider>
              <App />
            </AccessProvider>
          </SnackbarProvider>
        </AuthProvider>
      </HashRouter>
    </ThemeProvider>
  </StrictMode>,
);
