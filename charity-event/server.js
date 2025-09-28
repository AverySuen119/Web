// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./event_db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

/**
 * Helper: validate integer in range, returns number or null
 */
function toIntInRange(val, min = -Infinity, max = Infinity) {
  if (val === undefined || val === null || val === '') return null;
  const n = Number(val);
  if (!Number.isInteger(n)) return null;
  if (n < min || n > max) return null;
  return n;
}

/**
 * Get single event by id (includes image_url, category and organisation info)
 */
async function getEventByIdFromDB(id) {
  const sql = `
    SELECT e.*, c.name AS category_name, o.name AS organisation_name, o.contact_email, o.website
    FROM events e
    JOIN categories c ON e.category_id = c.category_id
    JOIN organisations o ON e.organisation_id = o.organisation_id
    WHERE e.event_id = ?;
  `;
  const [rows] = await pool.query(sql, [id]);
  return rows[0] || null;
}

/* -------------------------
   Categories
   ------------------------- */
app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json(rows);
  } catch (err) {
    console.error('GET /api/categories error', err);
    res.status(500).json({ error: 'DB error' });
  }
});

/* -------------------------
   Events list (homepage)
   Query params:
     - upcoming=true
     - includePast=true
     - limit=number
   ------------------------- */
app.get('/api/events', async (req, res) => {
  try {
    const { upcoming, includePast, limit } = req.query;
    let sql = `
      SELECT e.event_id, e.name, e.short_desc, e.event_date, e.location_name,
             e.price, e.is_free, e.image_url, c.name AS category_name, e.is_suspended
      FROM events e
      JOIN categories c ON e.category_id = c.category_id
      WHERE e.is_suspended = 0
    `;
    const params = [];

    // 默认显示未来的活动；如果请求了 includePast=true，则显示所有（包含过去）
    if (upcoming === 'true' || !includePast) {
      sql += ' AND e.event_date >= NOW()';
    }

    sql += ' ORDER BY e.event_date ASC';

    if (limit) {
      const n = parseInt(limit, 10);
      if (!Number.isNaN(n) && n > 0) {
        sql += ' LIMIT ?';
        params.push(n);
      }
    }

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('GET /api/events error', err);
    res.status(500).json({ error: 'DB error' });
  }
});

/* -------------------------
   Search endpoint
   Accepts optional query params:
     - year (YYYY)
     - month (1-12 or '01'..'12')
     - day (1-31 or '01'..'31')
     - location (string, matches location_name or location_address)
     - category (comma-separated ids, or name text)
   Returns image_url too so front-end can show thumbnails.
   ------------------------- */
app.get('/api/events/search', async (req, res) => {
  try {
    const { year, month, day, location, category } = req.query;

    // validate date parts
    const y = toIntInRange(year, 1000, 9999);         // reasonable year
    const m = toIntInRange(month, 1, 12);
    const d = toIntInRange(day, 1, 31);

    let sql = `
      SELECT e.event_id, e.name, e.short_desc, e.event_date, e.location_name,
             e.price, e.is_free, e.image_url, c.name AS category_name
      FROM events e
      JOIN categories c ON e.category_id = c.category_id
      WHERE e.is_suspended = 0
    `;
    const params = [];

    if (y !== null) { sql += ' AND YEAR(e.event_date) = ?'; params.push(y); }
    if (m !== null) { sql += ' AND MONTH(e.event_date) = ?'; params.push(m); }
    if (d !== null) { sql += ' AND DAY(e.event_date) = ?'; params.push(d); }

    if (location && String(location).trim() !== '') {
      sql += ' AND (e.location_name LIKE ? OR e.location_address LIKE ?)';
      const like = `%${location.trim()}%`;
      params.push(like, like);
    }

    if (category && String(category).trim() !== '') {
      const raw = String(category).trim();
      // try parse comma-separated ids
      const ids = raw.split(',').map(s => s.trim()).map(s => Number(s)).filter(n => Number.isInteger(n) && n > 0);
      if (ids.length > 0) {
        const placeholders = ids.map(() => '?').join(',');
        sql += ` AND e.category_id IN (${placeholders})`;
        params.push(...ids);
      } else {
        // treat as (partial) category name
        sql += ' AND c.name LIKE ?';
        params.push(`%${raw}%`);
      }
    }

    sql += ' ORDER BY e.event_date ASC';

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('GET /api/events/search error', err);
    res.status(500).json({ error: 'DB error' });
  }
});

/* -------------------------
   Single event details (after search route)
   ------------------------- */
app.get('/api/events/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const event = await getEventByIdFromDB(id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    console.error('GET /api/events/:id error', err);
    res.status(500).json({ error: 'DB error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
