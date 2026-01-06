import pool from '../config/db.js';

export default function startExpiryJob() {
  setInterval(async () => {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [rows] = await conn.query(
        `SELECT * FROM reservations
         WHERE status = 'RESERVED' AND expires_at < NOW()
         FOR UPDATE`
      );

      for (const r of rows) {
        await conn.query(
          'UPDATE inventory SET quantity = quantity + ? WHERE sku = ?',
          [r.quantity, r.sku]
        );

        await conn.query(
          'UPDATE reservations SET status = "EXPIRED" WHERE id = ?',
          [r.id]
        );
      }

      await conn.commit();
    } catch (e) {
      await conn.rollback();
    } finally {
      conn.release();
    }
  }, 60000);
}
