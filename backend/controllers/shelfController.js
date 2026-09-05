import db from "../config/db.js";

const emptyToNull = (value) => {
    return typeof value === 'string' && value.trim() === ''
        ? null
        : value;
};

export async function getShelves(req, res) {
    try {
    const [rows] = await db.query("SELECT * FROM shelf")
    res.json(rows)
    } catch (error) {
        res.status(500).json({
            message: "Failed to get books"
        });
    }
}