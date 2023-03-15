// const { Pool } = require('pg');

// const connectionString = process.env.DATABASE_URL;

// const pool = new Pool({
//   user: 'postgres',
//   password: 'password',
//   host: 'localhost',
//   port: 5555,
//   database: 'fitness-dev',
//   ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
// });

// module.exports = pool;

const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'https://localhost:5432/fitness-dev';

const client = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

module.exports = client;