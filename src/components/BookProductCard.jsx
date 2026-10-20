import {
  Box,
  Typography,
  Chip,
  Card,
  CardContent,
  CardActionArea,
} from "@mui/material";

import AutoStoriesIcon from "@mui/icons-material/AutoStories";

function BookProductCard({ title, author, genre, available_copies, onClick }) {
  const available = Number(available_copies) || 0;

  return (
    <Card
      elevation={1}
      sx={{
        flex: "0 0 calc(50% - 8px)",
        height: 115,
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <CardActionArea
        onClick={onClick}
        sx={{
          height: "100%",
        }}
      >
        <CardContent
          sx={{
            height: "100%",
            p: 1.5,
            "&:last-child": {
              pb: 1.5,
            },
            display: "flex",
            flexDirection: "column",
            gap: 1,
            boxSizing: "border-box",
          }}
        >
          {/* Book information */}
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              gap: 1.5,
            }}
          >
            {/* Book cover placeholder */}
            <Box
              sx={{
                width: 62,
                minWidth: 62,
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "grey.500",
                borderRadius: 2,
              }}
            >
              <AutoStoriesIcon
                sx={{
                  fontSize: 26,
                  color: "grey.800",
                }}
              />
            </Box>

            {/* Text */}
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 0.25,
              }}
            >
              <Typography
                fontSize={16}
                fontWeight={600}
                lineHeight={1.2}
                noWrap
                title={title ?? "No Title Found"}
                sx={{
                  width: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {title ?? "No Title Found"}
              </Typography>

              <Typography
                fontSize={14}
                color="text.secondary"
                noWrap
                title={author ?? "No Author Found"}
                sx={{
                  width: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {author ?? "No Author Found"}
              </Typography>

              <Typography
                fontSize={13}
                color="text.secondary"
                noWrap
                title={genre ?? "No Genre Found"}
                sx={{
                  width: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {genre ?? "No Genre Found"}
              </Typography>
            </Box>
          </Box>

          {/* Availability */}
          <Chip
            size="small"
            label={
              available > 0
                ? `${available} ${available === 1 ? "Copy" : "Copies"} Available`
                : "Unavailable"
            }
            color={available > 0 ? "success" : "error"}
            sx={{
              width: "100%",
              height: 24,
              fontSize: 12,
              fontWeight: 500,
            }}
          />
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default BookProductCard;
