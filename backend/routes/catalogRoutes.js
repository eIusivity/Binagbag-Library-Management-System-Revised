import express from "express";
import {
  fetchBookProfile,
  fetchBooksLibrarySummary,
  searchBooks,
} from "../controllers/catalogController.js";

const router = express.Router();
router.post("/fetch", searchBooks);
router.get("/fetch/:bookId", fetchBookProfile);
router.get("/summary/:bookId", fetchBooksLibrarySummary);
export default router;
