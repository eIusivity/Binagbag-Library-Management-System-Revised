import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
  Pagination,
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { NavLink } from "react-router-dom";
import { getLoans } from "../../../api/loansApi";
function Loans() {
  const [loanRecords, setLoanRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  async function loadLoans() {
    const result = await getLoans("", page);
    if (result.data) {
      setLoanRecords(result.data);
      setPageCount(result.totalPages);
    }
  }
  useEffect(() => {
    loadLoans();
  }, [page]);
  const buttonContents = [
    {
      label: "Borrow Book",
      sublabel: "Issue books to a registered library user",
      icon: <ArrowForwardIcon sx={{ color: "#243eb2" }} />,
      color: "#243eb2",
      buttonLabel: "Start Borrowing",
      to: "/loans/borrow",
    },
    {
      label: "Return Book",
      sublabel: "Process books returned by a registered library user",
      icon: <ArrowBackIcon sx={{ color: "#34c826" }} />,
      color: "#34c826",
      buttonLabel: "Start Returning",
      to: "/loans/return",
    },
  ];
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 800, color: "primary.main" }}>
        Loans
      </Typography>
      <Typography variant="subtitle1" sx={{ letterSpacing: 2 }}>
        Process book borrows or book returns.
      </Typography>
      <Stack spacing={2} sx={{ mb: 2 }}>
        {buttonContents.map((button) => {
          return (
            <Button
              component={NavLink}
              to={button.to}
              size="lg"
              sx={{
                display: "flex",
                bgcolor: "white",
                border: "1 px solid rgba(0,0,0,0.18)",
                justifyContent: "flex-start",
                gap: 2,
              }}
            >
              <Stack
                direction="row"
                sx={{ bgcolor: `${button.color}50`, p: 3, borderRadius: 2 }}
              >
                <MenuBookIcon sx={{ color: button.color }} />
                {button.icon}
              </Stack>
              <Stack>
                <Typography align="left" sx={{ fontWeight: 800 }}>
                  {button.label}
                </Typography>
                <Typography>{button.sublabel}</Typography>
              </Stack>
              <Stack
                sx={{
                  flex: 1,
                  alignItems: "flex-end",
                }}
              >
                <Button
                  sx={{ bgcolor: "black", color: "white", borderRadius: 2 }}
                >
                  {button.buttonLabel}
                </Button>
              </Stack>
            </Button>
          );
        })}
      </Stack>
      <TableContainer>
        <Table sx={{ bgcolor: "white" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 800 }}>
                Recent Transactions
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 800 }}>Patron</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Book</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Operation</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Date & Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ minHeight: 300 }}>
            {loanRecords.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No loan records found.
                </TableCell>
              </TableRow>
            )}
            {loanRecords.length > 0 &&
              loanRecords.map((record) => {
                console.log(record);
                return (
                  <TableRow key={record.loan_id}>
                    <TableCell>{record.library_id}</TableCell>
                    <TableCell>{record.copy_id}</TableCell>
                    <TableCell>
                      {record.return_date ? "Return" : "Borrow"}
                    </TableCell>
                    <TableCell>{record.status}</TableCell>
                    <TableCell>
                      {new Date(
                        record.return_date ?? record.borrow_date,
                      ).toLocaleString("en-PH", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        <Pagination
          count={pageCount}
          page={page}
          variant="outlined"
          shape="rounded"
          color="primary"
          sx={{
            display: pageCount === 0 ? "none" : "block",
          }}
          onChange={(e, selectedPage) => setPage(selectedPage)}
        />
      </TableContainer>
    </Box>
  );
}

export default Loans;
