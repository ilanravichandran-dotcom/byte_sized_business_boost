const { Pool } = require('pg');

const pool = global._pgPool || new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
global._pgPool = pool;

exports.handler = async function(event) {
  const userEmail = event.queryStringParameters && event.queryStringParameters.user_email;
  if (!userEmail) return { statusCode: 400, body: 'user_email required' };

  try {
    const res = await pool.query('SELECT business_id FROM favorites WHERE user_email = $1', [userEmail]);
    const ids = res.rows.map(r => r.business_id);
    return { statusCode: 200, body: JSON.stringify(ids) };
  } catch (err) {
    console.error('get-favorites error', err);
    return { statusCode: 500, body: 'Database error' };
  }
};
