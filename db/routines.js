const pool = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const client = await pool.connect();
    const result = await client.query(
      `
    INSERT INTO routines(creatorId, isPublic, name, goal)
    VALUES ($1, $2, $3, $4)
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

async function getRoutineById(id) {
  try {
    const client = await pool.connect();
    const {
      rows: [activity],
    } = await client.query(`
      SELECT * FROM routines
      WHERE "id"=${id};
    `);
    client.release();
    return activity;
  } catch (e) {
    throw e;
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const client = await pool.connect();
    const { rows } = await client.query(`
    SELECT * FROM routines
    `);
    client.release();
    return rows;
  } catch (e) {
    throw e;
  }
}
  //not finished
async function getAllRoutines() {
  try {
    const client = await pool.connect();
    const { rows } = await client.query(`
    SELECT * FROM routines
    `);
    client.release();
    return rows;
  } catch (e) {
    throw e;
  }

}

async function getAllPublicRoutines() {
  try {
    const client = await pool.connect();
    const { rows } = await client.query(`
    SELECT * FROM routines
    WHERE "isPublic"=true;
    `);
    client.release();
    return rows;
  } catch (e) {
    throw e;
  }
}

async function getAllRoutinesByUser({ username }) {}

async function getPublicRoutinesByUser({ username }) {}

async function getPublicRoutinesByActivity({ id }) {}

async function updateRoutine({ id, ...fields }) {}

async function destroyRoutine(id) {}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
