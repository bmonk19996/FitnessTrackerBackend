const pool = require("./client");

// database functions
async function createActivity({ name, description }) {
  // return the new activity
  try {
    const client = await pool.connect();
    const result = await client.query(
      `
    INSERT INTO activities(name, description)
    VALUES ($1, $2)
    ON CONFLICT (name) DO NOTHING
    RETURNING *;
    `,
      [name, description]
    );
    client.release();
    return result.rows;
  } catch (e) {
    throw e;
  }
}

async function getAllActivities() {
  // select and return an array of all activities
  try {
    const client = await pool.connect();
    const { rows } = await client.query(`
    SELECT * FROM activities
    `);
    client.release();
    return rows;
  } catch (e) {
    throw e;
  }
}

async function getActivityById(id) {
  try {
    const client = await pool.connect();
    const {
      rows: [activity],
    } = await client.query(`
      SELECT * FROM activities
      WHERE "id"=${id};
    `);
    client.release();
    return activity;
  } catch (e) {
    throw e;
  }
}

async function getActivityByName(name) {
  try {
    const client = await pool.connect();
    const {
      rows: [activity],
    } = await client.query(`
      SELECT * FROM activities
      WHERE "name"=${name};
    `);
    client.release();
    return activity;
  } catch (e) {
    throw e;
  }
}

// used as a helper inside db/routines.js
async function attachActivitiesToRoutines(routines) {}

async function updateActivity({ id, ...fields }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
