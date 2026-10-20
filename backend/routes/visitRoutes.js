import express from "express";
import {
  getAllVisits,
  getWeeklyVisit,
  incrementVisit,
  getVisitsToday,
} from "../controllers/visitsController.js";

const router = express.Router();

router.post("/increment", incrementVisit);
router.post("/all", getAllVisits);
router.get("/weekly", getWeeklyVisit);
router.get("/today", getVisitsToday);
export default router;
