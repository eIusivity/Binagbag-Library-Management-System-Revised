import express from "express";
import {
  createLoan,
  getLoan,
  getLoansOfUser,
  checkinLoan,
  getLoans,
  getAllLoans,
} from "../controllers/loanController.js";

const router = express.Router();

router.get("/all", getAllLoans);
router.get("/", getLoans);
router.post("/create", createLoan);
router.get("/loansOf/:libraryId", getLoansOfUser);
router.get("/:bookCopyId", getLoan);
router.put("/checkin/", checkinLoan);
export default router;
