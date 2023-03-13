const pool = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try{
    const client = await pool.connect();
    const {rows:[routineActivity]} = await client.query(`
      INSERT INTO routine_activities("routineId", "activityId", count, duration)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `, [routineId, activityId, count, duration]);
    client.release();
    return routineActivity;
  }
  catch(e)
  {
    throw e;
  }
}

async function getRoutineActivityById(id) {
  try {
    const client = await pool.connect();
    const {
      rows: [activity],
    } = await client.query(`
      SELECT * FROM routine_activies
      WHERE "id"=${id};
    `);
    client.release();
    return activity;
  } catch (e) {
    throw e;
  }
}

async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const client = await pool.connect();
    const {
      rows: [activity],
    } = await client.query(`
      SELECT * FROM activities
      WHERE "routineId"=${id};
    `);
    client.release();
    return activity;
  } catch (e) {
    throw e;
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  try
  {
    const setString = Object.keys(fields).map(
      (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');

    const client = await pool.connect();
    const {rows:[routine]} = await client.query(`
      UPDATE routine_activities
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `, Object.values(fields));
    client.release();
    return routine;
  }
  catch(e)
  {
    throw e;
  }
}

async function destroyRoutineActivity(id) {
  try
  {
    const client = await pool.connect();
    await client.query(`
      DELETE FROM routine_activities
      WHERE id=${id};
    `)
    client.release();
  }
  catch(e)
  {
    throw e;
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
