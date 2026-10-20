import db from "../config/db.js";

//Created catalogController to improve clarity from bookController
export async function searchBooks(req, res) {
  try {
    const {
      title = "",
      author = "",
      publication_year = "",
      isUnavailable,
      isAvailable,
      page = 1,
    } = req.body;

    const limit = 6;
    const offset = (Math.max(Number(page) || 1, 1) - 1) * limit;

    const [rows] = await db.query(
      `SELECT * FROM book_info
       WHERE deleted_at IS NULL
       ${title.trim() ? "AND title LIKE ?" : ""}
       ${author.trim() ? "AND author LIKE ?" : ""}
       ${publication_year.trim() ? "AND publication_year LIKE ?" : ""}
       ${isUnavailable && !isAvailable ? "AND available_copies = 0" : ""}
       ${isAvailable && !isUnavailable ? "AND available_copies > 0" : ""}
       ORDER BY title ASC, book_id ASC
       LIMIT ? OFFSET ?`,
      [
        ...(title.trim() ? [`%${title.trim()}%`] : []),
        ...(author.trim() ? [`%${author.trim()}%`] : []),
        ...(publication_year.trim() ? [`%${publication_year.trim()}%`] : []),
        limit,
        offset,
      ],
    );

    const [count] = await db.query(
      `SELECT COUNT(*) AS total FROM book_info
       WHERE deleted_at IS NULL
       ${title.trim() ? "AND title LIKE ?" : ""}
       ${author.trim() ? "AND author LIKE ?" : ""}
       ${publication_year.trim() ? "AND publication_year LIKE ?" : ""}
       ${isUnavailable && !isAvailable ? "AND available_copies = 0" : ""}
       ${isAvailable && !isUnavailable ? "AND available_copies > 0" : ""}`,
      [
        ...(title.trim() ? [`%${title.trim()}%`] : []),
        ...(author.trim() ? [`%${author.trim()}%`] : []),
        ...(publication_year.trim() ? [`%${publication_year.trim()}%`] : []),
      ],
    );

    return res.status(200).json({
      records: rows,
      total: count[0].total,
      totalPages: Math.ceil(count[0].total / limit),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to search books. Please try again later.",
    });
  }
}
export async function fetchBookProfile(req, res) {
  try {
    const { bookId } = req.params;
    const [rows] = await db.query(`SELECT * FROM book_info WHERE book_id =?`, [
      bookId,
    ]);
    if (rows.length === 0) {
      return res.status(400).json({
        message: "No such book exists.",
      });
    }
    return res.status(200).json({
      record: rows[0],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to search books. Please try again later.",
    });
  }
}
export async function fetchBooksLibrarySummary(req, res) {
  try {
    const { bookId } = req.params;

    const [bookRows] = await db.query(
      `SELECT total_copies, available_copies
       FROM book_info
       WHERE book_id = ?`,
      [bookId],
    );

    if (bookRows.length === 0) {
      return res.status(404).json({
        message: "No such book exists.",
      });
    }

    const [borrowedRows] = await db.query(
      `SELECT COUNT(*) AS borrowed_copies
       FROM book_copy
       WHERE book_id = ? AND status = 'Borrowed'`,
      [bookId],
    );

    const [reservedRows] = await db.query(
      `SELECT COUNT(*) AS reserved_copies
       FROM book_copy
       WHERE book_id = ? AND status = 'Reserved'`,
      [bookId],
    );

    const [loanRows] = await db.query(
      `SELECT COUNT(*) AS total_times_borrowed
       FROM loan
       WHERE copy_id LIKE ?`,
      [`${bookId}-%`],
    );

    return res.status(200).json({
      message: "Book library summary fetched.",
      data: {
        total_copies: Number(bookRows[0].total_copies),
        available_copies: Number(bookRows[0].available_copies),
        borrowed_copies: Number(borrowedRows[0].borrowed_copies),
        reserved_copies: Number(reservedRows[0].reserved_copies),
        total_times_borrowed: Number(loanRows[0].total_times_borrowed),
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch book library summary.",
    });
  }
}
