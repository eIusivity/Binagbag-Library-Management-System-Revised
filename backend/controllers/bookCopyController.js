import db from "../config/db.js";
import { promoteReservation } from "../services/promoteReservation.js";
const emptyToNull = (value) => {
  return typeof value === "string" && value.trim() === "" ? null : value;
};

export async function getBookCopies(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM book_copy WHERE book_id = ?", [
      req.params.id,
    ]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get book copies",
    });
  }
}
export async function getBookCopy(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM book_copy WHERE copy_id = ?", [
      req.params.copyid,
    ]);
    //res.json(rows[0]);
    if (rows.length === 0)
      return res.status(404).json({
        message: "Book Copy not found.",
      });
    return res.status(200).json({
      message: "Book Copy found.",
      data: rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get book copy",
    });
  }
}
export async function createBookCopies(req, res) {
  const connection = await db.getConnection();

  try {
    const { id } = req.params;
    const physicalCopies = req.body;

    if (!Array.isArray(physicalCopies) || physicalCopies.length === 0) {
      return res.status(400).json({
        message: "Physical copies must be a non-empty array",
      });
    }

    await connection.beginTransaction();

    // Lock the parent book to serialize copy creation.
    const [books] = await connection.query(
      `SELECT book_id FROM book WHERE book_id = ? FOR UPDATE`,
      [id],
    );

    if (books.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        message: "Book not found.",
      });
    }

    // Find the highest copy number
    const [rows] = await connection.query(
      `SELECT MAX(
         CAST(SUBSTRING_INDEX(copy_id, '-', -1) AS UNSIGNED)
       ) AS highest_copy
       FROM book_copy
       WHERE book_id = ?`,
      [id],
    );

    let nextCopyNumber = (rows[0].highest_copy ?? 0) + 1;
    const [availability] = await connection.query(
      //Have to grab how many physical copies there was so that I may trigger promoteReservation accordingly
      `SELECT COUNT(*) AS available
   FROM book_copy
   WHERE book_id = ? AND status = 'Available'`,
      [id],
    );

    const previousAvailable = availability[0].available;
    for (const copy of physicalCopies) {
      const copy_id = `${id}-${String(nextCopyNumber).padStart(3, "0")}`;

      await connection.query(
        `INSERT INTO book_copy
         (copy_id, book_id, shelf, status)
         VALUES (?, ?, ?, ?)`,
        [copy_id, id, copy.shelf_location, "Available"],
      );

      nextCopyNumber++;
    }
    if (previousAvailable === 0) {
      await promoteReservation(id, connection);
    }
    await connection.commit();

    return res.status(201).json({
      message: "Book copies created successfully",
    });
  } catch (error) {
    await connection.rollback();
    console.error(error);

    return res.status(500).json({
      message: "Failed to create copies",
      error: error.message,
    });
  } finally {
    connection.release();
  }
}
export async function editBookCopy(req, res) {
  try {
    const { shelf } = req.body;
    const [result] = await db.query(
      `UPDATE book_copy SET shelf = ? WHERE copy_id = ?`,
      [emptyToNull(shelf), req.params.copyid],
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Copy not found" });
    res.status(200).json({ message: "Copy information updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to edit book",
      error: error.message,
    });
  }
}
export async function deleteBookCopy(req, res) {
  try {
    const [result] = await db.query("DELETE FROM book_copy WHERE copy_id =?", [
      req.params.copyid,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Book not found" });
    res.status(200).json({ message: "Book successfully deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to edit book",
      error: error.message,
    });
  }
}
