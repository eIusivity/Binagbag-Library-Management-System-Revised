import { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Typography,
  Stack,
  Chip,
  Button,
  Pagination,
} from "@mui/material";
import { authClient } from "../../../auth/authClient";
import { NavLink } from "react-router-dom";
function PendingUserLanding() {
  const [prompt, setPrompt] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginationCount, setPaginationCount] = useState(0);
  const [paginationOffset, setPaginationOffset] = useState(0);
  useEffect(() => {
    let ignore = false;

    async function fetchUsers() {
      const search = prompt.trim();

      const { data: users, error } = await authClient.admin.listUsers({
        query: {
          ...(search && {
            searchValue: search,
            searchField: "name",
            searchOperator: "contains",
          }),
          offset: paginationOffset,
          limit: 6,
          sortBy: "name",
          sortDirection: "desc",
          filterField: "status",
          filterValue: "Pending",
          filterOperator: "eq",
        },
      });

      if (ignore) return;

      if (error) {
        console.error(error);
        setUserResults([]);
        setPaginationCount(0);
        return;
      }

      setUserResults(users?.users ?? []);
      setPaginationCount(Math.ceil((users?.total ?? 0) / 6));
    }

    fetchUsers();

    return () => {
      ignore = true;
    };
  }, [prompt, paginationOffset]);
  return (
    <Box sx={{ p: 2, display: "flex", flex: 1, flexDirection: "column" }}>
      <Typography variant="h5" sx={{ fontWeight: 800, color: "primary.main" }}>
        Pending Users
      </Typography>
      <Typography variant="subtitle1" sx={{ letterSpacing: 2 }}>
        Manage pending user registrations.
      </Typography>
      <Stack sx={{ bgcolor: "white", p: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>User Type</TableCell>
                <TableCell>Creation Date</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userResults.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No pending users found.
                  </TableCell>
                </TableRow>
              ) : (
                userResults.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.user_type}
                        color={
                          user.user_type === "Student"
                            ? "info"
                            : user.user_type === "Faculty"
                              ? "warning"
                              : user_type === "Non-Faculty" && "success"
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <Button
                        component={NavLink}
                        to={`/pendingUserDetails/${user.id}`}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          count={paginationCount}
          variant="outlined"
          shape="rounded"
          color="primary"
          sx={{ display: paginationCount === 0 ? "none" : "block" }}
          onChange={(e, page) => setPaginationOffset((page - 1) * 6)}
        />
      </Stack>
    </Box>
  );
}

export default PendingUserLanding;
