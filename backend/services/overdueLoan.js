import db from "../config/db.js";

export async function overdueLoan() {
  try {
    const [rows] = await db.query(
      `UPDATE loan SET status = "Overdue" WHERE due_date < CURDATE()`,
    );
    if (rows.affectedRows === 0) {
      return res.status(200).json({
        message: "No loan records affected",
      });
    }
    return res.status(200).json({
      message: "Loans set to overdue",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to set loans overdue",
    });
  }
}
