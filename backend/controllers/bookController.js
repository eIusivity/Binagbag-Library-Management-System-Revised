import db from "../config/db.js";

const emptyToNull = (value) => {
  return typeof value === "string" && value.trim() === "" ? null : value;
};
export async function getBooks(req, res) {
  //Took my time to write this comment, so that in the future once I review this code again, I don't get daunted by the amount of ternary operators
  try {
    const { search = "", page = 1 } = req.query;
    const limit = 6;
    const offset = (Math.max(Number(page) || 1, 1) - 1) * limit; //Ensures that only numbers are sent on the params and it does not go below 1

    //Here we grab the rows according to what the user searched, no search (&&) then we just return all the books
    const [rows] = await db.query(
      `SELECT * FROM book_info WHERE deleted_at IS NULL ${search.trim() && `AND (title LIKE ? OR author LIKE ? OR book_id LIKE ?)`} LIMIT ? OFFSET ? `,
      [
        ...(search.trim()
          ? [`%${search.trim()}%`, `%${search.trim()}%`, `%${search.trim()}%`]
          : []),
        limit,
        offset,
      ],
    );
    //We then grab how many books in total were fetched, this is necessary to create pagination and determine how many pagination buttons we must render
    const [count] = await db.query(
      `SELECT COUNT(*) AS total FROM book_info WHERE deleted_at IS NULL ${search.trim() && `AND (title LIKE ? OR author LIKE ? OR book_id LIKE ?)`}`,
      [
        ...(search.trim()
          ? [`%${search.trim()}%`, `%${search.trim()}%`, `%${search.trim()}%`]
          : []),
      ],
    );
    const total = count[0].total;
    res.json({
      books: rows,
      total: total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to get books",
    });
  }
}
export async function getBook(req, res) {
  try {
    //Embracing your params in a bracket is basically the same thing as prepared statement, cool thing I learned
    const [rows] = await db.query(
      "SELECT * FROM book_info WHERE book_id = ? AND deleted_at IS NULL",
      [req.params.id],
    );
    if (rows.length === 0) {
      return res.status(400).json({
        message: "Book not found",
      });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get book",
    });
  }
}

export async function createBook(req, res) {
  try {
    const {
      title,
      author,
      isbn,
      publisher,
      publication_year,
      language,
      genre,
      description,
    } = req.body;
    //Incase some dude decides to open the backend via a route not the frontend
    if (!title || title.trim() === "") {
      return res.status(400).json({
        message: "Book title is required",
      });
    }
    //Get highest existing book ID number
    const [rows] = await db.query(`
            SELECT MAX(CAST(SUBSTRING(book_id, 4) AS UNSIGNED)) AS highest_id
            FROM book
        `);
    const nextNumber = (rows[0].highest_id ?? 0) + 1;
    const book_id = `BK-${String(nextNumber).padStart(4, "0")}`;
    //Create book
    await db.query(
      `INSERT INTO book
            (book_id, title, author, isbn, publisher, publication_year, language, genre, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        book_id,
        title,
        emptyToNull(author),
        emptyToNull(isbn),
        emptyToNull(publisher),
        emptyToNull(publication_year),
        emptyToNull(language),
        emptyToNull(genre),
        emptyToNull(description),
      ],
    );
    res.status(201).json({
      message: "Book created successfully",
      book_id: book_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create book",
      error: error.message,
    });
  }
}
export async function editBook(req, res) {
  try {
    const { isbn, publisher, publication_year, language, genre, description } =
      req.body;

    const [result] = await db.query(
      "UPDATE book SET isbn = ?, publisher = ?, publication_year = ?, language = ?, genre = ?, description = ? WHERE book_id = ?",
      [
        emptyToNull(isbn),
        emptyToNull(publisher),
        emptyToNull(publication_year),
        emptyToNull(language),
        emptyToNull(genre),
        emptyToNull(description),
        req.params.id,
      ],
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Book not found" });
    res.status(200).json({ message: "Book information updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to edit book",
      error: error.message,
    });
  }
}

export async function deleteBook(req, res) {
  try {
    const [result] = await db.query("DELETE FROM book WHERE book_id = ?", [
      req.params.id,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Book not found" });
    res.status(200).json({ message: "Book successfully deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to get book",
    });
  }
}
