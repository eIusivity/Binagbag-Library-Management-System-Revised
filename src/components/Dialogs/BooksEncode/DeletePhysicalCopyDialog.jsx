import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from "@mui/material";

import { useState } from "react";
import { deleteBookCopy } from "../../../api/bookCopiesApi";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import CustomTextField from "../../CustomTextField";

function DeletePhysicalCopyDialog({
  open,
  onClose,
  targetBook,
  targetCopy,
  onDelete,
}) {
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  function handleClose() {
    setDeleteConfirmation("");
    onClose();
  }

  async function handleDelete() {
    try {
      const data = await deleteBookCopy(targetCopy.copy_id);
      onDelete();
      handleClose();
    } catch (error) {}
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: "bold" }}>
        Delete Physical Copy
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ py: 1 }}>
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

            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {targetBook?.title || "Untitled Book"}
              </Typography>

              <Typography>
                {targetBook?.author ?? "No Author Submitted"}
              </Typography>

              <Typography variant="body2">
                {(targetBook?.genre ?? "No Genre Submitted") +
                  " • " +
                  (targetBook?.publisher ?? "No Publisher Submitted") +
                  " • " +
                  (targetBook?.publication_year ??
                    "No Publication Year Submitted")}
              </Typography>

              <Typography
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {targetBook?.description ?? "No Description Submitted"}
              </Typography>
            </Box>
          </Stack>

          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              p: 2,
              bgcolor: "#f5f5f5",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Copy Information
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "#777777" }}>
              Review the physical copy details before deleting.
            </Typography>

            <Stack spacing={1} sx={{ mt: 2 }}>
              <Typography>
                <strong>Copy ID:</strong> {targetCopy?.copy_id ?? "N/A"}
              </Typography>
              <Typography>
                <strong>Book ID:</strong>{" "}
                {targetCopy?.book_id ?? targetBook?.book_id ?? "N/A"}
              </Typography>
              <Typography>
                <strong>Shelf Location:</strong> {targetCopy?.shelf ?? "N/A"}
              </Typography>
              <Typography>
                <strong>Status:</strong> {targetCopy?.status ?? "N/A"}
              </Typography>
            </Stack>
          </Box>

          <Typography sx={{ mt: 1 }}>
            To confirm deletion, type <strong>delete</strong> below.
          </Typography>

          <CustomTextField
            fullWidth
            placeholder="Type delete to confirm"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>

        <Button
          onClick={handleDelete}
          disabled={deleteConfirmation !== "delete"}
          color="error"
          variant="contained"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeletePhysicalCopyDialog;
