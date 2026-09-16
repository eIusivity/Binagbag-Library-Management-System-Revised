import { resumeToPipeableStream } from "react-dom/server";
import db from "../config/db.js";
import bcrypt from "bcrypt";
const emptyToNull = (value) => {
  return typeof value === "string" && value.trim() === "" ? null : value;
};
//role is automatically set to Patron so no need to include it here
export async function createUser(req, res) {
  try {
    const {
      first_name,
      middle_name,
      last_name,
      password,
      email,
      phone,
      user_type,
    } = req.body;

    if (!first_name || !last_name || !password) {
      return res.status(400).json({
        message: "First name, last name, and password are required",
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `INSERT INTO users (
        first_name,
        middle_name,
        last_name,
        password_hash,
        email,
        phone,
        user_type
      )
      VALUES (?, ?, ?, ?, ?, ?,?)`,
      [
        emptyToNull(first_name),
        emptyToNull(middle_name),
        emptyToNull(last_name),
        password_hash,
        emptyToNull(email),
        emptyToNull(phone),
        emptyToNull(user_type),
      ],
    );
    const librarians = await getUserByRoles("Librarian");
    res.status(201).json({
      message: "Registration submitted successfully",
      user_record_id: result.insertId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to register account",
      error: error.message,
    });
  }
}
export async function getUser(req, res) {
  try {
    const [rows] = await db.query(
      `SELECT
    user_record_id,
    patron_id,
    first_name,
    middle_name,
    last_name,
    email,
    phone,
    school_identifier,
    role,
    user_type,
    status,
    registration_source,
    created_at,
    approved_at
   FROM users
   WHERE user_record_id = ? OR patron_id = ? OR role = ?`,
      [req.params.id, req.params.id],
    );
    if (rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get book copy",
    });
  }
}
export async function getUsersByRole(role) {
  const [rows] = await db.query("SELECT patron_id FROM users WHERE role = ?", [
    role,
  ]);

  return rows;
}
