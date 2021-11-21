// setup connection -------------------------
const pg = require('pg');
const dbURI =
  'postgres://gjkhdfjjozkddz:486cca111bc90c7d108645e44937a0eb28a22a08dd5e9f84e81c2df63670a88c@ec2-54-78-211-131.eu-west-1.compute.amazonaws.com:5432/duimp5bqjcctq';
const connstring = process.env.DATABASE_URL || dbURI;
const pool = new pg.Pool({
  connectionString: connstring,
  ssl: { rejectUnauthorized: false },
});

// database methods -------------------------
let dbMethods = {}; //create empty object

// ------------------------------------
dbMethods.getAllBlogPosts = function () {
  let sql = 'SELECT * FROM todoposts';
  return pool.query(sql); //return the promise
};

// ------------------------------------
dbMethods.createBlogPost = function (heading, blogtext, userid) {
  let sql =
    'INSERT INTO todoposts (id, date, heading, blogtext, userid) VALUES(DEFAULT, DEFAULT, $1, $2, $3) returning *';
  let values = [heading, blogtext, userid];
  return pool.query(sql, values); //return the promise
};

// ------------------------------------
dbMethods.deleteBlogPost = function (id) {
  let sql = 'DELETE FROM todoposts WHERE id = $1 RETURNING *';
  let values = [id];
  return pool.query(sql, values); //return the promise
};

// export dbMethods -------------------------
module.exports = dbMethods;
