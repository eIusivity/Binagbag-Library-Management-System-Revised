import { Stack, Typography, InputAdornment } from "@mui/material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import SearchIcon from "@mui/icons-material/Search";
import CustomTextField from "../CustomTextField";
function Scanner({ title, value, onChange, onSubmit, placeholder, error }) {
  return (
    <Stack
      sx={{
        alignItems: "center",
        gap: 2,
        width: "100%",
      }}
    >
      <QrCodeScannerIcon sx={{ fontSize: 128, color: "primary.main" }} />

      <Typography sx={{ fontWeight: 800 }}>{title}</Typography>

      <Typography color="primary.main">OR</Typography>

      <CustomTextField
        fullWidth
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSubmit();
        }}
        sx={{ maxWidth: 600 }}
        placeholder={placeholder}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
      />

      {error && <Typography color="error">{error}</Typography>}
    </Stack>
  );
}
export default Scanner;
