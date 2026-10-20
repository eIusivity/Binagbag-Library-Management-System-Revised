import db from "../config/db.js";
import { promoteReservation } from "../services/promoteReservation.js";
const emptyToNull = (value) => {
  return typeof value === "string" && value.trim() === "" ? null : value;
};
export async function getAllLoans(req, res) {
  try {
    const { thisDayOnly } = req.query;

    const [rows] = await db.query(
      `SELECT * FROM loan
       ${
         thisDayOnly === "true"
           ? `WHERE DATE(COALESCE(return_date, borrow_date)) = CURDATE()`
           : ""
       }`,
    );

    return res.status(200).json({
      data: rows,
      total: rows.length,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to get loans, please try again later.",
    });
  }
}
export async function getLoans(req, res) {
  try {
    const { search = "", page = 1 } = req.query;
    const limit = 5;
    const offset = (Math.max(Number(page) || 1, 1) - 1) * limit;

    const [rows] = await db.query(
      `SELECT * FROM loan
       ${search.trim() ? `WHERE (status LIKE ? OR library_id LIKE ? OR copy_id LIKE ?)` : ""}
       ORDER BY COALESCE(return_date, borrow_date) DESC, loan_id DESC
       LIMIT ? OFFSET ?`,
      [
        ...(search.trim()
          ? [`%${search.trim()}%`, `%${search.trim()}%`, `%${search.trim()}%`]
          : []),
        limit,
        offset,
      ],
    );

    const [count] = await db.query(
      `SELECT COUNT(*) AS total FROM loan
       ${search.trim() ? `WHERE (status LIKE ? OR library_id LIKE ? OR copy_id LIKE ?)` : ""}`,
      [
        ...(search.trim()
          ? [`%${search.trim()}%`, `%${search.trim()}%`, `%${search.trim()}%`]
          : []),
      ],
    );

    const total = count[0].total;

    return res.status(200).json({
      message: rows.length > 0 ? "Loans found." : "No loan records found.",
      data: rows,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to get loans, please try again later.",
    });
  }
}
export async function getLoan(req, res) {
  try {
    const { bookCopyId } = req.params;
    const [rows] = await db.query(
      `SELECT * FROM loan
       WHERE copy_id = ?
       AND status IN ('Borrowed', 'Overdue')
       ORDER BY loan_id DESC
       LIMIT 1`,
      [bookCopyId],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "This copy is not being actively loaned.",
      });
    }
    return res.status(200).json({
      message: "Loan found.",
      data: rows[0],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to get loan, please try again later.",
    });
  }
}
export async function getLoansOfUser(req, res) {
  try {
    const { libraryId } = req.params;
    const activeLoansOnly = req.query.activeLoansOnly === "true";

    const [data] = await db.query(
      `SELECT * FROM loan
       WHERE library_id = ?
       ${activeLoansOnly ? "AND status IN ('Borrowed', 'Overdue')" : ""}`,
      [libraryId],
    );

    return res.status(200).json({
      message: data.length > 0 ? "Loans found." : "No loans found.",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to retrieve loans associated with this user.",
    });
  }
}
export async function checkinLoan(req, res) {
  const connection = await db.getConnection();

  try {
    const { librarian, returns } = req.body;

    if (!librarian || !Array.isArray(returns) || returns.length === 0) {
      return res.status(400).json({
        message: "Invalid check-in request.",
      });
    }

    const loanIds = returns.map((item) => item.loanId);
    if (new Set(loanIds).size !== loanIds.length) {
      return res.status(400).json({
        message: "Duplicate loan IDs are not allowed.",
      });
    }

    await connection.beginTransaction();
    const bookIds = new Set();
    for (const { loanId, returnCondition } of returns) {
      {
        /*const recordsObject = {
        librarian: librarian.id,
        returns: loans.map((book) => ({
          loanId: book.loan.loan_id,
          returnCondition: book.isGoodCondition ? "Good" : "Defective",
        })),
      }; reference....*/
      }

      const [rows] = await connection.query(
        `SELECT due_date, copy_id, status
         FROM loan
         WHERE loan_id = ?
         FOR UPDATE`,
        [loanId],
      );

      if (rows.length === 0) {
        const error = new Error(`Loan ${loanId} not found.`);
        error.status = 404;
        throw error;
      }

      const loan = rows[0];

      if (!["Borrowed", "Overdue"].includes(loan.status)) {
        const error = new Error(`Loan ${loanId} has already been returned.`);
        error.status = 400;
        throw error;
      }

      const returnDate = new Date();
      const isReturnLate = returnDate > new Date(loan.due_date);

      await connection.query(
        `UPDATE loan
         SET return_date = ?,
             returned_by = ?,
             status = ?,
             is_return_late = ?,
             return_condition = ?
         WHERE loan_id = ?`,
        [
          returnDate,
          librarian,
          "Returned",
          isReturnLate,
          returnCondition,
          loanId,
        ],
      );

      await connection.query(
        `UPDATE book_copy
         SET status = ?
         WHERE copy_id = ?`,
        [returnCondition === "Good" ? "Available" : "Defective", loan.copy_id],
      );

      if (returnCondition === "Good") {
        bookIds.add(loan.copy_id.substring(0, 7));
      }
    }
    for (const bookId of bookIds) {
      await promoteReservation(bookId, connection);
    }
    await connection.commit();

    return res.status(200).json({
      message: "All books returned successfully!",
    });
  } catch (error) {
    await connection.rollback();

    console.error(error);

    return res.status(error.status || 500).json({
      message: error.status ? error.message : "Failed to process book returns.",
    });
  } finally {
    connection.release();
  }
}
export async function createLoan(req, res) {
  try {
    const { libraryId, copyIDs, librarianID } = req.body;

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 3);

    const [users] = await db.query(
      `SELECT name FROM user WHERE library_id = ?`,
      [libraryId],
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    for (const copyID of copyIDs) {
      await db.query(
        `INSERT INTO loan
        (library_id, copy_id, due_date, processed_by)
        VALUES (?, ?, ?, ?)`,
        [libraryId, copyID, dueDate, librarianID],
      );
      //Convert the involved book copies to borrowed
      await db.query(`UPDATE book_copy SET status = ? WHERE copy_id = ? `, [
        "Borrowed",
        copyID,
      ]);
    }

    return res.status(201).json({
      message: `Success! Loan records for ${users[0].name} have been created.`,
      data: {
        borrower: users[0].name,
        libraryId: libraryId,
        dueDate: dueDate,
        copyIDs: copyIDs,
      },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "Failed to create loan records.",
      error: error.message,
    });
  }
}
