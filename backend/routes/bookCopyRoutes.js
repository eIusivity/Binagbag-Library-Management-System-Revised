import express from "express";
import {
  createBookCopies,
  getBookCopies,
  getBookCopy,
  editBookCopy,
  deleteBookCopy,
} from "../controllers/bookCopyController.js";

const router = express.Router();
router.get("/:id", getBookCopies);
router.get("/:id/:copyid", getBookCopy);
router.post("/:id/create", createBookCopies);
router.put("/:copyid/edit", editBookCopy);
router.delete("/:copyid/delete", deleteBookCopy);
export default router;
