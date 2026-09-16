import { Box, Typography, Button } from "@mui/material";

function StateDialog({ icon, title, description, action, actionLabel }) {
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 1,
      }}
    >
      <Box sx={{ color: "accent.primary" }}>{icon}</Box>
      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
        {title}
      </Typography>
      <Typography sx={{ color: "#777777" }}>{description}</Typography>
      {action && (
        <Button
          sx={{
            width: "25%",
            p: 2,
            bgcolor: "primary.main",
            color: "background.default",
          }}
          onClick={() => action()}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}

export default StateDialog;
