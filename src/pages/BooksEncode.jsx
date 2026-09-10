import * as booksApi from "../api/booksApi";
import * as bookCopiesApi from "../api/bookCopiesApi";
import * as shelvesApi from "../api/shelvesApi";
import AddBookDialog from "../components/Dialogs/BooksEncode/AddBookDialog";
import DeleteBookDialog from "../components/Dialogs/BooksEncode/DeleteBookDialog";
import AddPhysicalCopyDialog from "../components/Dialogs/BooksEncode/AddPhysicalCopyDialog";
import EditPhysicalCopyDialog from "../components/Dialogs/BooksEncode/EditPhysicalCopyDialog";
import DeletePhysicalCopyDialog from "../components/Dialogs/BooksEncode/DeletePhysicalCopyDialog";
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Stack,
} from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import CustomTextField from "../components/CustomTextField";
import BookProductCard from "../components/BookProductCard";
import PendingIcon from "@mui/icons-material/Pending";
import EmptyState from "../components/EmptyState";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import QuizIcon from "@mui/icons-material/Quiz";
import AddIcon from "@mui/icons-material/Add";
import { useState, useEffect } from "react";
function BooksEncode() {
  useEffect(() => {
    (async () => {
      const books = await booksApi.getBooks();
      setBooks(books);
    })();
  }, []);
  const [activeDialog, setActiveDialog] = useState(null);
  const [genre, setGenre] = useState("All Genre");
  const [status, setStatus] = useState("All Status");
  const [books, setBooks] = useState([]);
  const [targetBook, setTargetBook] = useState("");
  const [targetCopy, setTargetCopy] = useState("");
  const [editingBook, setEditingBook] = useState(null);
  const [targetBookCopies, setTargetBookCopies] = useState([]);
  const [bookInformationEditToggle, setBookInformationEditToggle] =
    useState(false);

  const bookInformationRows = [
    { label: "Book ID", value: "book_id", editable: false },
    { label: "ISBN", value: "isbn", editable: true },
    { label: "Publisher", value: "publisher", editable: true },
    { label: "Publication Year", value: "publication_year", editable: true },
    { label: "Language", value: "language", editable: true },
    { label: "Genre", value: "genre", editable: true },
    { label: "Shelf Location", value: "shelves", editable: false },
    { label: "Description", value: "description", editable: true },
  ];

  return (
    <>
      <AddBookDialog
        open={activeDialog === "add book"}
        onClose={() => setActiveDialog(null)}
        onCreate={async () => {
          const books = await booksApi.getBooks();
          setBooks(books);
        }}
      />
      <DeleteBookDialog
        open={activeDialog === "delete book"}
        onClose={() => setActiveDialog(null)}
        onDelete={async () => {
          const books = await booksApi.getBooks();
          setBooks(books);
          setTargetBook("");
        }}
        targetBook={targetBook}
      />
      <AddPhysicalCopyDialog
        open={activeDialog === "add physical copy"}
        onClose={() => setActiveDialog(null)}
        targetBook={targetBook}
        onCreate={async () => {
          const book = await booksApi.getBook(targetBook.book_id);
          setTargetBook(book);
          const copies = await bookCopiesApi.getBookCopies(targetBook.book_id);
          setTargetBookCopies(copies);
        }}
      />
      <EditPhysicalCopyDialog
        open={activeDialog === "edit physical copy"}
        onClose={() => setActiveDialog(null)}
        targetBook={targetBook}
        targetCopy={targetCopy}
        onEdit={async () => {
          const book = await booksApi.getBook(targetBook.book_id);
          setTargetBook(book);
          const copies = await bookCopiesApi.getBookCopies(targetBook.book_id);
          setTargetBookCopies(copies);
        }}
      />
      <DeletePhysicalCopyDialog
        open={activeDialog === "delete physical copy"}
        onClose={() => setActiveDialog(null)}
        targetBook={targetBook}
        targetCopy={targetCopy}
        onDelete={async () => {
          const book = await booksApi.getBook(targetBook.book_id);
          setTargetBook(book);
          const copies = await bookCopiesApi.getBookCopies(targetBook.book_id);
          setTargetBookCopies(copies);
          const books = await booksApi.getBooks();
          setBooks(books);
        }}
      />
      {/* Main container */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          p: 2,
          minHeight: 0,
          overflow: "hidden",
          height: "calc(100vh - 64px)",
        }}
      >
        {/* Book Product Cards List */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", px: 1 }}>
          {/* Title and Add Book Button */}
          <Box sx={{ flex: 0.1, display: "flex" }}>
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                Books
              </Typography>
              <Typography variant="subtitle1" sx={{ color: "#777777" }}>
                Manage books and their physical copies
              </Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Button
                onClick={() => {
                  setActiveDialog("add book");
                }}
                size="large"
                sx={{ bgcolor: "accent.primary", color: "background.default" }}
              >
                + Add Book
              </Button>
            </Box>
          </Box>

          {/* Searchbar and filters */}
          <Box sx={{ flex: 0.1, display: "flex", gap: 2, py: 1 }}>
            <CustomTextField
              fullWidth
              placeholder="Search by title, author, Book ID, or publisher..."
            />
            <Select
              sx={{
                bgcolor: "accent.secondary",
                color: "text.primary",
                minWidth: 120,
              }}
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              <MenuItem value="All Genre">All Genre</MenuItem>
              <MenuItem value="Fiction">Fiction</MenuItem>
              <MenuItem value="Science">Science</MenuItem>
              <MenuItem value="History">History</MenuItem>
            </Select>
            <Select
              sx={{ bgcolor: "accent.secondary", minWidth: 120 }}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="All Status">All Status</MenuItem>
              <MenuItem value="Fiction">Available</MenuItem>
              <MenuItem value="Science">Unavailable</MenuItem>
            </Select>
          </Box>

          {/* Main frame for product cards */}
          <Box
            sx={{ flex: 1, display: "flex", alignItems: "flex-start", gap: 1 }}
          >
            {books.length === 0 ? (
              <EmptyState
                icon={<QuizIcon sx={{ fontSize: 52 }} />}
                title="No book records found"
                description="Start by adding your first book."
              />
            ) : (
              books.map((book) => {
                return (
                  <BookProductCard
                    key={book.book_id}
                    title={book.title}
                    author={book.author}
                    genre={book.genre}
                    total_copies={book.total_copies}
                    available_copies={book.available_copies}
                    onClick={() => {
                      (async () => {
                        setTargetBook(await booksApi.getBook(book.book_id));
                        setTargetBookCopies(
                          await bookCopiesApi.getBookCopies(book.book_id),
                        );
                      })();
                    }}
                  />
                );
              })
            )}
          </Box>
        </Box>

        {/* Interface for modifying books */}
        <Box
          sx={{
            flex: 0.5,
            display: "flex",
            flexDirection: "column",
            bgcolor: "#FFFFFF",
            alignItems: "center",
            justifyContent: "center",
            p: 1,
            height: "100%",
            minHeight: 0,
          }}
        >
          {targetBook === "" ? (
            <EmptyState
              icon={<PendingIcon sx={{ fontSize: 52 }} />}
              title="No book selected yet"
              description="Selected book information will appear here."
            />
          ) : (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                width: "100%",
                minHeight: 0,
              }}
            >
              {/* Book details and exit button */}
              <Box
                sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}
              >
                <Typography variant="h5" sx={{ flex: 1, fontWeight: "bold" }}>
                  Book Details
                </Typography>
                <Button onClick={() => setTargetBook("")}>X</Button>
              </Box>

              {/* Scrollable Area */}
              <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
                {/* Headline for book, cover, title, author, genre */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    borderBottom: 1,
                    borderColor: "background.default",
                    py: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 115,
                      height: 160,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      p: 2,
                      bgcolor: "#777777",
                      borderRadius: 4,
                    }}
                  >
                    <AutoStoriesIcon />
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {targetBook.title ?? "No Title Found"}
                    </Typography>
                    <Typography>
                      {targetBook.author ?? "No Author Found"}
                    </Typography>
                    <Typography>
                      {targetBook.genre ?? "No Genre Found"}
                    </Typography>
                  </Box>
                </Box>

                {/* Book information, edit button */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="h6" sx={{ flex: 1, fontWeight: "bold" }}>
                    Book Information
                  </Typography>
                  <ListItemButton
                    onClick={() => {
                      setBookInformationEditToggle(!bookInformationEditToggle);
                      setEditingBook({ ...targetBook });
                    }}
                    sx={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    <ListItemIcon>
                      {
                        <EditIcon
                          sx={{ color: "text.primary", fontSize: 24 }}
                        />
                      }
                    </ListItemIcon>
                    <ListItemText primary="Edit" sx={{ flex: "none" }} />
                  </ListItemButton>
                </Box>

                {/* Book information */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {bookInformationRows.map((element, i) => {
                    return (
                      <Box key={i} sx={{ display: "flex" }}>
                        <Typography sx={{ flex: 1, color: "#777777" }}>
                          {element.label}
                        </Typography>
                        {bookInformationEditToggle ? (
                          <CustomTextField
                            type={
                              element.value === "publication_year"
                                ? "number"
                                : "text"
                            }
                            onChange={(e) => {
                              setEditingBook((prev) => ({
                                ...prev,
                                [element.value]: e.target.value,
                              }));
                            }}
                            disabled={!element.editable}
                            value={editingBook?.[element.value] ?? ""}
                            sx={{ flex: 1, height: 30 }}
                          />
                        ) : (
                          <Typography
                            sx={{
                              flex: 1,
                              fontStyle:
                                targetBook[element.value] === null && "italic",
                            }}
                          >
                            {targetBook[element.value] ??
                              "No " + element.label + " Found"}
                          </Typography>
                        )}
                      </Box>
                    );
                  })}
                  {bookInformationEditToggle && (
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Button
                        onClick={() => {
                          setBookInformationEditToggle(false);
                          setEditingBook(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          (async () => {
                            await booksApi.updateBook(
                              targetBook.book_id,
                              editingBook,
                            );
                            const book = await booksApi.getBook(
                              targetBook.book_id,
                            );
                            setTargetBook(book);
                          })();
                          setBookInformationEditToggle(false);
                        }}
                        sx={{
                          bgcolor: "accent.primary",
                          color: "background.default",
                        }}
                      >
                        Submit
                      </Button>
                    </Box>
                  )}
                </Box>

                {/* Physical Copies, add button */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="h6" sx={{ flex: 1, fontWeight: "bold" }}>
                    Physical Copies
                  </Typography>
                  <ListItemButton
                    sx={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                    onClick={() => {
                      setActiveDialog("add physical copy");
                    }}
                  >
                    <ListItemIcon>
                      {<AddIcon sx={{ color: "text.primary", fontSize: 24 }} />}
                    </ListItemIcon>
                    <ListItemText primary="Add Copy" sx={{ flex: "none" }} />
                  </ListItemButton>
                </Box>

                {/* Physical Copies */}
                <Box>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Copy ID
                          </TableCell>

                          <TableCell sx={{ fontWeight: "bold" }}>
                            Shelf
                          </TableCell>

                          <TableCell sx={{ fontWeight: "bold" }}>
                            Status
                          </TableCell>

                          <TableCell align="right" sx={{ fontWeight: "bold" }}>
                            Action
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {targetBookCopies.map((copy) => (
                          <TableRow key={copy.copy_id}>
                            <TableCell>{copy.copy_id}</TableCell>
                            <TableCell>{copy.shelf}</TableCell>
                            <TableCell>{copy.status}</TableCell>
                            <TableCell align="right">
                              <IconButton
                                size="small"
                                onClick={async () => {
                                  const copyData =
                                    await bookCopiesApi.getBookCopy(
                                      targetBook.book_id,
                                      copy.copy_id,
                                    );

                                  setTargetCopy(copyData);
                                  setActiveDialog("edit physical copy");

                                  console.log(copyData);
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={async () => {
                                  const copyData =
                                    await bookCopiesApi.getBookCopy(
                                      targetBook.book_id,
                                      copy.copy_id,
                                    );

                                  setTargetCopy(copyData);
                                  setActiveDialog("delete physical copy");
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Box>
              {/* Delete book */}
              <Button
                onClick={() => {
                  setActiveDialog("delete book");
                }}
                sx={{ bgcolor: "red", color: "background.default" }}
              >
                Delete Book
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}

export default BooksEncode;
