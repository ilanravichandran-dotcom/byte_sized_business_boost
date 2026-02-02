const { Pool } = require('pg');

const pool = global._pgPool || new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
global._pgPool = pool;

exports.handler = async function(event) {
  const businessId = event.queryStringParameters && event.queryStringParameters.business_id;
  if (!businessId) {
    return { statusCode: 400, body: 'business_id required' };
  }

  try {
    const res = await pool.query(
      'SELECT id, business_id, user_email, author, rating, comment, created_at FROM reviews WHERE business_id = $1 ORDER BY created_at DESC',
      [businessId]
    );
    return { statusCode: 200, body: JSON.stringify(res.rows) };
  } catch (err) {
    console.error('get-reviews error', err);
    return { statusCode: 500, body: 'Database error' };
  }
};
