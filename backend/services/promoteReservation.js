export async function promoteReservation(bookId, connection) {
  //Big brain move of 2026: No need to determine how many copies available in paraeters now, just pass the bookId, and promoteReservation queries in book_copy

  // Find available physical copies
  const [copies] = await connection.query(
    `SELECT copy_id
     FROM book_copy
     WHERE book_id = ?
       AND status = 'Available'
     ORDER BY copy_id
     FOR UPDATE`,
    [bookId],
  );

  if (copies.length === 0) return false;

  // Find waiting reservations in queue order
  const [reservations] = await connection.query(
    `SELECT reservation_id
     FROM reservation
     WHERE book_id = ?
       AND status = 'Waiting'
     ORDER BY queue_position ASC
     LIMIT ?
     FOR UPDATE`,
    [bookId, copies.length],
  );

  if (reservations.length === 0) return false;

  // Promote each reservation and allocate one physical copy
  for (let i = 0; i < reservations.length; i++) {
    await connection.query(
      `UPDATE reservation
       SET queue_position = 0,
           status = 'Ready',
           ready_date = NOW(),
           expiry_date = DATE_ADD(NOW(), INTERVAL 24 HOUR)
       WHERE reservation_id = ?`,
      [reservations[i].reservation_id],
    );

    await connection.query(
      `UPDATE book_copy
       SET status = 'Reserved'
       WHERE copy_id = ?`,
      [copies[i].copy_id],
    );
  }

  // Shift remaining waiting reservations
  await connection.query(
    `UPDATE reservation
     SET queue_position = queue_position - ?
     WHERE book_id = ?
       AND status = 'Waiting'`,
    [reservations.length, bookId],
  );

  return true;
}
