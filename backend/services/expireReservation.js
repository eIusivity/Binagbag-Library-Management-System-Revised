import db from "../config/db.js";
import cron from "node-cron";
export async function expireReservation(req, res) {
  try {
    const [rows] = await db.query(
      `UPDATE reservation SET status = "Expired" WHERE expiry_date < CURDATE()`,
    );
    if (rows.affectedRows === 0) {
      return res.status(200).json({
        message: "No rows were found",
      });
    }
    return res.status(200).json({
      message: "Records beyond due date have been expired.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to expire reservation",
    });
  }
}
