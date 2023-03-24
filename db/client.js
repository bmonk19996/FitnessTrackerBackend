// const { Pool } = require('pg');

// const connectionString = process.env.DATABASE_URL;

// const pool = new Pool({
//   user: 'JavaScriptCodingGuru',
//   password: 'v2_42T87_ayBp5LTg6PXYwhv94nPD5dv',
//   host: 'db.bit.io',
//   port: 5432,
//   database: 'JavaScriptCodingGuru/fitness-tracker',
//   ssl: true
// });

// module.exports = pool;

const { Pool } = require("pg");

const connectionString =
  process.env.DATABASE_URL || "https://localhost:5432/fitness-dev";

const pool = new Pool({
  connectionString,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : undefined,
});

module.exports = pool;
