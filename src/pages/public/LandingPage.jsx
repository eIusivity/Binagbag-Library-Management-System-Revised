import {
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
  Link,
} from "@mui/material";
import Logo from "../../assets/Logo.png";
import { getImageUrl } from "../../api/imageFetcher.js";
import MenuIcon from "@mui/icons-material/Menu";
import { NavLink } from "react-router-dom";
function LandingPage() {
  return (
    <Stack
      sx={{
        flex: 1,
        minHeight: 0,
        display: "flex",
      }}
    >
      <Stack direction="row" sx={{ p: 2, height: 75, alignItems: "center" }}>
        <Stack direction="row" sx={{ flex: 1, height: "100%" }}>
          <Box component="img" src={Logo} sx={{ objectFit: "contain" }} />
        </Stack>
        <Stack
          direction="row"
          sx={{
            display: { xs: "none", md: "flex" },
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button>Browse Catalog</Button>
          <Button>Inquire</Button>
        </Stack>
        <Stack
          direction="row"
          sx={{
            flex: 1,
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Button
            component={NavLink}
            to="/login"
            sx={{ bgcolor: "primary.main", color: "white" }}
          >
            Sign In
          </Button>
          <IconButton sx={{ display: { md: "none" } }}>
            <MenuIcon sx={{ color: "primary.main" }} />
          </IconButton>
        </Stack>
      </Stack>

      <Stack
        direction={{ xs: "column", md: "row" }}
        sx={{ flex: 1, minHeight: 0 }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            p: 2,
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2.5rem", sm: "3.25rem", md: "4rem" },
              fontWeight: "bold",
              color: "primary.main",
            }}
          >
            Your library, always within reach
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: "1.5rem", sm: "2.25rem", md: "2rem" },
              color: "primary.main",
            }}
          >
            Find books, reserve available copies, and keep track of your library
            activity.
          </Typography>
          <Button
            size="large"
            sx={{
              bgcolor: "primary.main",
              color: "white",
              width: { xs: "100%", md: "35%" },
              my: 2,
            }}
          >
            Browse Catalog
          </Button>
        </Box>
        <Box
          sx={{
            flex: 1,
            position: "relative",
            display: "grid",
            placeItems: "center",
            "&::before": {
              content: '""',
              position: "absolute",
              width: { xs: "215px", md: "430px" },
              height: { xs: "215px", md: "430px" },
              borderRadius: "45% 55% 60% 40%",
              bgcolor: "#FFF0E5",
              transform: "rotate(-8deg)",
              zIndex: 0,
            },
          }}
        >
          <Box
            component="img"
            src={getImageUrl("LandingPageCover.webp")}
            sx={{
              width: { xs: "min(210px, 60%)", md: "min(420px, 90%)" },
              position: "relative",
              zIndex: 1,
              filter:
                "invert(13%) sepia(24%) saturate(1819%) hue-rotate(182deg) brightness(89%)",
            }}
          />
        </Box>
      </Stack>
      <Typography align="center" sx={{ width: "100%", py: 4 }}>
        New Here?{" "}
        <Link
          component={NavLink}
          to="/register"
          underline="hover"
          sx={{ color: "accent.primary" }}
        >
          Create An Account
        </Link>
      </Typography>
    </Stack>
  );
}

export default LandingPage;
