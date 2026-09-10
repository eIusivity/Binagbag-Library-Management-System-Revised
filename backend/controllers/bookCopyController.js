import db from "../config/db.js";

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
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get book copy",
    });
  }
}
export async function createBookCopies(req, res) {
  try {
    const { id } = req.params;
    const physicalCopies = req.body;
    if (!Array.isArray(physicalCopies)) {
      return res.status(400).json({
        message: "Physical copies must be an array",
      });
    }
    if (physicalCopies.length === 0) {
      return res.status(400).json({
        message: "No physical copies submitted",
      });
    }
    // Find the highest copy number for this book
    const [rows] = await db.query(
      `
            SELECT MAX(
                CAST(SUBSTRING_INDEX(copy_id, '-', -1) AS UNSIGNED)
            ) AS highest_copy
            FROM book_copy
            WHERE book_id = ?
            `,
      [id],
    );
    let nextCopyNumber = (rows[0].highest_copy ?? 0) + 1;
    for (const copy of physicalCopies) {
      const copy_id = `${id}-${String(nextCopyNumber).padStart(3, "0")}`;
      await db.query(
        `
                INSERT INTO book_copy
                (copy_id, book_id, shelf, status)
                VALUES (?, ?, ?, ?)
                `,
        [copy_id, id, copy.shelf_location, "Available"],
      );
      nextCopyNumber++;
    }
    res.status(201).json({
      message: "Book copies created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create copies",
      error: error.message,
    });
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
