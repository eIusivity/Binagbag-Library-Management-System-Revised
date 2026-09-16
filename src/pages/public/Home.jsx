import React from "react";
import { Box, Button } from "@mui/material";
import { authClient } from "../../auth/authClient";
import StateDialog from "../../components/StateDialog";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
function Home() {
  const { data, isPending, error } = authClient.useSession();
  if (isPending) return null;
  if (error || !data?.user) return null;
  const { user } = data;
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        justfyContent: "center",
        alignItems: "center",
      }}
    >
      {user.status === "Pending" && (
        <StateDialog
          icon={<HourglassBottomIcon sx={{ fontSize: 75 }} />}
          title="Registration pending..."
          description="Please await for approval by your library staff."
          action={async () => await authClient.signOut()}
          actionLabel="Sign Out"
        />
      )}
      {user.status === "Active" && (
        <Button onClick={async () => await authClient.signOut()}>
          Sign Out
        </Button>
      )}
    </Box>
  );
}

export default Home;
