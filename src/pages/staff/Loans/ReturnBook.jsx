import {
  Box,
  Typography,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Paper,
  Chip,
  IconButton,
  Button,
  Divider,
  Checkbox,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import Scanner from "../../../components/BorrowBookComponents/Scanner";
import { getLoan, loanCheckin } from "../../../api/loansApi";
import { getBookCopy } from "../../../api/bookCopiesApi";
import { DeleteOutlineOutlined, Person } from "@mui/icons-material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { getBook } from "../../../api/booksApi";
import { authClient } from "../../../auth/authClient";
import { getUserByLibraryID } from "../../../api/usersApi";
import { useAuth } from "../../../auth/AuthProvider";
function ReturnBook() {
  const { user: librarian } = useAuth();
  const [step, setStep] = useState(1);
  const [bookCopyId, setBookCopyId] = useState("");
  const [loans, setLoans] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [transactionDetails, setTransactionDetails] = useState({});
  const [transactionOngoing, setTransactionOngoing] = useState(false);
  async function handleLoanTransaction() {
    try {
      setTransactionOngoing(true);
      const recordsObject = {
        librarian: librarian.id,
        returns: loans.map((book) => ({
          loanId: book.loan.loan_id,
          returnCondition: book.isGoodCondition ? "Good" : "Defective",
        })),
      };
      const data = await loanCheckin(recordsObject);
      setErrorMessage("");
      setTransactionDetails(data?.data);
      setTransactionOngoing(false);
      setStep(3);
    } catch (error) {
      setTransactionOngoing(false);
      setErrorMessage(error.message);
    }
  }
  async function retrieveLoan() {
    try {
      if (!bookCopyId) return setErrorMessage("Please input a book copy ID.");
      if (bookCopyId.length < 11)
        return setErrorMessage("Invalid Book Copy ID.");
      if (loans.some((book) => book.copy_id === bookCopyId))
        return setErrorMessage("This book is already included!");

      const loan = await getLoan(bookCopyId);
      if (!loan?.data) return setErrorMessage(loan.message);

      const book = await getBook(bookCopyId.substring(0, 7));
      if (!book) return setErrorMessage(book.message);

      const bookCopy = await getBookCopy(
        bookCopyId.substring(0, 7),
        bookCopyId,
      );
      if (!bookCopy?.data) return setErrorMessage(bookCopy.message);

      const borrower = await getUserByLibraryID(loan?.data.library_id);
      if (!borrower?.user) return setErrorMessage(borrower.message);
      setLoans((prev) => [
        ...prev,
        {
          loan: loan.data,
          copy_id: bookCopyId,
          title: book.title,
          author: book.author,
          borrower: borrower.user.name,
          isGoodCondition: true, //Not part of the database, this is the starting point of the return process of checking if book is defective or not
        },
      ]);
      setBookCopyId("");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
    }
  }
  const stepsContent = [
    { instruction: "Scan Books" },
    { instruction: "Review" },
  ];
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
        Return Book
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
      {step === 1 && (
        <Scanner
          title={step === 1 && "Scan the book's barcode ISBN"}
          value={step === 1 && bookCopyId}
          onChange={step === 1 && setBookCopyId}
          onSubmit={step === 1 && retrieveLoan}
          placeholder={step === 1 && "Submit the book copy's ID here"}
          error={errorMessage}
        />
      )}
      {step === 1 && loans.length > 0 && (
        <Stack spacing={1.5}>
          {loans.map((book) => (
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
                <Typography sx={{ fontWeight: "bold" }}>
                  Borrower: {book.borrower}
                </Typography>
              </Box>
              <Stack direction="row" sx={{ alignItems: "center" }}>
                <Stack direction="row" sx={{ alignItems: "center" }}>
                  <Typography>Is the book in good condition?</Typography>
                  <Checkbox
                    checked={book.isGoodCondition}
                    onChange={(e) =>
                      setLoans((prev) =>
                        prev.map((item) =>
                          item.copy_id === book.copy_id
                            ? { ...item, isGoodCondition: e.target.checked }
                            : item,
                        ),
                      )
                    }
                  />
                </Stack>
                <IconButton
                  onClick={() =>
                    setLoans((prev) =>
                      prev.filter((loan) => loan.copy_id !== book.copy_id),
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
      {step === 1 && loans.length > 0 && (
        <Button onClick={() => setStep(2)}>Confirm</Button>
      )}
      {step === 2 && (
        <Stack spacing={1.5}>
          <Typography sx={{ fontWeight: 800 }}>
            Librarian, please review the details before confirming the return.
          </Typography>
          <Divider />
          {loans.map((book) => (
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
                <Typography sx={{ fontWeight: "bold" }}>
                  Borrower: {book.borrower}
                </Typography>
              </Box>
              <Chip
                label={book.isGoodCondition ? "Good Condition" : "Defective"}
                color={book.isGoodCondition ? "success" : "error"}
                size="small"
              />
            </Paper>
          ))}
          <Typography align="center" sx={{ fontWeight: 800, mt: 2 }}>
            Are these correct?
          </Typography>
          <Stack
            direction="row"
            sx={{ justifyContent: "center", gap: 2, p: 1 }}
          >
            <Button sx={{ bgcolor: "red", color: "white" }}>
              No, reassess the process
            </Button>
            <Button
              disabled={transactionOngoing}
              onClick={() => handleLoanTransaction()}
              sx={{ bgcolor: "black", color: "white" }}
            >
              {transactionOngoing
                ? "Creating record..."
                : "Yes, confirm return"}
            </Button>
          </Stack>
          {step === 3 && (
            <Stack>
              <ThumbUpAltIcon />
              <Typography>Loan returned!</Typography>
            </Stack>
          )}
        </Stack>
      )}
    </Box>
  );
}

export default ReturnBook;
