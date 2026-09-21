import {
  Box,
  Breadcrumbs,
  Link,
  Typography,
  InputAdornment,
  Stack,
  Card,
  CardContent,
  CardMedia,
  Pagination,
} from "@mui/material";
import StateDialog from "../../../components/StateDialog";
import { NavLink } from "react-router-dom";
import CustomTextField from "../../../components/CustomTextField";
import SearchIcon from "@mui/icons-material/Search";
import PeopleIcon from "@mui/icons-material/People";
import { useEffect, useState } from "react";
import { authClient } from "../../../auth/authClient";
import HelpIcon from "@mui/icons-material/Help";
import AccountCircleTwoToneIcon from "@mui/icons-material/AccountCircleTwoTone";
import { CircularProgress } from "@mui/material";
function UserSearch() {
  const [prompt, setPrompt] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginationCount, setPaginationCount] = useState(0);
  const [paginationOffset, setPaginationOffset] = useState(0);
  useEffect(() => {
    let ignore = false;
    async function fetchUsers() {
      if (prompt.trim().length === 0) {
        setUserResults([]);
        return;
      }
      const { data: users } = await authClient.admin.listUsers({
        query: {
          searchValue: prompt,
          searchField: "name",
          searchOperator: "contains",
          offset: paginationOffset,
          limit: 9,
          sortBy: "name",
          sortDirection: "desc",
        },
      });
      if (ignore) return;
      setUserResults(users?.users ?? []);
      setPaginationCount(Math.ceil(users.total / 9));
    }
    fetchUsers();
    return () => {
      ignore = true;
    };
  }, [prompt, paginationOffset]);
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0, // VERY important inside flex layouts
        width: "100%",
        p: 2,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Breadcrumbs aria-label="breadcrumb" sx={{ my: 0.5, opacity: 0.5 }}>
        <Link component={NavLink} to="/users" underline="hover">
          User
        </Link>
        <Link component={NavLink} to="/users/search" underline="hover">
          View & Search User
        </Link>
      </Breadcrumbs>
      <Typography variant="h5" sx={{ fontWeight: 800, color: "primary.main" }}>
        View & Search Users
      </Typography>
      <Typography variant="subtitle1" sx={{ letterSpacing: 2 }}>
        Search registered users in the library.
      </Typography>
      <CustomTextField
        fullWidth
        debounce
        placeholder="Search by name..."
        sx={{
          mt: 2,
          "& .MuiOutlinedInput-root": {
            bgcolor: "#FFFFFF",
            borderRadius: 2,
          },
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "primary.main" }} />
              </InputAdornment>
            ),
          },
        }}
        onChange={(e) => {
          setPrompt(e.target.value);
        }}
      />
      <Stack
        direction="row"
        spacing={2}
        useFlexGap
        sx={{
          flex: 1,
          py: 2,

          // Important
          width: "100%",
          minWidth: 0,
          flexWrap: "wrap",
          justifyContent: "center",
          alignContent: "flex-start",
        }}
      >
        {prompt.trim().length === 0 && (
          <StateDialog
            icon={<PeopleIcon sx={{ fontSize: 85 }} />}
            title="Begin searching by typing in the textfield above"
            description="User results will display in the form of a card."
          />
        )}

        {loading && (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {prompt.trim().length > 0 && !loading && userResults.length === 0 && (
          <StateDialog
            icon={<HelpIcon sx={{ fontSize: 85 }} />}
            title="No users found"
            description="Try using a different keyword instead."
          />
        )}

        {prompt.trim().length > 0 &&
          !loading &&
          userResults.map((user) => {
            const isOnline = user.online ?? false;

            return (
              <Card
                key={user.id}
                variant="outlined"
                sx={{
                  width: 320,
                  maxWidth: "100%",
                  height: 110,
                  flexShrink: 0,

                  display: "flex",
                  alignItems: "center",
                  px: 2,

                  borderRadius: 2,
                  bgcolor: "#FFFFFF",
                  borderColor: "divider",
                  boxShadow: "none",
                  cursor: "pointer",

                  "&:hover": {
                    borderColor: "primary.main",
                    boxShadow: "0 3px 12px rgba(0, 0, 0, 0.06)",
                  },
                }}
              >
                {/* Generic profile */}
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    flexShrink: 0,
                    borderRadius: "50%",
                    bgcolor: "#F1F3F6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <AccountCircleTwoToneIcon
                    sx={{
                      width: 70,
                      height: 70,
                      color: "text.disabled",
                    }}
                  />
                </Box>

                {/* User info */}
                <CardContent
                  sx={{
                    py: 0,
                    px: 2,
                    "&:last-child": {
                      pb: 0,
                    },
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 700,
                      color: "primary.main",
                      lineHeight: 1.4,
                    }}
                  >
                    {user.name}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mt: 0.5 }}
                  >
                    <Box
                      sx={{
                        width: 9,
                        height: 9,
                        borderRadius: "50%",
                        bgcolor: isOnline ? "success.main" : "text.disabled",
                      }}
                    />

                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                      }}
                    >
                      {isOnline ? "Online" : "Offline"}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
      </Stack>
      <Pagination
        count={paginationCount}
        variant="outlined"
        shape="rounded"
        color="primary"
        sx={{ display: paginationCount === 0 ? "none" : "block" }}
        onChange={(e, page) => setPaginationOffset((page - 1) * 9)}
      />
    </Box>
  );
}
export default UserSearch;
