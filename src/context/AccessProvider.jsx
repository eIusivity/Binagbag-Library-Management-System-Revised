import { createContext, useContext } from "react";
import { authClient } from "../auth/authClient";
import { useAuth } from "../auth/AuthProvider";
import { Box } from "@mui/material";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import StateDialog from "../components/StateDialog";
const AccessContext = createContext(null);

export function AccessProvider({ children }) {
  const { user } = useAuth();

  if (user?.status === "Pending") {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <StateDialog
          icon={<HourglassBottomIcon sx={{ fontSize: 75 }} />}
          title="Registration pending..."
          description="Please await approval by your library staff."
          action={() => authClient.signOut()}
          actionLabel="Sign Out"
        />
      </Box>
    );
  }

  return (
    <AccessContext.Provider value={{ user }}>{children}</AccessContext.Provider>
  );
}

export function useAccess() {
  return useContext(AccessContext);
}
