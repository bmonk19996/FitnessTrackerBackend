const pool = require("./client");

// database functions
async function createActivity({ name, description }) {
  // return the new activity
  try {
    const client = await pool.connect();
    const {
      rows: [activity],
    } = await client.query(
      `
    INSERT INTO activities(name, description)
    VALUES ($1, $2)
    ON CONFLICT (name) DO NOTHING
    RETURNING *;
    `,
      [name, description]
    );
    client.release();
    return activity;
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
      WHERE "name"='${name}';
    `);
    client.release();
    return activity;
  } catch (e) {
    throw e;
  }
}

// used as a helper inside db/routines.js
async function attachActivitiesToRoutines(routines) {
  // no side effects
  const routinesToReturn = [...routines];
  const binds = routines.map((_, index) => `$${index + 1}`).join(", ");
  const routineIds = routines.map((routine) => routine.id);
  if (!routineIds?.length) return [];

  try {
    // get the activities, JOIN with routine_activities (so we can get a routineId), and only those that have those routine ids on the routine_activities join
    const client = await pool.connect();
    const { rows: activities } = await client.query(
      `
      SELECT activities.*, routine_activities.duration, routine_activities.count, routine_activities.id AS "routineActivityId", routine_activities."routineId"
      FROM activities 
      JOIN routine_activities ON routine_activities."activityId" = activities.id
      WHERE routine_activities."routineId" IN (${binds});
    `,
      routineIds
    );
    // loop over the routines
    for (const routine of routinesToReturn) {
      // filter the activities to only include those that have this routineId
      const activitiesToAdd = activities.filter(
        (activity) => activity.routineId === routine.id
      );
      // attach the activities to each single routine
      routine.activities = activitiesToAdd;
    }
    client.release();
    return routinesToReturn;
  } catch (error) {
    throw error;
  }
}

async function updateActivity({ id, ...fields }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity

  try {
    const setString = Object.keys(fields)
      .map((key, index) => `"${key}"=$${index + 1}`)
      .join(", ");
    const client = await pool.connect();
    const {
      rows: [activity],
    } = await client.query(
      `
      UPDATE activities
      set ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
      Object.values(fields)
    );
    client.release();
    return activity;
  } catch (e) {
    throw e;
  }
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
