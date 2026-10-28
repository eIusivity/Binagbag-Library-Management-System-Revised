import {
  Box,
  Divider,
  InputAdornment,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  Avatar,
  Chip,
  Button,
  Table,
  Popper,
  Paper,
  IconButton,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { useEffect, useRef } from "react";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { DeleteOutlineOutlined, Person } from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Scanner from "../../../components/BorrowBookComponents/Scanner";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import UserProfileCard from "../../../components/UserProfileCard";
import { useState } from "react";
import { getUserByLibraryID } from "../../../api/usersApi";
import { useAuth } from "../../../auth/AuthProvider";
import { getBook, getBooks } from "../../../api/booksApi";
import {
  createReservation,
  getReservationByLibraryId,
} from "../../../api/reservationApi";
import { getLoansOfUser } from "../../../api/loansApi";
function CreateReservation() {
  const { user: librarian } = useAuth();
  const [lmsId, setLmsId] = useState("");
  const scannerRef = useRef(null);
  const [bookId, setBookId] = useState(""); //book copy id may act as a seach prompt as well, once data is found, it converts itself to book copy id dlater
  const [book, setBook] = useState(null);
  const [searchedBook, setSearchedBook] = useState([]);
  const [user, setUser] = useState("");
  const [step, setStep] = useState(1);
  const [transactionDetails, setTransactionDetails] = useState({});
  const [transactionOngoing, setTransactionOngoing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const stepsContent = [
    { instruction: "Identify  User" },
    { instruction: "Select Book" },
    { instruction: "Review" },
  ];
  async function handleTransaction() {
    try {
      setTransactionOngoing(true);
      const data = await createReservation({
        librarianId: librarian.id,
        bookId: book.book_id,
        libraryId: lmsId,
      });
      setErrorMessage("");
      setTransactionDetails(data);
      console.log(data);
      setTransactionOngoing(false);
      setStep(4);
    } catch (error) {
      setTransactionOngoing(false);
      setErrorMessage(error.message);
    }
  }
  async function loadUser() {
    try {
      setUser(null);
      if (!lmsId) return setErrorMessage("Please input a patron's LMS ID.");
      const data = await getUserByLibraryID(lmsId);
      console.log(data.user);
      setUser(data.user);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
    }
  }
  async function loadBook(id = bookId) {
    try {
      setBook(null);
      setErrorMessage("");
      if (!id) return setErrorMessage("Please input the valid book copy ID");
      console.log(lmsId);
      //interfere first for a validation: Check if the patron is already in reservation for the book
      const reservationData = await getReservationByLibraryId(lmsId);

      const isUserAlreadyInReserve = reservationData.record.some(
        (reservation) =>
          reservation.book_id === id &&
          ["Waiting", "Ready"].includes(reservation.status),
      );

      if (isUserAlreadyInReserve) {
        return setErrorMessage(
          "This user is already in reserve for this book!",
        );
      }
      //interfere second for a vlidation: Check if the user that wants this book is actually borrowing it:
      const loanData = await getLoansOfUser({ libraryId: lmsId });

      const isUserAlreadyBorrowingThisBook = loanData.data.some(
        (loan) =>
          loan.copy_id.substring(0, 7) === id &&
          ["Borrowed", "Overdue"].includes(loan.status),
      );

      if (isUserAlreadyBorrowingThisBook) {
        return setErrorMessage("This user is already borrowing this book!");
      }

      //interfere third for a validation: Check if the book is available, if available, prevent reservation.
      const data = await getBook(id);
      if (data) {
        if (data.available_copies > 0)
          return setErrorMessage(
            "This book has an available copy, try loaning the patron the book instead.",
          );
        setBook(data);
        setBookId("");
        setSearchedBook([]);
        setErrorMessage("");
      }
      console.log(data);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }
  async function searchBook() {
    try {
      const result = await getBooks(bookId);

      if (Array.isArray(result.books)) {
        setSearchedBook(
          result.books.filter((book) => Number(book.available_copies) === 0), //Check if book available_copies is 0
        );
      }
    } catch (error) {
      console.error(error);
      setSearchedBook([]);
    }
  }
  useEffect(() => {
    if (step !== 2 || !bookId.trim()) {
      setSearchedBook([]);
      return;
    }
    const timer = setTimeout(() => {
      searchBook();
    }, 300);

    return () => clearTimeout(timer);
  }, [bookId, step]);
  return (
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
      <Typography variant="h5" sx={{ fontWeight: 800, color: "primary.main" }}>
        Create a Reservation
      </Typography>
      <Stack
        direction="row"
        sx={{ justifyContent: "center", alignItems: "center", gap: 2 }}
      >
        {stepsContent.map((e, index) => {
          return (
            <>
              <Stack>
                <Stack
                  direction="row"
                  sx={{
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    p: 1,
                    borderBottom: step === index + 1 ? 2 : 0,
                  }}
                >
                  <Typography
                    sx={{
                      bgcolor: step === index + 1 ? "black" : "gray",
                      color: "white",
                      borderRadius: "100%",
                      fontWeight: 800,
                      p: 2,
                      py: 1,
                    }}
                  >
                    {index + 1}
                  </Typography>
                  <Typography>{e.instruction}</Typography>
                </Stack>
              </Stack>
              {index < stepsContent.length - 1 && (
                <Box
                  sx={{
                    width: 60,
                    height: 2,
                    bgcolor: "divider",
                    mx: 2,
                  }}
                />
              )}
            </>
          );
        })}
      </Stack>
      {(step === 1 || step === 2) && (
        <Stack
          sx={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            p: 4,
            gap: 2,
          }}
        >
          <Box ref={scannerRef} sx={{ width: "100%", maxWidth: 500 }}>
            <Scanner
              title={
                step === 1
                  ? "Scan Patron's Digital Library Card"
                  : "Now, let's find the book that they want!"
              }
              value={step === 1 ? lmsId : bookId}
              onChange={step === 1 ? setLmsId : setBookId}
              onSubmit={step === 1 ? loadUser : loadBook}
              placeholder={
                step === 1
                  ? "Type patron's LMS ID here"
                  : "Type the book's name or the specific book copy ID here"
              }
              error={errorMessage}
            />
          </Box>

          <Popper
            open={step === 2 && Boolean(bookId.trim())}
            anchorEl={scannerRef.current}
            placement="bottom-start"
            modifiers={[
              {
                name: "flip",
                enabled: false,
              },
              {
                name: "preventOverflow",
                enabled: false,
              },
            ]}
            sx={{
              zIndex: 1300,
              width: scannerRef.current?.offsetWidth,
            }}
          >
            <Paper
              elevation={3}
              sx={{
                mt: 1,
                maxHeight: 200,
                overflowY: "auto",
              }}
            >
              {searchedBook.map((book) => (
                <ListItemButton
                  key={book.book_id}
                  onClick={() => {
                    setBookId(book.book_id);
                    loadBook(book.book_id); //Pass an immediately available variable rather than using the global bookId state because that variable is delayed in scheduling
                  }}
                >
                  <ListItemText
                    primary={book.title}
                    secondary={`${book.author} • ${book.book_id}`}
                  />
                </ListItemButton>
              ))}
            </Paper>
          </Popper>
          {step === 1 && user && (
            <>
              <Typography sx={{ fontWeight: 800 }}>
                Reservee's details. Please review:
              </Typography>
              <UserProfileCard user={user} />
              {user.status === "Active" ? (
                <Button onClick={() => setStep(2)}>Confirm</Button>
              ) : (
                <Typography sx={{ color: "red" }}>
                  This patron's account is {user.status}, loan is ineligible.
                </Typography>
              )}
            </>
          )}
          {!book ||
            (!user && (
              <Box
                sx={{
                  bgcolor: "#2a42b450",
                  p: 2,
                  borderRadius: 4,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <InfoOutlinedIcon sx={{ color: "#2a42b4" }} />
                <Typography sx={{ color: "#2a42b4" }}>Tip: </Typography>
                {step === 1
                  ? "Scan the Patron’s Barcode / QR Code on their School ID, or search their ID or name manually on the searchbar above."
                  : step === 2 &&
                    "Scan the book copy/copies barcode ID of the patron, or manually type the copy/copies ID above."}
              </Box>
            ))}
          {book && (
            <Paper
              key={book.copy_id}
              variant="outlined"
              sx={{
                p: 2,
                display: "flex",
                bgcolor: "white",
              }}
            >
              <Box>
                <Typography fontWeight={700}>{book.title}</Typography>

                <Typography variant="body2" color="text.secondary">
                  {book.author}
                </Typography>

                <Typography variant="caption">{book.copy_id}</Typography>
              </Box>

              <Stack direction="row" spacing={1} alignItems="center">
                <IconButton onClick={() => setBook(null)}>
                  <DeleteOutlineOutlined />
                </IconButton>
              </Stack>
            </Paper>
          )}
          {step === 2 && book && (
            <Button onClick={() => setStep(3)}>Confirm</Button>
          )}
        </Stack>
      )}
      {step === 3 && (
        <Stack>
          <Typography sx={{ fontWeight: 800 }}>
            Librarian, please review the details before confirming the loan.
          </Typography>
          <Divider />
          <Typography sx={{ fontWeight: 800, mt: 2 }}>Reservee</Typography>
          <UserProfileCard user={user} />
          <Typography
            sx={{ fontWeight: 800, mt: 2 }}
          >{`Selected Book`}</Typography>
          <Stack spacing={1.5}>
            <Paper
              key={book.copy_id}
              variant="outlined"
              sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                bgcolor: "white",
              }}
            >
              <Box>
                <Typography fontWeight={700}>{book.title}</Typography>

                <Typography variant="body2" color="text.secondary">
                  {book.author}
                </Typography>

                <Typography variant="caption">{book.copy_id}</Typography>
              </Box>

              <Stack direction="row" spacing={1} alignItems="center"></Stack>
            </Paper>
          </Stack>
          <Typography align="center" sx={{ fontWeight: 800, mt: 2 }}>
            Are these correct?
          </Typography>
          <Stack
            direction="row"
            sx={{ justifyContent: "center", gap: 2, p: 1 }}
          >
            <Button
              sx={{ bgcolor: "red", color: "white" }}
              onClick={() => setStep(1)}
            >
              No, reassess the process
            </Button>
            <Button
              disabled={transactionOngoing}
              onClick={() => handleTransaction()}
              sx={{ bgcolor: "black", color: "white" }}
            >
              {transactionOngoing
                ? "Creating record..."
                : "Yes, confirm reservation"}
            </Button>
          </Stack>
        </Stack>
      )}
      {step === 4 && (
        <Stack>
          <ThumbUpAltIcon />
          <Typography>{transactionDetails.message};</Typography>
          <Typography>
            The reservation position for this user is:
            {transactionDetails.queuePosition}
          </Typography>
        </Stack>
      )}
    </Box>
  );
}

export default CreateReservation;
