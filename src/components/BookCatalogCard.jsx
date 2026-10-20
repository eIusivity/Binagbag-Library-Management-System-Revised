import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

function BookCatalogCard({ title, author, bookIcon, available_copies = 0 }) {
  const [imageError, setImageError] = useState(false);
  const isAvailable = Number(available_copies) > 0;

  useEffect(() => {
    setImageError(false);
  }, [bookIcon]);

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        p: 1.5,
        border: "1px solid #D1D5DB",
        borderRadius: 1,
        bgcolor: "white",
        display: "flex",
        flexDirection: "column",
        gap: 0.75,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", mb: 0.5 }}>
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
              alt={title}
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

      <Typography
        title={title}
        noWrap
        sx={{
          fontSize: 18,
          fontWeight: 700,
          textAlign: "center",
        }}
      >
        {title}
      </Typography>

      <Typography title={author} noWrap sx={{ fontSize: 14, color: "#808080" }}>
        {author}
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          mt: "auto",
          px: 0.75,
          py: 0.25,
          borderRadius: 5,
          bgcolor: isAvailable ? "#C5DBCE" : "#E8C7C7",
          color: isAvailable ? "#166534" : "#B91C1C",
        }}
      >
        {isAvailable ? (
          <CheckOutlinedIcon sx={{ fontSize: 16 }} />
        ) : (
          <WarningAmberOutlinedIcon sx={{ fontSize: 16 }} />
        )}

        <Typography sx={{ fontSize: 11, letterSpacing: 0.3 }}>
          {isAvailable
            ? `${available_copies} ${
                Number(available_copies) === 1 ? "Copy" : "Copies"
              } Available`
            : "Unavailable"}
        </Typography>
      </Box>
    </Box>
  );
}

export default BookCatalogCard;
