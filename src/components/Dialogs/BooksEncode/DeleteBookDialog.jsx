import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { useState } from "react";
import CustomTextField from "../../CustomTextField";
import { deleteBook } from "../../../api/booksApi";
function DeleteBookDialog({ open, onClose, targetBook, onDelete }) {
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  function handleClose() {
    setDeleteConfirmation("");
    onClose();
  }

  async function handleDelete() {
    try {
      const data = await deleteBook(targetBook.book_id);
      //notify.success(data.message);
      handleClose();
      onDelete();
    } catch (error) {
      //notify.error(error.message);
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: "bold" }}>Delete Book</DialogTitle>

      <DialogContent>
        <Typography sx={{ mt: 1 }}>
          Are you sure you want to delete this book?
        </Typography>

        <Typography sx={{ fontWeight: "bold", mt: 2 }}>
          {targetBook?.title || "Untitled Book"}
        </Typography>

        <Typography color="text.secondary">{targetBook?.book_id}</Typography>

        <Typography color="text.secondary">
          {targetBook?.author || "Unknown Author"}
        </Typography>

        <Typography sx={{ mt: 2 }}>
          To confirm deletion, type <strong>delete</strong> below.
        </Typography>

        <CustomTextField
          fullWidth
          placeholder="Type delete to confirm"
          value={deleteConfirmation}
          onChange={(e) => setDeleteConfirmation(e.target.value)}
          sx={{ mt: 1 }}
        />
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

export default DeleteBookDialog;
