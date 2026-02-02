#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');
const { Pool } = require('pg');

async function run() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL environment variable is required');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });
  const migrationsDir = path.join(__dirname, '..', 'migrations');

  try {
    const files = await fs.readdir(migrationsDir);
    const sqlFiles = files.filter(f => f.endsWith('.sql')).sort();

    // Ensure migrations table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename TEXT UNIQUE NOT NULL,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    for (const file of sqlFiles) {
      const { rowCount } = await pool.query('SELECT 1 FROM migrations WHERE filename = $1', [file]);
      if (rowCount > 0) {
        console.log(`Skipping ${file} (already applied)`);
        continue;
      }

      console.log(`Applying migration: ${file}`);
      const sql = await fs.readFile(path.join(migrationsDir, file), 'utf8');

      try {
        await pool.query('BEGIN');
        await pool.query(sql);
        await pool.query('INSERT INTO migrations (filename) VALUES ($1)', [file]);
        await pool.query('COMMIT');
        console.log(`Applied ${file}`);
      } catch (err) {
        await pool.query('ROLLBACK');
        console.error(`Failed to apply ${file}:`, err.message || err);
        process.exit(1);
      }
    }

    console.log('All migrations applied');
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('Migration runner error:', err.message || err);
    process.exit(1);
  }
}

run();
