import db from "../config/db.js";

export async function incrementVisit(req, res) {
  try {
    await db.query(
      `INSERT INTO visits (date, total_visits)
       VALUES (CURDATE(), 1)
       ON DUPLICATE KEY UPDATE total_visits = total_visits + 1`,
    );

    return res.status(200).json({
      message: "Visit recorded successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong, please try again.",
    });
  }
}
export async function getVisitsToday(req, res) {
  try {
    const [rows] = await db.query(
      `SELECT * from VISITS where date = CURDATE()`,
    );
    if (rows.length === 0) {
      return res.status(400).json({
        todaysVisits: 0,
      });
    }
    return res.status(200).json({
      todaysVisits: rows[0].total_visits,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong, please try again.",
    });
  }
}
export async function getAllVisits(req, res) {}
export async function getWeeklyVisit(req, res) {
  try {
    const year = Number(req.query.year);
    const month = Number(req.query.month);
    const week = Number(req.query.week);

    if (
      !Number.isInteger(year) ||
      year < 1000 ||
      year > 9999 ||
      !Number.isInteger(month) ||
      month < 1 ||
      month > 12 ||
      !Number.isInteger(week) ||
      week < 1 ||
      week > 5
    ) {
      return res.status(400).json({
        message: "Provide a valid year, month, and week.",
      });
    }

    // Find the first Monday, then advance to the selected week.
    const monday = new Date(Date.UTC(year, month - 1, 1));
    const daysUntilMonday = (1 - monday.getUTCDay() + 7) % 7;

    monday.setUTCDate(1 + daysUntilMonday + (week - 1) * 7);

    if (monday.getUTCMonth() !== month - 1) {
      return res.status(400).json({
        message: "That week does not exist in the selected month.",
      });
    }

    const friday = new Date(monday);
    friday.setUTCDate(friday.getUTCDate() + 4);

    const formatDate = (date) => date.toISOString().slice(0, 10);

    const [rows] = await db.query(
      `SELECT DATE_FORMAT(date, '%Y-%m-%d') AS date, total_visits
       FROM visits
       WHERE date BETWEEN ? AND ?
       ORDER BY date ASC`,
      [formatDate(monday), formatDate(friday)],
    );

    // Include all five weekdays, even when a daily record is missing.
    const visitsByDate = new Map(
      rows.map((row) => [row.date, Number(row.total_visits)]),
    );

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

    const data = days.map((day, index) => {
      const date = new Date(monday);
      date.setUTCDate(date.getUTCDate() + index);

      const dateString = formatDate(date);

      return {
        day,
        date: dateString,
        total_visits: visitsByDate.get(dateString) ?? 0,
      };
    });

    return res.status(200).json({ data });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch visits for this week.",
    });
  }
}
