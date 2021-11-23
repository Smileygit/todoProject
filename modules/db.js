// setup connection -------------------------
const pg = require('pg');
const dbURI =
  'postgres://ljqduddidyosys:b34d51271de1e97771741fad163a9ab083dbb227afdda3748839e2fe1f470520@ec2-18-202-67-49.eu-west-1.compute.amazonaws.com:5432/df3heveirs0pji';
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
dbMethods.createBlogPost = function (heading, itemtext, userid) {
  let sql =
    'INSERT INTO todoposts (id, date, heading, itemtext, userid) VALUES(DEFAULT, DEFAULT, $1, $2, $3) returning *';
  let values = [heading, itemtext, userid];
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
