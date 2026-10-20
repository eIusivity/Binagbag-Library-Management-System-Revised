import db from "../config/db.js";

const emptyToNull = (value) => {
  return typeof value === "string" && value.trim() === "" ? null : value;
};
export async function getAllReservations(req, res) {
  try {
    const [rows] = await db.query(`SELECT * FROM reservation`);
    const [count] = await db.query(`SELECT COUNT(*) AS total FROM reservation`);
    const total = count[0].total;
    return res.status(200).json({
      data: rows,
      total,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to get reservations, please try again later.",
    });
  }
}
export async function createReservation(req, res) {
  const { libraryId, bookId, librarianId } = req.body;

  if (!libraryId || !bookId || !librarianId) {
    return res.status(400).json({
      message: "Missing required reservation details.",
    });
  }

  let connection;

  try {
    connection = await db.getConnection();

    await connection.beginTransaction();

    // 1. Lock the book to prevent concurrent queue assignments
    const [books] = await connection.query(
      `SELECT book_id
       FROM book
       WHERE book_id = ?
       FOR UPDATE`,
      [bookId],
    );

    if (books.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        message: "Book not found.",
      });
    }

    // 2. Check for an existing waiting reservation
    const [existing] = await connection.query(
      `SELECT reservation_id
       FROM reservation
       WHERE library_id = ?
         AND book_id = ?
         AND status = 'Waiting'
       LIMIT 1`,
      [libraryId, bookId],
    );

    if (existing.length > 0) {
      await connection.rollback();

      return res.status(409).json({
        message: "Patron already has a waiting reservation for this book.",
      });
    }

    // 3. Determine the next queue position
    const [rows] = await connection.query(
      `SELECT COALESCE(MAX(queue_position), 0) + 1 AS nextPosition
       FROM reservation
       WHERE book_id = ?`,
      [bookId],
    );

    const queuePosition = rows[0].nextPosition;

    // 4. Create the reservation
    const [result] = await connection.query(
      `INSERT INTO reservation
       (library_id, book_id, reservation_date,
        queue_position, status, processed_by)
       VALUES (?, ?, NOW(), ?, 'Waiting', ?)`,
      [libraryId, bookId, queuePosition, librarianId],
    );

    // 5. Commit transaction
    await connection.commit();

    return res.status(201).json({
      message: "Reservation recorded successfully!",
      reservationId: result.insertId,
      queuePosition,
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    console.error("Reservation error:", error);

    return res.status(500).json({
      message: "Failed to create reservation.",
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
export async function fulfillReservation(req, res) {
  try {
    const { librarianId, reservationId } = req.body;

    await db.query(
      `UPDATE reservation SET status = "Picked Up", fulfilled_on = ?, fulfilled_by = ? WHERE reservation_id = ?`,
      [new Date(), librarianId, reservationId],
    );
    return res.status(200).json({
      message: "Reservation fulfilled",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch Reservation record.",
    });
  }
}
export async function getReservationByLibraryId(req, res) {
  try {
    const { libraryId } = req.params;

    const [rows] = await db.query(
      `SELECT * FROM reservation WHERE library_id =?`,
      [libraryId],
    );
    return res.status(200).json({
      message: "Reservation record found.",
      record: rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch Reservation record.",
    });
  }
}
export async function getReservations(req, res) {
  try {
    const { search = "", page = 1 } = req.query;
    const limit = 5;
    const offset = (Math.max(Number(page) || 1, 1) - 1) * limit; //Ensures that only numbers are sent on the params and it does not go below 1

    const [rows] = await db.query(
      `SELECT * FROM reservation ${search.trim() && `WHERE library_id LIKE ? OR book_id LIKE ?`} ORDER BY reservation_date ASC, reservation_id ASC LIMIT ? OFFSET ?  `,
      [
        ...(search.trim() ? [`%${search.trim()}%`, `%${search.trim()}%`] : []),
        limit,
        offset,
      ],
    );
    const [count] = await db.query(
      `SELECT COUNT(*) AS total FROM reservation ${search.trim() && `WHERE library_id LIKE ? OR book_id LIKE ?`}`,
      [...(search.trim() ? [`%${search.trim()}%`, `%${search.trim()}%`] : [])],
    );
    const total = count[0].total;
    res.json({
      records: rows,
      total: total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch Reservation record.",
    });
  }
}
export async function cancelReservation(req, res) {
  const connection = await db.getConnection();

  try {
    const { reservationId } = req.params;

    await connection.beginTransaction();

    const [rows] = await connection.query(
      `SELECT book_id, queue_position, status
       FROM reservation
       WHERE reservation_id = ?
       FOR UPDATE`,
      [reservationId],
    );

    if (rows.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        message: "Reservation not found.",
      });
    }

    const reservation = rows[0];

    // Adjust these statuses to match your database.
    if (!["Waiting", "Ready"].includes(reservation.status)) {
      await connection.rollback();
      return res.status(400).json({
        message: "This reservation cannot be cancelled.",
      });
    }

    await connection.query(
      `UPDATE reservation
       SET status = 'Cancelled', cancel_date = ?, queue_position = null 
       WHERE reservation_id = ?`,
      [new Date(), reservationId],
    );

    await connection.query(
      `UPDATE reservation
       SET queue_position = queue_position - 1
       WHERE book_id = ?
         AND queue_position > ?
         AND status IN ('Waiting')`,
      [reservation.book_id, reservation.queue_position],
    );

    await connection.commit();

    return res.status(200).json({
      message: "Reservation cancelled.",
    });
  } catch (error) {
    await connection.rollback();
    console.error(error);

    return res.status(500).json({
      message: "Failed to cancel reservation.",
    });
  } finally {
    connection.release();
  }
}
