import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  IconButton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { createBook } from "../../../api/booksApi";
import { createBookCopies } from "../../../api/bookCopiesApi";
import { getShelves } from "../../../api/shelvesApi";
import { useEffect, useState } from "react";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import DeleteIcon from "@mui/icons-material/Delete";
import TableRowsIcon from "@mui/icons-material/TableRows";

import CustomTextField from "../../CustomTextField";
import StateDialog from "../../StateDialog";

function AddBookDialog({ open, onClose, onCreate }) {
  const [shelves, setShelves] = useState([]);
  useEffect(() => {
    (async () => {
      setShelves(await getShelves());
    })();
  }, []);
  const addBookTextFields = [
    {
      label: "Title",
      placeholder: "e.g. Atomic Haits",
      row: 1,
      value: "title",
      required: true,
    },
    {
      label: "Author",
      placeholder: "e.g. Jose Rizal",
      row: 2,
      value: "author",
    },
    { label: "ISBN", placeholder: "9849302230111", row: 2, value: "isbn" },
    {
      label: "Publication Year",
      placeholder: "e.g. 2020",
      type: "number",
      row: 3,
      value: "publication_year",
    },
    {
      label: "Publisher",
      placeholder: "e.g. Munich Publication Press",
      row: 3,
      value: "publisher",
    },
    { label: "Genre", type: "select", row: 4, value: "genre" },
    {
      label: "Language",
      placeholder: "e.g. English",
      row: 4,
      value: "language",
    },
    {
      label: "Description",
      type: "textarea",
      placeholder: "Enter a brief description of the book...",
      row: 5,
      value: "description",
    },
  ];
  const addBookTFRows = Object.values(
    Object.groupBy(addBookTextFields, (textfield) => textfield.row),
  );

  const [step, setStep] = useState(1);

  const [bookDraft, setBookDraft] = useState({});
  const [physicalCopies, setPhysicalCopies] = useState([]);

  function resetDialog() {
    setStep(1);
    setBookDraft({});
    setPhysicalCopies([]);
  }

  function handleClose() {
    resetDialog();
    onClose();
  }

  function handleBookInformationSubmit(e) {
    e.preventDefault();
    setStep(2);
  }

  async function handleCreateBook(e) {
    e.preventDefault();
    try {
      const data = await createBook(bookDraft);
      if (physicalCopies.length > 0)
        await createBookCopies(data.book_id, physicalCopies);
      //notify.success(data.message);
      handleClose();
      onCreate();
    } catch (error) {
      //notify.error(error.message);
    }
  }

  function addPhysicalCopy() {
    setPhysicalCopies((prev) => [
      ...prev,
      {
        shelf_location: "",
      },
    ]);
  }
  function removePhysicalCopy(indexToRemove) {
    setPhysicalCopies((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  }
  function changePhysicalCopyShelf(indexToChange, shelfLocation) {
    setPhysicalCopies((prev) =>
      prev.map((copy, index) =>
        index === indexToChange
          ? {
              ...copy,
              shelf_location: shelfLocation,
            }
          : copy,
      ),
    );
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: "bold" }}>Add Book</DialogTitle>

      <DialogContent>
        {/* STEP 1 - BOOK INFORMATION */}
        {step === 1 && (
          <Box
            component="form"
            id="book-information-form"
            onSubmit={handleBookInformationSubmit}
          >
            {addBookTFRows.map((row, rowIndex) => (
              <Box
                key={rowIndex}
                sx={{
                  display: "flex",
                  gap: 2,
                }}
              >
                {row.map((textfield) => (
                  <Box
                    key={textfield.value}
                    sx={{
                      flex: 1,
                    }}
                  >
                    <Typography sx={{ fontWeight: "bold" }}>
                      {textfield.label}
                    </Typography>

                    <CustomTextField
                      placeholder={textfield.placeholder}
                      type={textfield.type}
                      required={textfield.required}
                      fullWidth
                      value={bookDraft[textfield.value] ?? ""}
                      onChange={(e) => {
                        setBookDraft((prev) => ({
                          ...prev,
                          [textfield.value]: e.target.value,
                        }));
                      }}
                    />
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        )}

        {/* STEP 2 - PHYSICAL COPIES */}
        {step === 2 && (
          <Box
            component="form"
            id="book-physical-copies-form"
            onSubmit={handleCreateBook}
          >
            {/* Book preview */}
            <Stack direction="row" sx={{ gap: 2 }}>
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

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {bookDraft.title}
                </Typography>

                <Typography>
                  {bookDraft.author ?? "No Author Submitted"}
                </Typography>

                <Typography variant="body2">
                  {(bookDraft.genre ?? "No Genre Submitted") +
                    " • " +
                    (bookDraft.publisher ?? "No Publisher Submitted") +
                    " • " +
                    (bookDraft.publication_year ??
                      "No Publication Year Submitted")}
                </Typography>

                <Typography
                  sx={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {bookDraft.description ?? "No Description Submitted"}
                </Typography>
              </Box>
            </Stack>

            {/* Physical Copies */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                mt: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Physical Copies
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: 225,
                  overflowY: "auto",
                  gap: 1,
                  border: "1px dashed rgba(0,0,0,0.5)",
                  borderRadius: 4,
                  p: 1,
                }}
              >
                {physicalCopies.length === 0 && (
                  <StateDialog
                    icon={<TableRowsIcon sx={{ fontSize: 52 }} />}
                    title="No copies added yet"
                    description="Add your copies at your time, Librarian!"
                  />
                )}

                {physicalCopies.map((copy, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    sx={{
                      bgcolor: "#ebebeb",
                      height: 75,
                      gap: 2,
                      p: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      Copy {index + 1}
                    </Typography>

                    <Stack
                      sx={{
                        flex: 1,
                        justifyContent: "center",
                      }}
                    >
                      <Typography>Shelf Location</Typography>

                      <Select
                        value={copy.shelf_location}
                        onChange={(e) =>
                          changePhysicalCopyShelf(index, e.target.value)
                        }
                        fullWidth
                        required
                        sx={{
                          height: "75%",
                          bgcolor: "#FFFFFF",
                        }}
                      >
                        {shelves.map((shelf) => (
                          <MenuItem
                            key={shelf.shelf_code}
                            value={shelf.shelf_code}
                          >
                            {shelf.shelf_code}
                          </MenuItem>
                        ))}
                      </Select>
                    </Stack>

                    <IconButton
                      onClick={() => removePhysicalCopy(index)}
                      sx={{
                        color: "error.main",
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                ))}
              </Box>

              <Button
                type="button"
                onClick={addPhysicalCopy}
                sx={{
                  width: "100%",
                  bgcolor: "accent.primary",
                  color: "background.default",
                }}
              >
                + Add Copy
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>

        {step === 1 && (
          <Button
            type="submit"
            form="book-information-form"
            sx={{
              bgcolor: "accent.primary",
              color: "background.default",
            }}
          >
            Continue
          </Button>
        )}

        {step === 2 && (
          <>
            <Button type="button" onClick={() => setStep(1)}>
              Back
            </Button>

            <Button
              type="submit"
              form="book-physical-copies-form"
              sx={{
                bgcolor: "accent.primary",
                color: "background.default",
              }}
            >
              Submit
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default AddBookDialog;
