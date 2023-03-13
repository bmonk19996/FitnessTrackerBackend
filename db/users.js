const pool = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  try
  {
    const client = await pool.connect();
    const result = await client.query(`
    INSERT INTO users(username, password)
    VALUES ($1, $2)
    ON CONFLICT (username) DO NOTHING
    RETURNING *;
    `, [username, password]);
    client.release();
    return result.rows;
  }
  catch(e)
  {
    throw e;
  }
}

async function getUser({ username, password }) {
  try
  {
    const client = await pool.connect();
    const{rows:[user]} = await client.query(`
    SELECT * FROM users
    WHERE username=${username}
    `)
    if(!user || user.password != password)
    {
      return null;
    }
    delete user.password;
    client.release();
    return user;
  }
  catch(e)
  {
    throw e;
  }
}

async function getUserById(userId) {
  try
  {
    const client = await pool.connect();
    const {rows:[user]} = await client.query(`
      SELECT * FROM users
      WHERE "id"=${userId};
    `)

    if(!user)
    {
      return null;
    }
    delete user.password;
    
    client.release();
    return user;
  }
  catch(e)
  {
    throw e;
  }
}

async function getUserByUsername(userName) {

  try
  {
    const client = await pool.connect();
    const {rows:[user]} = await client.query(`
      SELECT * FROM users
      WHERE username=${userName};
    `)
    if(!user)
    {
      return null;
    }
    delete user.password;
    client.release();
    
    return user;
  }
  catch(e)
  {
    throw e
  }


}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
