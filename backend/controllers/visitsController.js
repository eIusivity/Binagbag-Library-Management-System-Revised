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
      return res.status(200).json({
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
    const rawWeeksAgo = req.query.weeksAgo ?? "0";

    if (typeof rawWeeksAgo !== "string" || !/^[0-4]$/.test(rawWeeksAgo)) {
      return res.status(400).json({
        message: "weeksAgo must be an integer from 0 to 4.",
      });
    }

    const weeksAgo = Number(rawWeeksAgo);

    // Get today's calendar date in Philippine time.
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Manila",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).formatToParts(new Date());

    const getPart = (type) =>
      Number(parts.find((part) => part.type === type).value);

    // Use UTC methods for calendar arithmetic to avoid server timezone issues.
    const monday = new Date(
      Date.UTC(getPart("year"), getPart("month") - 1, getPart("day")),
    );

    const daysSinceMonday = (monday.getUTCDay() + 6) % 7;

    monday.setUTCDate(monday.getUTCDate() - daysSinceMonday - weeksAgo * 7);

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

    const visitsByDate = new Map(
      rows.map((row) => [row.date, Number(row.total_visits)]),
    );

    const data = ["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => {
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
