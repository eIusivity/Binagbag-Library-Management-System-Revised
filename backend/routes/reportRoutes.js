import express from "express";
import {
  getLoanReportRecords,
  getTotalBorrows,
  getTotalReturns,
  getBookInventorySummary,
  getBookInventoryRecords,
  getReservationSummary,
  getReservationReportRecords,
} from "../controllers/reportController.js";

const router = express.Router();
router.get("/totalBorrows", getTotalBorrows);
router.get("/totalReturns", getTotalReturns);
router.get("/recordsTable", getLoanReportRecords);
router.get("/books/summary", getBookInventorySummary);
router.get("/books/records", getBookInventoryRecords);
router.get("/reservations/summary", getReservationSummary);
router.get("/reservations/records", getReservationReportRecords);
export default router;
