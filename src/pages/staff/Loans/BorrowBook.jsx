import React, { useState } from "react";
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
  Paper,
  IconButton,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AutoStories from "@mui/icons-material/AutoStories";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import CustomTextField from "../../../components/CustomTextField";
import SearchIcon from "@mui/icons-material/Search";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import Scanner from "../../../components/BorrowBookComponents/Scanner";
import { DeleteOutlineOutlined, Person } from "@mui/icons-material";
import { authClient } from "../../../auth/authClient";
import { getUserByLibraryID } from "../../../api/usersApi";
import UserProfileCard from "../../../components/UserProfileCard";
import { getBookCopy } from "../../../api/bookCopiesApi";
import { getBook } from "../../../api/booksApi";
import { createLoans, getLoansOfUser } from "../../../api/loansApi";
import { useAuth } from "../../../auth/AuthProvider";
function BorrowBook() {
  const [lmsId, setLmsId] = useState("");
  const [books, setBooks] = useState([]);
  const [bookCopyId, setBookCopyId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1);
  const [transactionDetails, setTransactionDetails] = useState({});
  const [transactionOngoing, setTransactionOngoing] = useState(false);
  const { user: librarian } = useAuth();
  const stepsContent = [
    { instruction: "Identify  User" },
    { instruction: "Scan Books" },
    { instruction: "Review" },
  ];
  async function loadUser() {
    try {
      setUser(null);
      if (!lmsId) return setErrorMessage("Please input a patron's LMS ID.");
      const data = await getUserByLibraryID(lmsId);
      //Query to loans and grab active loans associated with the user
      const loansAssociation = await getLoansOfUser({
        libraryId: lmsId,
        activeLoansOnly: true,
      });
      console.log(loansAssociation);
      if (loansAssociation.data.length + books.length >= 3) {
        return setErrorMessage(
          "User may only have a maximum of 3 active loans.",
        );
      }
      setUser(data.user);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
    }
  }
  async function handleLoanTransaction() {
    try {
      setTransactionOngoing(true);
      const data = await createLoans({
        libraryId: lmsId,
        copyIDs: books.map((book) => book.copy_id),
        librarianID: librarian.id,
      });
      setErrorMessage("");
      setTransactionDetails(data?.data);
      setTransactionOngoing(false);
      setStep(4);
    } catch (error) {
      setTransactionOngoing(false);
      setErrorMessage(error.message);
    }
  }
  async function getBorrowingBooks() {
    try {
      if (!bookCopyId) return setErrorMessage("Please input a book copy ID.");
      if (bookCopyId.length < 11)
        return setErrorMessage("Invalid Book Copy ID.");
      if (books.some((book) => book.copy_id === bookCopyId))
        return setErrorMessage("This book is already included!");
      if (books.length >= 3)
        return setErrorMessage("Only a maximum of 3 books may be borrowed!");
      const data = await getBookCopy(bookCopyId.substring(0, 7), bookCopyId);

      if (!data?.data) return setErrorMessage("Book Copy not found.");
      if (data.data.status !== "Available")
        return setErrorMessage("This book copy is not available.");
      const loansAssociation = await getLoansOfUser({
        libraryId: lmsId,
        activeLoansOnly: true,
      });
      if (loansAssociation.data.length + books.length >= 3) {
        return setErrorMessage(
          "User may only have a maximum of 3 active loans.",
        );
      }
      const bookInformation = await getBook(bookCopyId.substring(0, 7));
      setBooks((prev) => [
        ...prev,
        {
          copy_id: data.data.copy_id,
          title: bookInformation.title,
          author: bookInformation?.author ?? "No Author",
          genre: bookInformation?.genre ?? "No Genre",
          publisher: bookInformation?.publisher ?? "No Publisher",
          isbn: bookInformation?.isbn ?? "No ISBN",
          available: true,
        },
      ]);

      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
    }
  }
  return (
    <Box sx={{ p: 2, display: "flex", flex: 1, flexDirection: "column" }}>
      <ListItemButton
        component={NavLink}
        to="/loans"
        sx={{ display: "flex", color: "primary.main", alignItems: "center" }}
      >
        <ListItemIcon>
          <ArrowBackIcon sx={{ color: "primary.main" }} />
        </ListItemIcon>
        <ListItemText primary="Back to Loans" />
      </ListItemButton>
      <Typography variant="h5" sx={{ fontWeight: 800, color: "primary.main" }}>
        Borrow Book
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
          <Scanner
            title={
              step === 1
                ? "Scan Patron's Digital Library Card"
                : step === 2 && "Now, let's scan their books"
            }
            value={step === 1 ? lmsId : step === 2 && bookCopyId}
            onChange={step === 1 ? setLmsId : step === 2 && setBookCopyId}
            onSubmit={step === 1 ? loadUser : step === 2 && getBorrowingBooks}
            placeholder={
              step === 1
                ? "Type patron's LMS ID here"
                : step === 2 && "Type the book copy ID here"
            }
            error={errorMessage}
          />
          {step === 1 && user && (
            <>
              <Typography sx={{ fontWeight: 800 }}>
                Borrower's details. Please review:
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
          {books.length === 0 ||
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
        </Stack>
      )}

      {step === 2 && (
        <Stack spacing={1.5}>
          {books.map((book) => (
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

              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={book.available ? "Available" : "Unavailable"}
                  color={book.available ? "success" : "error"}
                  size="small"
                />

                <IconButton
                  onClick={() =>
                    setBooks((prev) =>
                      prev.filter((book) => book.copy_id !== book.copy_id),
                    )
                  }
                >
                  <DeleteOutlineOutlined />
                </IconButton>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
      {step === 2 && books.length > 0 && (
        <Button onClick={() => setStep(3)}>Confirm</Button>
      )}

      {/* REVIEW TRANSACTION */}
      {step === 3 && (
        <Stack>
          <Typography sx={{ fontWeight: 800 }}>
            Librarian, please review the details before confirming the loan.
          </Typography>
          <Divider />
          <Typography sx={{ fontWeight: 800, mt: 2 }}>Borrower</Typography>
          <UserProfileCard user={user} />
          <Typography
            sx={{ fontWeight: 800, mt: 2 }}
          >{`Selected Books (${books.length})`}</Typography>
          <Stack spacing={1.5}>
            {books.map((book) => (
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

                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    label={book.available ? "Available" : "Unavailable"}
                    color={book.available ? "success" : "error"}
                    size="small"
                  />

                  <IconButton>
                    <DeleteOutlineOutlined />
                  </IconButton>
                </Stack>
              </Paper>
            ))}
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
              onClick={() => handleLoanTransaction()}
              sx={{ bgcolor: "black", color: "white" }}
            >
              {transactionOngoing
                ? "Creating record..."
                : "Yes, confirm borrow"}
            </Button>
          </Stack>
        </Stack>
      )}
      {step === 4 && (
        <Stack sx={{ justifyContent: "center", alignItems: "center" }}>
          <ThumbUpAltIcon sx={{ color: "accent.primary", fontSize: 200 }} />
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Loan Created for {transactionDetails?.borrower}!
          </Typography>
          <Typography variant="h6">
            Loan is due on:
            {new Date(transactionDetails?.dueDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Typography>
          <Button variant="contained">Return to Loans</Button>
        </Stack>
      )}
    </Box>
  );
}

export default BorrowBook;
