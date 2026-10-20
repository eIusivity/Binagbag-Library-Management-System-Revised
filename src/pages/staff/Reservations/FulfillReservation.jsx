import React, { useEffect, useState } from "react";
import { formatDateTime } from "../../../components/formatDateTime";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Stack,
  Button,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../../auth/AuthProvider";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CustomTextField from "../../../components/CustomTextField";
import StateDialog from "../../../components/StateDialog";
import FilterNoneIcon from "@mui/icons-material/FilterNone";
import {
  fulfillReservation,
  getReservations,
} from "../../../api/reservationApi";
import ReservationProductCard from "../../../components/ReservationProductCard";
import { getUserByLibraryID } from "../../../api/usersApi";
import { getBook } from "../../../api/booksApi";
import { createLoans } from "../../../api/loansApi";
import { getBookCopies } from "../../../api/bookCopiesApi";
function FulfillReservation() {
  const { user: librarian } = useAuth();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [paginationCount, setPaginationCount] = useState(0);
  const [records, setRecords] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [dialog, setDialog] = useState("");
  const [selectedRecord, setSelectedRecord] = useState("");
  const [fulfillMagicWord, setFulfillMagicWord] = useState("");
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [transactionOngoing, setTransactionOngoing] = useState(false);
  async function loadBooks() {
    try {
      const reservationRecords = await getReservations(search, page);

      const packagedRecords = await Promise.all(
        reservationRecords.records
          .filter((record) => record.status === "Ready")
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
  async function handleFulfill(reservationId) {
    setSelectedRecord(
      records.find((record) => record.reservationId === reservationId),
    );
    console.log(
      records.find((record) => record.reservationId === reservationId),
    );
    setDialog("fulfill");
  }
  async function handleTransaction() {
    const data = await fulfillReservation({
      librarianId: librarian.id,
      reservationId: selectedRecord.reservationId,
    });

    if (data.message.includes("fulfilled")) {
      const bookCopies = await getBookCopies(selectedRecord.bookId);
      const reservedCopy = bookCopies.find(
        (copy) => copy.status === "Reserved",
      );
      if (!reservedCopy) {
        return setErrorMessage("No reserved book copy found.");
      }
      const loanData = await createLoans({
        libraryId: selectedRecord.libraryId,
        librarianId: librarian.id,
        copyIDs: [reservedCopy.copy_id], //Had to turn it to an array ecause loanController wants iterable copyIDs bruh
      });
      if (loanData.message.includes("created")) {
        setTransactionDetails(loanData.data);
        setDialog("reserve fulfilled");
        console.log(loanData.data);
        setTransactionOngoing(false);
        loadBooks();
      }
    }
  }
  useEffect(() => {
    loadBooks();
  }, [search, page]);
  return (
    <>
      <Dialog open={dialog === "fulfill"} onClose={() => setDialog("")}>
        <DialogTitle>
          <Typography sx={{ fontWeight: "bold" }}>
            Fulfill a Reservation
          </Typography>
          <Typography sx={{ opacity: 0.7 }}>
            Are you sure you want to fulfill this reservation?
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <ReservationProductCard
              reserveeName={selectedRecord.reserveeName}
              libraryId={selectedRecord.libraryId}
              bookTitle={selectedRecord.bookTitle}
              bookIcon={selectedRecord.bookIcon}
              bookId={selectedRecord.bookId}
              readyDate={formatDateTime(selectedRecord.readyDate)}
              expiryDate={formatDateTime(selectedRecord.expiryDate)}
            />
          )}
          <Box sx={{ bgcolor: "#2e45b560", p: 2, borderRadius: 4 }}>
            <Typography sx={{ color: "#2e45b5" }}>
              Fulfilling this reservation will create a loan borrow under the
              patron's name.
            </Typography>
            <Typography sx={{ fontWeight: "bold" }}>
              Borrow Date: {formatDateTime(new Date())}
            </Typography>
            <Typography sx={{ fontWeight: "bold" }}>
              Due Date:{" "}
              {formatDateTime(
                new Date(new Date().setDate(new Date().getDate() + 3)),
              )}
            </Typography>
          </Box>
          <Typography sx={{ fontWeight: "bold", py: 1 }}>
            To confirm, type "fulfill" below
          </Typography>
          <CustomTextField
            fullWidth
            placeholder="Enter the magic word here..."
            onChange={(e) => setFulfillMagicWord(e.target.value.toLowerCase())}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog("")}>Cancel</Button>
          <Button
            disabled={fulfillMagicWord !== "fulfill" || transactionOngoing}
            onClick={() => {
              setTransactionOngoing(true);
              handleTransaction();
            }}
          >
            Fulfill
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={dialog === "reserve fulfilled"}
        onClose={() => setDialog("")}
      >
        <DialogTitle>
          <Typography sx={{ fontWeight: "bold" }}>
            Fulfill a Reservation
          </Typography>
          <Typography sx={{ opacity: 0.7 }}></Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ bgcolor: "#2e45b560", p: 2, borderRadius: 4 }}>
            <Typography sx={{ fontWeight: "bold", color: "#2e45b5" }}>
              {transactionDetails?.message}
            </Typography>
            <Typography sx={{ fontWeight: "bold", color: "#2e45b5" }}>
              Due Date: {formatDateTime(transactionDetails?.dueDate)}
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
          Fulfill a Reservation
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
              title="No reservations to fulfill."
              icon={<FilterNoneIcon />}
            />
          )}
          {records.map((record) => (
            <ReservationProductCard
              key={record.reservationId}
              reserveeName={record.reserveeName}
              libraryId={record.libraryId}
              bookTitle={record.bookTitle}
              bookIcon={record.bookIcon}
              bookId={record.bookId}
              readyDate={formatDateTime(record.readyDate)}
              expiryDate={formatDateTime(record.expiryDate)}
              onClick={() => handleFulfill(record.reservationId)}
            />
          ))}
        </Box>
      </Box>
    </>
  );
}

export default FulfillReservation;
