import { Box, Card, Typography, Avatar, Chip, Button } from "@mui/material";
import { useState } from "react";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
function ReservationProductCard({
  reserveeName,
  libraryId,
  bookTitle,
  bookIcon,
  bookId,
  readyDate,
  expiryDate,
  status,
  onClick,
}) {
  const [imageError, setImageError] = useState(false);
  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 2,
        gap: 3,
        borderRadius: 2,
        bgcolor: "white",
        boxShadow: "none",
        minWidth: 500,
        flexShrink: 0,
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Avatar
          sx={{
            width: 72,
            height: 72,
            bgcolor: "#E5E7EB",
            color: "#2563EB",
            flexShrink: 0,
          }}
        >
          <PersonOutlinedIcon sx={{ fontSize: 40 }} />
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
            {reserveeName}
          </Typography>

          <Typography color="text.secondary" variant="body2">
            {libraryId}
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Typography sx={{ fontWeight: 700 }} noWrap title={bookTitle}>
              {bookTitle}
            </Typography>

            <Typography variant="body2">Copy ID: {bookId}</Typography>

            <Typography variant="body2">Ready: {readyDate}</Typography>

            <Typography variant="body2">Pickup By: {expiryDate}</Typography>
          </Box>
        </Box>

        <Box
          sx={{
            width: 90,
            height: 140,
            flexShrink: 0,
            alignSelf: "flex-start",
            bgcolor: "#E5E7EB",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {!bookIcon || imageError ? (
            <AutoStoriesOutlinedIcon sx={{ fontSize: 40, color: "#9CA3AF" }} />
          ) : (
            <Box
              component="img"
              src={bookIcon}
              alt={bookTitle}
              onError={() => setImageError(true)}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        {status === "Ready" && (
          <Chip
            label="Ready for Pickup"
            sx={{
              bgcolor: "#CFF5CE",
              color: "#008000",
              fontWeight: 500,
              fontSize: 14,
            }}
          />
        )}
        {status === "Waiting" && (
          <Chip
            label="Waiting"
            sx={{
              bgcolor: "#edf5ce",
              color: "#738000",
              fontWeight: 500,
              fontSize: 14,
            }}
          />
        )}

        <Button
          variant="contained"
          onClick={onClick}
          startIcon={<DeleteOutlinedIcon />}
          sx={{
            bgcolor: "#ffcfcf",
            color: "#ff0000",
            textTransform: "none",
            boxShadow: "none",
            borderRadius: 2,
            px: 4,
            py: 1,
            fontSize: 16,
            fontWeight: 500,
            "&:hover": {
              bgcolor: "#B8D0FF",
              boxShadow: "none",
            },
          }}
        >
          Cancel
        </Button>
      </Box>
    </Card>
  );
}

export default ReservationProductCard;
