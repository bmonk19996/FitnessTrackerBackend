const pool = require('../db/client');

const tearDown = async ({watch, watchAll}) => {
  if (watch || watchAll) {
    return;
  }
  await pool.end();
  console.log("Client Ended");
}

module.exports = tearDown;