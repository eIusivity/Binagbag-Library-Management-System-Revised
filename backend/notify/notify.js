import db from "../config/db.js";
import { getIO } from "../socket.js";
export async function createNotification(notification) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const {
      notification_type,
      title,
      content,
      action,
      reference_id,
      audience,
    } = notification;
    if (!audience || (audience.user_id == null && audience.role == null)) {
      throw new Error("Notification must have an audience!");
    }

    const [notificationResult] = await connection.query(
      `INSERT INTO notification(
        notification_type,
        title,
        content,
        action,
        reference_id
        ) VALUES(?, ?, ?, ?, ?)`,
      [notification_type, title, content, action, reference_id],
    );
    const notificationId = notificationResult.insertId;

    await connection.query(
      `INSERT INTO notification_audience(notification_id,recipient_user_id,recipient_role) VALUES(?, ?, ?)`,
      [notificationId, audience?.user_id ?? null, audience?.role ?? null],
    );
    if (action === "ACCOUNT_REGISTRATION" && audience.role === "Librarian") {
      await connection.query(
        `INSERT INTO notification_audience(
      notification_id,
      recipient_user_id,
      recipient_role
    ) VALUES (?, ?, ?)`,
        [notificationId, null, "Administrator"],
      );
    } //Forgot to add admin as well, now admins and librarians will both be notified, basically: If it sees that the notification is intended for Librarians, create a subsequent audience record for Admins too
    await connection.commit();

    getIO().to("Librarian").to("Administrator").emit("snackbar", {
      title: notification.title,
      content: notification.content,
      severity: "info",
      action: "ACCOUNT_REGISTRATION",
    });

    getIO().to("Librarian").to("Administrator").emit("new-registration");
    return {
      notification_id: notificationId,
      message: "Notification created successfully!",
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
export async function markNotificationAsRead(notificationId, userId) {
  const [result] = await db.query(
    `
    INSERT IGNORE INTO notification_receipt
      (notification_id, user_id, read_at)
    VALUES (?, ?, NOW())
    `,
    [notificationId, userId],
  );

  return result;
}
export async function getUnreadNotificationCount(userId, userRole) {
  const [rows] = await db.query(
    `
    SELECT COUNT(*) AS unread_count
    FROM notification n

    JOIN notification_audience na
      ON na.notification_id = n.notification_id

    LEFT JOIN notification_receipt nr
      ON nr.notification_id = n.notification_id
      AND nr.user_id = ?

    WHERE
      (
        na.recipient_user_id = ?
        OR na.recipient_role = ?
      )
      AND nr.notification_id IS NULL
    `,
    [userId, userId, userRole],
  );

  return rows[0].unread_count;
}
export async function getNotificationsForUser(userId, userRole) {
  const [rows] = await db.query(
    `
    SELECT
      n.notification_id,
      n.notification_type,
      n.title,
      n.content,
      n.action,
      n.reference_id,
      n.created_at,

      CASE
        WHEN nr.notification_id IS NULL THEN FALSE
        ELSE TRUE
      END AS is_read

    FROM notification n

    JOIN notification_audience na
      ON na.notification_id = n.notification_id

    LEFT JOIN notification_receipt nr
      ON nr.notification_id = n.notification_id
      AND nr.user_id = ?

    WHERE
      na.recipient_user_id = ?
      OR na.recipient_role = ?

    ORDER BY n.created_at DESC
    `,
    [userId, userId, userRole],
  );

  return rows;
}
