import pool from '../config/db.js';

const RESERVE_TTL_MIN = 5;

export const reserve = async ({ sku, quantity, idempotencyKey }) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Idempotency
    const [existing] = await conn.query(
      'SELECT * FROM reservations WHERE idempotency_key = ?',
      [idempotencyKey]
    );

    if (existing.length) {
      await conn.commit();
      return existing[0];
    }

    const [inv] = await conn.query(
      'SELECT quantity FROM inventory WHERE sku = ? FOR UPDATE',
      [sku]
    );

    if (!inv.length || inv[0].quantity < quantity) {
      throw new Error('Insufficient inventory');
    }

    await conn.query(
      'UPDATE inventory SET quantity = quantity - ? WHERE sku = ?',
      [quantity, sku]
    );

    const expiresAt = new Date(Date.now() + RESERVE_TTL_MIN * 60000);

    const [result] = await conn.query(
      `INSERT INTO reservations
       (sku, quantity, status, expires_at, idempotency_key)
       VALUES (?, ?, 'RESERVED', ?, ?)`,
      [sku, quantity, expiresAt, idempotencyKey]
    );

    await conn.commit();

    return { reservationId: result.insertId, expiresAt };
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
};

export const confirm = async (reservationId) => {
  const [res] = await pool.query(
    'UPDATE reservations SET status = "CONFIRMED" WHERE id = ? AND status = "RESERVED"',
    [reservationId]
  );

  if (!res.affectedRows) {
    throw new Error('Invalid reservation');
  }

  return { success: true };
};

export const cancel = async (reservationId) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [[res]] = await conn.query(
      'SELECT * FROM reservations WHERE id = ? FOR UPDATE',
      [reservationId]
    );

    if (!res || res.status !== 'RESERVED') {
      throw new Error('Invalid reservation');
    }

    await conn.query(
      'UPDATE inventory SET quantity = quantity + ? WHERE sku = ?',
      [res.quantity, res.sku]
    );

    await conn.query(
      'UPDATE reservations SET status = "CANCELLED" WHERE id = ?',
      [reservationId]
    );

    await conn.commit();
    return { cancelled: true };
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
};
