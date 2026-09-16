import React from "react";
import { Button } from "@mui/material";
import { authClient } from "../../auth/authClient";
function Dashboard() {
  return (
    <Button onClick={async () => await authClient.signOut()}>Signout</Button>
  );
}

export default Dashboard;
