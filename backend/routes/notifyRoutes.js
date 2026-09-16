import express from "express";
import {
  createNotification,
  getNotificationsForUser,
  getUnreadNotificationCount,
  markNotificationAsRead,
} from "../notify/notify.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const result = await createNotification(req.body);

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create notification " + error,
    });
  }
});
router.get("/unread", async (req, res) => {
  try {
    const result = await getUnreadNotificationCount(
      req.query.userId,
      req.query.role,
    );

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch unread notifications" + error,
    });
  }
});
router.get("/get", async (req, res) => {
  try {
    const result = await getNotificationsForUser(
      req.query.userId,
      req.query.role,
    );

    res.status(200).json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to retrieve notifications",
    });
  }
});
router.post("/mark", async (req, res) => {
  try {
    const result = await markNotificationAsRead(
      req.query.notificationId,
      req.query.userId,
    );
    if (result.affectedRows === 0) {
      return res.status(200).json({
        message: "Notification was already marked as read",
      });
    }
    res.status(201).json({
      message: "Notification marked as read",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to retrieve notifications",
    });
  }
});
export default router;
