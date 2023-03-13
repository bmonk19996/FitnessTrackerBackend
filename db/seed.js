/* 
DO NOT CHANGE THIS FILE
*/
const pool= require('./client');
const { rebuildDB } = require('./seedData');

rebuildDB()
  .catch(console.error)
  .finally(() => pool.end());
