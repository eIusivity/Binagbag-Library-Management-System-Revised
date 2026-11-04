import express from "express";
import {
  createUser,
  getUser,
  getUserCount,
  getUserByLibraryID,
  getUserProfileLibrarySummary,
  searchUsers,
} from "../controllers/userController.js";

const router = express.Router();
router.post("/register", createUser);
router.get("/:id", getUser);
router.get("/library/:libraryId", getUserByLibraryID);
router.get("/", getUserCount);
router.get("/summary/:id", getUserProfileLibrarySummary);
router.get("/search", searchUsers);
export default router;
