import express from "express";
import {
  getBooks,
  getBook,
  editBook,
  createBook,
  deleteBook,
} from "../controllers/bookController.js";

const router = express.Router();
router.get("/", getBooks);
router.get("/:id", getBook);
router.put("/:id/edit", editBook);
router.post("/create", createBook);
router.delete("/:id/delete", deleteBook);
export default router;
