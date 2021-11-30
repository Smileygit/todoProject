const pg = require('pg');
const dbURI =
  'postgres://bhjlhxpyibkoix:175c4bbc8fe62a3070c3cf8497ecd469aada78157b8fdaaea83c734716731636@ec2-54-155-92-75.eu-west-1.compute.amazonaws.com:5432/dd0mdr65qkh4eo';
const connstring = process.env.DATABASE_URL || dbURI;
const pool = new pg.Pool({
  connectionString: connstring,
  ssl: { rejectUnauthorized: false },
});
let dbMethods = {};

dbMethods.getUserPosts = function (userid) {
  let sql = 'SELECT * FROM todoposts WHERE userid=$1';
  let values = [userid];
  return pool.query(sql, values); //return the promise
};

dbMethods.createPost = function (heading, blogtext, userid) {
  let sql =
    'INSERT INTO todoposts (id, date, heading, blogtext, userid) VALUES(DEFAULT, DEFAULT, $1, $2, $3) returning *';
  let values = [heading, blogtext, userid];
  return pool.query(sql, values); //return the promise
};

dbMethods.deleteUserPost = function (id, userid) {
  let sql = 'DELETE FROM todoposts WHERE id = $1 AND userid = $2 RETURNING *';
  let values = [id, userid];
  return pool.query(sql, values); //return the promise
};

//-------------------------------------------
dbMethods.getUsers = function () {
  let sql = 'SELECT id, username FROM todousers';
  return pool.query(sql); //return the promise
};

dbMethods.getUser = function (username) {
  let sql = 'SELECT * FROM todousers WHERE username = $1';
  let values = [username];
  return pool.query(sql, values); //return the promise
};

dbMethods.getUserId = function (userid) {
  let sql = 'SELECT username FROM todousers WHERE id = $1';
  let values = [userid];
  return pool.query(sql, values); //return the promise
};

dbMethods.createUser = function (username, password, salt) {
  let sql =
    'INSERT INTO todousers (id, username, password, salt) VALUES(DEFAULT, $1, $2, $3) returning *';
  let values = [username, password, salt];
  return pool.query(sql, values); //return the promise
};

dbMethods.deleteUser = function (id) {
  let sql = 'DELETE FROM todousers WHERE id = $1 RETURNING *';
  let values = [id];
  return pool.query(sql, values); //return the promise
};

// export dbMethods -------------------------
module.exports = dbMethods;
