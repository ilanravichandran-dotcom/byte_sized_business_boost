const { Pool } = require('pg');

const pool = global._pgPool || new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
global._pgPool = pool;

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let body;
  try { body = JSON.parse(event.body || '{}'); } catch (e) { return { statusCode: 400, body: 'Invalid JSON' }; }
  const { business_id, user_email } = body;
  if (!business_id || !user_email) return { statusCode: 400, body: 'Missing fields' };

  try {
    // If exists -> remove, otherwise insert
    const existing = await pool.query('SELECT id FROM favorites WHERE business_id = $1 AND user_email = $2', [business_id, user_email]);
    if (existing.rows.length > 0) {
      await pool.query('DELETE FROM favorites WHERE id = $1', [existing.rows[0].id]);
      return { statusCode: 200, body: JSON.stringify({ action: 'removed' }) };
    } else {
      await pool.query('INSERT INTO favorites (business_id, user_email) VALUES ($1, $2)', [business_id, user_email]);
      return { statusCode: 200, body: JSON.stringify({ action: 'added' }) };
    }
  } catch (err) {
    console.error('toggle-favorite error', err);
    return { statusCode: 500, body: 'Database error' };
  }
};
