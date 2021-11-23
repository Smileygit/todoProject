const express = require('express');
const db = require('./db.js');
const authUtils = require('./auth_utils.js');
const { verifyPassword } = require('./auth_utils.js');
const dbMethods = require('./db.js');
const router = express.Router();

//endpoints------------------------------

//user login-----------------------------
router.post('/todousers/login', async function (req, res, next) {
  let credString = req.headers.authorization;
  let cred = authUtils.decodeCred(credString);
  //console.log(cred);

  if (cred.username == '' || cred.password == '') {
    res.status(401).json({ error: 'No username or password' }).end();
    return;
  }
  let hash = authUtils.createHash(cred.password);

  try {
    let data = await db.getUser(cred.username);
    let userid = data.rows[0].id;
    let userPassword = data.rows[0].password;

    let tok = authUtils.createToken(username, userid);

    let verify = authUtils.verifyPassword(
      hash,
      userPassword.hash,
      userPassword.salt
    );

    if (data.rows.length > 0 && verify === true) {
      res
        .status(200)
        .json({ msg: 'The login was succefully', token: tok })
        .end();
    } else {
      throw 'the user doesn`t exist';
      return;
    }
  } catch (err) {
    next(err);
  }
});

//list allusers-------------------------
router.get('/todousers', async function (req, res, next) {
  res.status(200).send('Hello from GET - /todousers').end();
});

//create a new user-------------------------------
router.post('/todousers', async function (req, res, next) {
  let credString = req.headers.authorization;
  let cred = authUtils.decodeCred(credString);

  if (cred.username == '' || cred.password == '') {
    res.status(401).json({ error: 'No username or password' }).end();
    return;
  }
  let hash = authUtils.createHash(cred.password);

  try {
    let data = await db.createUser(cred.username, hash.value, hash.salt);

    if (data.rows.length > 0) {
      console.log(cred.username);
      res.status(200).json({ msg: 'The user was created succefully' }).end();
    } else {
      throw 'the user coldn`t be created';
    }
  } catch (err) {
    next(err);
  }
});

//delete a user-----------------
router.delete('/todousers', async function (req, res, next) {
  res.status(200).send('Hello from DELETE - /todousers').end();
});

//---------------------------------------------------
module.exports = router;
