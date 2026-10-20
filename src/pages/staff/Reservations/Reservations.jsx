import { useState, useEffect } from "react";
import EventIcon from "@mui/icons-material/Event";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  Typography,
  Stack,
  Button,
  Table,
  TableContainer,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Pagination,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { getReservations } from "../../../api/reservationApi";
function Reservations() {
  const [reservationRecords, setReservationRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  async function loadReservations() {
    try {
      const result = await getReservations("", page);

      setReservationRecords(
        result.records.filter((record) =>
          ["Waiting", "Ready"].includes(record.status),
        ),
      );

      setPageCount(result.totalPages);
    } catch (error) {
      console.error("Failed to load reservations:", error);
    }
  }
  useEffect(() => {
    loadReservations();
  }, [page]);
  const buttonContents = [
    {
      label: "Create a Reservation",
      sublabel: "Reserve a book for a patron.",
      icon: <ArrowForwardIcon sx={{ color: "#243eb2" }} />,
      color: "#243eb2",
      buttonLabel: "Start Creating",
      to: "/reservations/create",
    },
    {
      label: "Fulfill a Reservation",
      sublabel:
        "Mark reservations that already got their books picked up as successful",
      icon: <ArrowBackIcon sx={{ color: "#34c826" }} />,
      color: "#34c826",
      buttonLabel: "Start Fulfilling",
      to: "/reservations/fulfill",
    },
    {
      label: "Cancel a Reservation",
      sublabel: "Cancel an ongoing reservation",
      icon: <ArrowBackIcon sx={{ color: "#d01010" }} />,
      color: "#d01010",
      buttonLabel: "Start Cancellations",
      to: "/reservations/cancel",
    },
  ];
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 800, color: "primary.main" }}>
        Reservations
      </Typography>
      <Typography variant="subtitle1" sx={{ letterSpacing: 2 }}>
        Process reservation queues, and fulfill or cancel them.
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
                <EventIcon sx={{ color: button.color }} />
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
                Active Reservations
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
            {reservationRecords.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No reservation records found.
                </TableCell>
              </TableRow>
            )}
            {reservationRecords.length > 0 &&
              reservationRecords.map((record) => {
                console.log(record);
                return (
                  <TableRow key={record.reservation_id}>
                    <TableCell>{record.library_id}</TableCell>
                    <TableCell>{record.book_id}</TableCell>
                    <TableCell>{record.status}</TableCell>
                    <TableCell>
                      {new Date(
                        record.return_date ?? record.reservation_date,
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

export default Reservations;
