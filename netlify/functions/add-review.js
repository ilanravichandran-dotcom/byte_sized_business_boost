const { Pool } = require('pg');

// Reuse pool between invocations
const pool = global._pgPool || new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
global._pgPool = pool;

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const { business_id, author, rating, comment, user_email } = body;
  if (!business_id || !author || !rating || !comment) {
    return { statusCode: 400, body: 'Missing required fields' };
  }

  try {
    const res = await pool.query(
      `INSERT INTO reviews (business_id, user_email, author, rating, comment)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [business_id, user_email || null, author, rating, comment]
    );

    return { statusCode: 200, body: JSON.stringify(res.rows[0]) };
  } catch (err) {
    console.error('add-review error', err);
    return { statusCode: 500, body: 'Database error' };
  }
};
