// test_db.js
require('dotenv').config();
const pool = require('./event_db');

(async () => {
  try {
    const [rows] = await pool.query('SELECT COUNT(*) AS cnt FROM events');
    console.log('Events in DB:', rows[0].cnt);
    const [rows2] = await pool.query('SELECT event_id, name, event_date, is_suspended FROM events ORDER BY event_date LIMIT 5');
    console.table(rows2);
    process.exit(0);
  } catch (err) {
    console.error('DB test failed:', err.message);
    process.exit(1);
  }
})();
