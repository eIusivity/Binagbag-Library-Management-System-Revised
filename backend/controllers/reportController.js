import db from "../config/db.js";

export async function getTotalBorrows(req, res) {
  try {
    const { startingDate, endingDate } = req.query;

    if (!startingDate || !endingDate) {
      return res.status(400).json({
        message: "Starting date and ending date are required.",
      });
    }

    const [rows] = await db.query(
      `SELECT COUNT(*) AS total_borrows
       FROM loan
       WHERE borrow_date >= ?
         AND borrow_date < DATE_ADD(?, INTERVAL 1 DAY)`,
      [startingDate, endingDate],
    );

    return res.status(200).json({
      totalBorrows: rows[0].total_borrows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to get total borrows.",
    });
  }
}
export async function getTotalReturns(req, res) {
  try {
    const { startingDate, endingDate } = req.query;

    if (!startingDate || !endingDate) {
      return res.status(400).json({
        message: "Starting date and ending date are required.",
      });
    }

    const [rows] = await db.query(
      `SELECT COUNT(*) AS total_returns
       FROM loan
       WHERE return_date >= ?
         AND return_date < DATE_ADD(?, INTERVAL 1 DAY)`,
      [startingDate, endingDate],
    );

    return res.status(200).json({
      totalReturns: rows[0].total_returns,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to get total returns.",
    });
  }
}
export async function getLoanReportRecords(req, res) {
  try {
    const { startingDate, endingDate } = req.query;

    if (!startingDate || !endingDate) {
      return res.status(400).json({
        message: "Starting date and ending date are required.",
      });
    }

    const [rows] = await db.query(
      `SELECT
         l.loan_id,
         l.library_id,
         u.name AS borrower_name,
         b.title AS book_title,
         l.copy_id,
         l.borrow_date,
         l.due_date,
         l.return_date
       FROM loan l
       LEFT JOIN user u ON l.library_id = u.library_id
       LEFT JOIN book_copy bc ON l.copy_id = bc.copy_id
       LEFT JOIN book b ON bc.book_id = b.book_id
       WHERE (
         l.borrow_date >= ?
         AND l.borrow_date < DATE_ADD(?, INTERVAL 1 DAY)
       ) OR (
         l.return_date >= ?
         AND l.return_date < DATE_ADD(?, INTERVAL 1 DAY)
       )
       ORDER BY l.borrow_date ASC, l.loan_id ASC`,
      [startingDate, endingDate, startingDate, endingDate],
    );

    return res.status(200).json({
      records: rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to get loan report records.",
    });
  }
}
export async function getBookInventorySummary(req, res) {
  try {
    const [rows] = await db.query(
      `SELECT
         (SELECT COUNT(*) FROM book) AS totalTitles,
         COUNT(*) AS totalCopies,
         COUNT(CASE WHEN status = 'Available' THEN 1 END) AS availableCopies,
         COUNT(CASE WHEN status = 'Borrowed' THEN 1 END) AS borrowedCopies,
         COUNT(CASE WHEN status = 'Reserved' THEN 1 END) AS reservedCopies,
         COUNT(CASE WHEN status = 'Defective' THEN 1 END) AS defectiveCopies
       FROM book_copy`,
    );

    return res.status(200).json({
      summary: rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to get book inventory summary.",
    });
  }
}
export async function getBookInventoryRecords(req, res) {
  try {
    const [rows] = await db.query(
      `SELECT
         b.book_id,
         b.title,
         b.author,
         COUNT(bc.copy_id) AS totalCopies,
         COUNT(CASE WHEN bc.status = 'Available' THEN 1 END) AS availableCopies,
         COUNT(CASE WHEN bc.status = 'Borrowed' THEN 1 END) AS borrowedCopies,
         COUNT(CASE WHEN bc.status = 'Reserved' THEN 1 END) AS reservedCopies,
         COUNT(CASE WHEN bc.status = 'Defective' THEN 1 END) AS defectiveCopies
       FROM book b
       LEFT JOIN book_copy bc ON b.book_id = bc.book_id
       GROUP BY b.book_id, b.title, b.author
       ORDER BY b.title ASC, b.book_id ASC`,
    );

    return res.status(200).json({
      records: rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to get book inventory records.",
    });
  }
}
export async function getReservationSummary(req, res) {
  try {
    const { startingDate, endingDate } = req.query;

    if (!startingDate || !endingDate) {
      return res.status(400).json({
        message: "Starting date and ending date are required.",
      });
    }

    const [rows] = await db.query(
      `SELECT
         COUNT(*) AS totalReservations,
         COUNT(CASE WHEN status = 'Waiting' THEN 1 END) AS waitingReservations,
         COUNT(CASE WHEN status = 'Ready' THEN 1 END) AS readyReservations,
         COUNT(CASE WHEN status = 'Picked Up' THEN 1 END) AS fulfilledReservations,
         COUNT(CASE WHEN status = 'Cancelled' THEN 1 END) AS cancelledReservations,
         COUNT(CASE WHEN status = 'Expired' THEN 1 END) AS expiredReservations
       FROM reservation
       WHERE reservation_date >= ?
         AND reservation_date < DATE_ADD(?, INTERVAL 1 DAY)`,
      [startingDate, endingDate],
    );

    return res.status(200).json({
      summary: rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to get reservation summary.",
    });
  }
}
export async function getReservationReportRecords(req, res) {
  try {
    const { startingDate, endingDate } = req.query;

    if (!startingDate || !endingDate) {
      return res.status(400).json({
        message: "Starting date and ending date are required.",
      });
    }

    const [rows] = await db.query(
      `SELECT
         r.reservation_id,
         r.library_id,
         u.name AS reservee_name,
         r.book_id,
         b.title AS book_title,
         r.reservation_date,
         r.ready_date,
         r.expiry_date,
         r.status
       FROM reservation r
       LEFT JOIN user u ON r.library_id = u.library_id
       LEFT JOIN book b ON r.book_id = b.book_id
       WHERE r.reservation_date >= ?
         AND r.reservation_date < DATE_ADD(?, INTERVAL 1 DAY)
       ORDER BY r.reservation_date ASC, r.reservation_id ASC`,
      [startingDate, endingDate],
    );

    return res.status(200).json({
      records: rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to get reservation report records.",
    });
  }
}
