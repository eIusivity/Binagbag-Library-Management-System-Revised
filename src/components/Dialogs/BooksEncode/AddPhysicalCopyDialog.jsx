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
import { useEffect, useState } from "react";
import { getShelves } from "../../../api/shelvesApi";
import { createBookCopies } from "../../../api/bookCopiesApi";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import DeleteIcon from "@mui/icons-material/Delete";
import TableRowsIcon from "@mui/icons-material/TableRows";
import CustomTextField from "../../CustomTextField";
import EmptyState from "../../EmptyState";

function AddPhysicalCopyDialog({ open, onClose, onCreate, targetBook }) {
  function handleClose() {
    setPhysicalCopies([]);
    onClose();
  }
  const [physicalCopies, setPhysicalCopies] = useState([]);
  const [shelves, setShelves] = useState([]);
  useEffect(() => {
    (async () => {
      setShelves(await getShelves());
    })();
  }, []);
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
  async function handleCreatePhysicalCopy(e) {
    e.preventDefault();
    try {
      await createBookCopies(targetBook.book_id, physicalCopies);
      handleClose();
      onCreate();
    } catch (error) {}
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: "bold" }}>Add Physical Copy</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          id="book-physical-copies-form"
          onSubmit={handleCreatePhysicalCopy}
          sx={{ p: 2 }}
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
                {targetBook.title}
              </Typography>

              <Typography>
                {targetBook.author ?? "No Author Submitted"}
              </Typography>

              <Typography variant="body2">
                {(targetBook.genre ?? "No Genre Submitted") +
                  " • " +
                  (targetBook.publisher ?? "No Publisher Submitted") +
                  " • " +
                  (targetBook.publication_year ??
                    "No Publication Year Submitted")}
              </Typography>

              <Typography
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {targetBook.description ?? "No Description Submitted"}
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
                <EmptyState
                  icon={<TableRowsIcon sx={{ fontSize: 52 }} />}
                  title="No copies added yet"
                  description="Copies added here will be placed alongside your currently existing copies"
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <>
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
      </DialogActions>
    </Dialog>
  );
}

export default AddPhysicalCopyDialog;
