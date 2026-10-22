import * as booksApi from "../../api/booksApi";
import * as bookCopiesApi from "../../api/bookCopiesApi";
import * as shelvesApi from "../../api/shelvesApi";
import AddBookDialog from "../../components/Dialogs/BooksEncode/AddBookDialog";
import DeleteBookDialog from "../../components/Dialogs/BooksEncode/DeleteBookDialog";
import AddPhysicalCopyDialog from "../../components/Dialogs/BooksEncode/AddPhysicalCopyDialog";
import EditPhysicalCopyDialog from "../../components/Dialogs/BooksEncode/EditPhysicalCopyDialog";
import DeletePhysicalCopyDialog from "../../components/Dialogs/BooksEncode/DeletePhysicalCopyDialog";
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
  Pagination,
} from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import CustomTextField from "../../components/CustomTextField";
import BookProductCard from "../../components/BookProductCard";
import PendingIcon from "@mui/icons-material/Pending";
import StateDialog from "../../components/StateDialog";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import QuizIcon from "@mui/icons-material/Quiz";
import AddIcon from "@mui/icons-material/Add";
import BarcodeReaderIcon from "@mui/icons-material/BarcodeReader";
import { useState, useEffect } from "react";
import ManageCopyBarcodes from "../../components/Dialogs/BooksEncode/ManageCopyBarcodes";
function BooksEncode() {
  const [prompt, setPrompt] = useState("");
  const [paginationCount, setPaginationCount] = useState(0);
  const [paginationOffset, setPaginationOffset] = useState(0);
  useEffect(() => {
    (async () => {
      const books = await booksApi.getBooks(prompt, paginationOffset);
      setBooks(books.books);
      setPaginationCount(books.totalPages); //total pages of how many books were fetched, 6 books equal a page, not the actual pages of a literal book
      console.log(books.totalPages);
    })();
  }, [prompt, paginationOffset]);
  const [activeDialog, setActiveDialog] = useState(null);
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
      <ManageCopyBarcodes
        open={activeDialog === "manage barcode"}
        onClose={() => setActiveDialog(null)}
        bookId={targetBook.book_id}
      />
      <AddBookDialog
        open={activeDialog === "add book"}
        onClose={() => setActiveDialog(null)}
        onCreate={async () => {
          const result = await booksApi.getBooks(prompt, paginationOffset);
          setBooks(result.books);
          setPaginationCount(result.totalPages);
        }}
      />
      <DeleteBookDialog
        open={activeDialog === "delete book"}
        onClose={() => setActiveDialog(null)}
        onDelete={async () => {
          const result = await booksApi.getBooks(prompt, paginationOffset);
          setBooks(result.books);
          setPaginationCount(result.totalPages);
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
          const result = await booksApi.getBooks(prompt, paginationOffset);
          setBooks(result.books);
          setPaginationCount(result.totalPages);
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
              onChange={(e) => setPrompt(e.target.value)}
            />
          </Box>

          {/* Main frame for product cards */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "flex-start",
              gap: 1,
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                flex: 1,
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                alignContent: "flex-start",
                gap: 1.25,
              }}
            >
              {books.length === 0 ? (
                <StateDialog
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
            <Pagination
              count={paginationCount}
              variant="outlined"
              shape="rounded"
              color="primary"
              sx={{
                display: paginationCount === 0 ? "none" : "block",
                alignItems: "center",
              }}
              onChange={(e, page) => setPaginationOffset(page)}
            />
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
            <StateDialog
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
                  <Stack>
                    <ListItemButton
                      onClick={() => {
                        setBookInformationEditToggle(
                          !bookInformationEditToggle,
                        );
                        setEditingBook({ ...targetBook });
                      }}
                      sx={{
                        flex: 1,
                        alignItems: "center",
                      }}
                    >
                      <ListItemIcon>
                        {
                          <EditIcon
                            sx={{ color: "text.primary", fontSize: 22 }}
                          />
                        }
                      </ListItemIcon>
                      <ListItemText primary="Edit" sx={{ flex: "none" }} />
                    </ListItemButton>
                    <ListItemButton
                      onClick={() => setActiveDialog("manage barcode")}
                      sx={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "flex-end",
                      }}
                    >
                      <ListItemIcon>
                        {
                          <BarcodeReaderIcon
                            sx={{ color: "text.primary", fontSize: 22 }}
                          />
                        }
                      </ListItemIcon>
                      <ListItemText
                        primary="Manage Barcodes"
                        sx={{ flex: "none" }}
                      />
                    </ListItemButton>
                  </Stack>
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

                                  setTargetCopy(copyData.data);
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

                                  setTargetCopy(copyData.data);
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
