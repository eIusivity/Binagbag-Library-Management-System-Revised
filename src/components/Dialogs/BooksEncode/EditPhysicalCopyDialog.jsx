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
import { updateBookCopy } from "../../../api/bookCopiesApi";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import DeleteIcon from "@mui/icons-material/Delete";
import TableRowsIcon from "@mui/icons-material/TableRows";
import CustomTextField from "../../CustomTextField";
import StateDialog from "../../StateDialog";

function EditPhysicalCopyDialog({
  open,
  onClose,
  targetBook,
  targetCopy,
  onEdit,
}) {
  const [shelves, setShelves] = useState([]);
  const [editingCopy, setEditingCopy] = useState(null);
  useEffect(() => {
    if (open && targetCopy) {
      setEditingCopy({ ...targetCopy });
    }
  }, [open, targetCopy]);
  useEffect(() => {
    (async () => {
      setShelves(await getShelves());
    })();
  }, []);
  function handleClose() {
    onClose();
  }
  const copyTextFieldFirstRow = [
    {
      label: "Copy ID",
      disabled: true,
      sublabel: "Copy ID cannot be changed",
      value: "copy_id",
    },
    {
      label: "Book ID",
      disabled: true,
      sublabel: "Book ID cannot be changed",
      value: "book_id",
    },
  ];
  const copyTextFieldSecondRow = [
    {
      label: "Shelf Location",
      disabled: false,
      sublabel: "Change the shelf location of this copy",
    },
    {
      label: "Status",
      disabled: true,
      sublabel: "Status is automatically managed by the system",
      value: "status",
    },
  ];
  async function handleEditPhysicalCopy(e) {
    e.preventDefault();

    try {
      await updateBookCopy(targetCopy.copy_id, editingCopy);

      setEditingCopy(null);
      onEdit();
      onClose();
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: "bold" }}>Edit Physical Copy</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          id="book-physical-copies-form"
          onSubmit={handleEditPhysicalCopy}
          sx={{ p: 2 }}
        >
          {/* Book Preview */}
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
          {/* Copy Information */}
          <Stack sx={{ py: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Copy Information
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "#777777" }}>
              Update the shelf location of this physical copy
            </Typography>

            {/* Weird code, may need to refactor for some time */}
            <Stack spacing={1}>
              <Stack direction="row" spacing={2}>
                {copyTextFieldFirstRow.map((field, i) => {
                  return (
                    <Stack key={i} sx={{ width: "100%" }}>
                      <Typography sx={{ fontWeight: "bold" }}>
                        {field.label}
                      </Typography>
                      <CustomTextField
                        disabled={field.disabled}
                        fullWidth
                        value={targetCopy?.[field.value] ?? ""}
                      />
                      <Typography variant="body1" sx={{ color: "#777777" }}>
                        {field.sublabel}
                      </Typography>
                    </Stack>
                  );
                })}
              </Stack>
              <Stack direction="row" spacing={2}>
                {copyTextFieldSecondRow.map((field, i) => {
                  return (
                    <Stack key={i} sx={{ width: "100%" }}>
                      {field.label === "Shelf Location" && (
                        <>
                          <Typography sx={{ fontWeight: "bold" }}>
                            {field.label}
                          </Typography>
                          <Select
                            value={editingCopy?.shelf ?? ""}
                            onChange={(e) => {
                              setEditingCopy((prev) => ({
                                ...prev,
                                shelf: e.target.value,
                              }));
                            }}
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
                          <Typography variant="body1" sx={{ color: "#777777" }}>
                            {field.sublabel}
                          </Typography>
                        </>
                      )}
                      {field.label === "Status" && (
                        <>
                          <Stack key={i} sx={{ width: "100%" }}>
                            <Typography sx={{ fontWeight: "bold" }}>
                              {field.label}
                            </Typography>
                            <CustomTextField
                              disabled={field.disabled}
                              fullWidth
                              value={targetCopy?.[field.value] ?? ""}
                            />
                            <Typography
                              variant="body1"
                              sx={{ color: "#777777" }}
                            >
                              {field.sublabel}
                            </Typography>
                          </Stack>
                        </>
                      )}
                    </Stack>
                  );
                })}
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
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
      </DialogActions>
    </Dialog>
  );
}

export default EditPhysicalCopyDialog;
