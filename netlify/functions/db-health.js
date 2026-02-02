const { Pool } = require('pg');

const pool = global._pgPool || new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
global._pgPool = pool;

exports.handler = async function() {
  try {
    const res = await pool.query('SELECT 1');
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('db-health error', err);
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: String(err) }) };
  }
};
