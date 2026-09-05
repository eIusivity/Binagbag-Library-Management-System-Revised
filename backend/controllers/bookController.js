import db from "../config/db.js";

export async function getBooks(req, res) {
    try {
        const [rows] = await db.query("SELECT * FROM book_info");
        res.json(rows);
    } catch(error) {
        res.status(500).json({
            message: "Failed to get books"
        });
    }
}
export async function getBook(req, res) {
    try {
        //Embracing your params in a bracket is basically the same thing as prepared statement, cool thing I learned
        const [rows] = await db.query("SELECT * FROM book_info WHERE book_id = ?", [req.params.id]);
        res.json(rows[0]);
    } catch(error) {
        res.status(500).json({
            message: "Failed to get book"
        });
    }
}
export async function getBookCopies(req, res) {
    try {
        const [rows] = await db.query("SELECT * FROM book_copy WHERE book_id = ?", [req.params.id])
        res.json(rows);
    } catch(error) {
        res.status(500).json({
            message: "Failed to get book"
        });
    }
}
export async function editBook(req, res) {
    try {
        const {isbn,publisher,publication_year,language,genre,description} = req.body;

        const [result] = await db.query('UPDATE book SET isbn = ?, publisher = ?, publication_year = ?, language = ?, genre = ?, description = ? WHERE book_id = ?', [isbn,publisher,publication_year,language,genre,description,req.params.id]);
        {/* Sept 4 2026, 11:03 PM, I went to sleep, some error messages console here may be unnecessary, those were brute forced ways to diagnose some errors I went through, remove them if you want, or maybe not to keep it a relic of the past */}
        if(result.affectedRows === 0 ) return res.status(404).json({message: "Book not found"});
        res.status(200).json({message: "Book information updated successfully"});
    } catch(error) {
        console.error(error)
        res.status(500).json({
            message: "Failed to edit book",
            error: error.message
        });
    }
}