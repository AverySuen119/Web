require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./event_db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

// 获取单个事件详情
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

// 获取所有类别
app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// 获取所有/即将到来的事件
app.get('/api/events', async (req, res) => {
  try {
    const { upcoming, includePast, limit } = req.query;
    let sql = `
      SELECT e.event_id, e.name, e.short_desc, e.event_date, e.location_name, e.price, e.is_free, e.image_url, c.name AS category_name, e.is_suspended
      FROM events e
      JOIN categories c ON e.category_id = c.category_id
      WHERE e.is_suspended = 0
    `;
    const params = [];

    if (upcoming === 'true' || !includePast) {
      sql += ' AND e.event_date >= NOW()';
    }

    sql += ' ORDER BY e.event_date ASC';
    if (limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(limit, 10));
    }

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// 搜索事件 API
app.get('/api/events/search', async (req, res) => {
  try {
    const { year, month, day, location, category } = req.query;
    let sql = `
      SELECT e.event_id, e.name, e.short_desc, e.event_date, e.location_name, e.price, e.is_free, c.name AS category_name
      FROM events e
      JOIN categories c ON e.category_id = c.category_id
      WHERE e.is_suspended = 0
    `;
    const params = [];

    // 只拼接存在的日期条件
    if (year) { sql += ' AND YEAR(e.event_date) = ?'; params.push(parseInt(year, 10)); }
    if (month) { sql += ' AND MONTH(e.event_date) = ?'; params.push(parseInt(month, 10)); }
    if (day) { sql += ' AND DAY(e.event_date) = ?'; params.push(parseInt(day, 10)); }

    if (location) {
      sql += ' AND (e.location_name LIKE ? OR e.location_address LIKE ?)';
      const like = `%${location}%`;
      params.push(like, like);
    }

    if (category) {
      const ids = category.split(',').map(s => parseInt(s, 10)).filter(Boolean);
      if (ids.length > 0) {
        const placeholders = ids.map(() => '?').join(',');
        sql += ` AND e.category_id IN (${placeholders})`;
        params.push(...ids);
      } else {
        sql += ' AND c.name LIKE ?';
        params.push(`%${category}%`);
      }
    }

    sql += ' ORDER BY e.event_date ASC';
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// 单个事件详情（必须放在 search 路由后面）
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
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
