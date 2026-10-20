import express from "express";
import {
  createReservation,
  fulfillReservation,
  getReservationByLibraryId,
  getReservations,
  cancelReservation,
  getAllReservations,
} from "../controllers/reservationController.js";

const router = express.Router();

router.get("/all", getAllReservations);
router.post("/create", createReservation);
router.get("/:libraryId", getReservationByLibraryId);
router.get("/", getReservations);
router.put("/cancel/:reservationId", cancelReservation);
router.put("/fulfill", fulfillReservation);
export default router;
