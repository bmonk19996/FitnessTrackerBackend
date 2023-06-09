const pool = require("./client");
const { getUserByUsername } = require("./users");
const { attachActivitiesToRoutines } = require("./activities");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const client = await pool.connect();
    const {
      rows: [routine],
    } = await client.query(
      `
    INSERT INTO routines("creatorId", "isPublic", name, goal)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (name) DO NOTHING
    RETURNING *;
    `,
      [creatorId, isPublic, name, goal]
    );
    await client.release();
    return routine;
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
    await client.release();
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
    await client.release();
    return rows;
  } catch (e) {
    throw e;
  }
}

async function getAllRoutines() {
  try {
    const client = await pool.connect();
    const { rows } = await client.query(`
    SELECT routines.*, users.username AS "creatorName" FROM routines
    join users ON routines."creatorId"=users.id;
    `);
    await client.release();

    const routines = await attachActivitiesToRoutines(rows);

    return routines;
  } catch (e) {
    throw e;
  }
}

async function getAllPublicRoutines() {
  try {
    const client = await pool.connect();
    const { rows } = await client.query(`
    SELECT routines.*, users.username AS "creatorName" FROM routines
    join users ON routines."creatorId"=users.id
    WHERE "isPublic"=true;
    `);
    await client.release();
    const routines = await attachActivitiesToRoutines(rows);

    return routines;
  } catch (e) {
    throw e;
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const user = await getUserByUsername(username);
    const client = await pool.connect();
    const { rows } = await client.query(`
    SELECT routines.*, users.username AS "creatorName" FROM routines
    join users ON routines."creatorId"=users.id
    WHERE "creatorId"=${user.id};
    `);
    await client.release();
    const routines = await attachActivitiesToRoutines(rows);
    return routines;
  } catch (e) {
    throw e;
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const routines = await getAllRoutinesByUser({ username });
    const publicRoutines = routines.filter(
      (routine) => routine.isPublic === true
    );
    return publicRoutines;
  } catch (e) {
    throw e;
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const client = await pool.connect();
    const { rows } = await client.query(`
      SELECT routines.*, users.username AS "creatorName" 
      FROM routines
      JOIN users ON routines."creatorId"=users.id
      JOIN routine_activities ON routine_activities."routineId"=routines.id
      WHERE routine_activities."activityId"=${id} 
      AND routines."isPublic"=true;
    `);

    await client.release();
    const routines = attachActivitiesToRoutines(rows);
    return routines;
  } catch (e) {
    throw e;
  }
}

async function updateRoutine({ id, ...fields }) {
  try {
    const setString = Object.keys(fields)
      .map((key, index) => `"${key}"=$${index + 1}`)
      .join(", ");

    const client = await pool.connect();
    const {
      rows: [routine],
    } = await client.query(
      `
      UPDATE routines
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
      Object.values(fields)
    );
    await client.release();
    return routine;
  } catch (e) {
    throw e;
  }
}

async function destroyRoutine(id) {
  try {
    const client = await pool.connect();
    const {
      rows: [routine],
    }  = await client.query(`
      DELETE FROM routines
      WHERE id=${id}
      RETURNING *;
    `);
    await client.release();
    return routine
  } catch (e) {
    throw e;
  }
}

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
