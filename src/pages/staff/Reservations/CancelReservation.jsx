import React from "react";
import { useEffect, useState } from "react";
import {
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import ReservationCancelProductCard from "../../../components/ReservationCancelProductCard";
import { formatDateTime } from "../../../components/formatDateTime";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CustomTextField from "../../../components/CustomTextField";
import { NavLink } from "react-router-dom";
import { getReservations } from "../../../api/reservationApi";
import { getUserByLibraryID } from "../../../api/usersApi";
import { getBook } from "../../../api/booksApi";
import StateDialog from "../../../components/StateDialog";
import { useAuth } from "../../../auth/AuthProvider";
import FilterNoneIcon from "@mui/icons-material/FilterNone";
import { cancelReservation } from "../../../api/reservationApi";
function CancelReservation() {
  const [records, setRecords] = useState([]);
  const { user: librarian } = useAuth();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [paginationCount, setPaginationCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [dialog, setDialog] = useState("");
  const [selectedRecord, setSelectedRecord] = useState("");
  const [deleteMagicWord, setDeleteMagicWord] = useState("");
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [transactionOngoing, setTransactionOngoing] = useState(false);
  async function handleTransaction() {
    try {
      const data = await cancelReservation(selectedRecord.reservationId);

      setTransactionDetails(data.message);
      setDialog("reserve cancelled");
      await loadBooks();
    } catch (error) {
      setTransactionDetails(error.message);
    } finally {
      setTransactionOngoing(false);
    }
  }
  function handleCancel(reservationId) {
    setSelectedRecord(
      records.find((record) => record.reservationId === reservationId),
    );
    setDialog("cancel");
  }
  async function loadBooks() {
    try {
      const reservationRecords = await getReservations(search, page);

      const packagedRecords = await Promise.all(
        reservationRecords.records
          .filter(
            (record) => !["Picked Up", "Cancelled"].includes(record.status),
          )
          .map(async (record) => {
            const [userResponse, bookResponse] = await Promise.all([
              getUserByLibraryID(record.library_id),
              getBook(record.book_id),
            ]);

            return {
              reservationId: record.reservation_id,
              reserveeName: userResponse.user.name,
              libraryId: record.library_id,
              bookTitle: bookResponse.title,
              bookIcon: null,
              bookId: record.book_id,
              status: record.status,
              readyDate: record.ready_date,
              expiryDate: record.expiry_date,
            };
          }),
      );

      setRecords(packagedRecords);
      setPaginationCount(reservationRecords.totalPages);

      console.log(packagedRecords);
    } catch (error) {
      console.error("Failed to load reservations:", error);
    }
  }
  useEffect(() => {
    loadBooks();
  }, [search, page]);
  return (
    <>
      <Dialog open={dialog === "cancel"} onClose={() => setDialog("")}>
        <DialogTitle>
          <Typography sx={{ fontWeight: "bold" }}>
            Cancel a Reservation
          </Typography>
          <Typography sx={{ opacity: 0.7 }}>
            Are you sure you want to cancel this reservation?
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <ReservationCancelProductCard
              reserveeName={selectedRecord.reserveeName}
              libraryId={selectedRecord.libraryId}
              bookTitle={selectedRecord.bookTitle}
              bookIcon={selectedRecord.bookIcon}
              bookId={selectedRecord.bookId}
              status={selectedRecord.status}
              readyDate={formatDateTime(selectedRecord.readyDate)}
              expiryDate={formatDateTime(selectedRecord.expiryDate)}
            />
          )}
          <Box sx={{ bgcolor: "#b52e2e60", p: 2, borderRadius: 4 }}>
            <Typography sx={{ color: "#b52e2e" }}>
              Cancelling this reservation will remove the patron from the queue.
              Are you sure?
            </Typography>
          </Box>
          <Typography sx={{ fontWeight: "bold", py: 1 }}>
            To confirm, type "cancel" below
          </Typography>
          <CustomTextField
            fullWidth
            placeholder="Enter the magic word here..."
            onChange={(e) => setDeleteMagicWord(e.target.value.toLowerCase())}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog("")}>Cancel</Button>
          <Button
            disabled={deleteMagicWord !== "cancel" || transactionOngoing}
            onClick={() => {
              setTransactionOngoing(true);
              handleTransaction();
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={dialog === "reserve cancelled"}
        onClose={() => setDialog("")}
      >
        <DialogTitle>
          <Typography sx={{ fontWeight: "bold" }}>
            Cancel a Reservation
          </Typography>
          <Typography sx={{ opacity: 0.7 }}></Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ bgcolor: "#b52e2e60", p: 2, borderRadius: 4 }}>
            <Typography sx={{ fontWeight: "bold", color: "#b52e2e" }}>
              {transactionDetails}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog("")}>Done</Button>
        </DialogActions>
      </Dialog>
      <Box sx={{ p: 2, display: "flex", flex: 1, flexDirection: "column" }}>
        <ListItemButton
          component={NavLink}
          to="/reservations"
          sx={{ display: "flex", color: "primary.main", alignItems: "center" }}
        >
          <ListItemIcon>
            <ArrowBackIcon sx={{ color: "primary.main" }} />
          </ListItemIcon>
          <ListItemText primary="Back to Reservations" />
        </ListItemButton>
        <Typography
          variant="h5"
          sx={{ fontWeight: 800, color: "primary.main" }}
        >
          Cancel a Reservation
        </Typography>
        <CustomTextField
          placeholder="Search by patron's library id or the book's id..."
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {records.length === 0 && (
            <StateDialog
              title="No reservations to cancel."
              icon={<FilterNoneIcon />}
            />
          )}
          {records.map((record) => (
            <ReservationCancelProductCard
              key={record.reservationId}
              reserveeName={record.reserveeName}
              libraryId={record.libraryId}
              bookTitle={record.bookTitle}
              bookIcon={record.bookIcon}
              bookId={record.bookId}
              status={record.status}
              readyDate={formatDateTime(record.readyDate)}
              expiryDate={formatDateTime(record.expiryDate)}
              onClick={() => handleCancel(record.reservationId)}
            />
          ))}
        </Box>
      </Box>
    </>
  );
}

export default CancelReservation;
