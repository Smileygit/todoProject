const express = require('express');
const db = require('./db.js');
const authUtils = require('./auth_utils.js');
const { verifyPassword } = require('./auth_utils.js');
const dbMethods = require('./db.js');
const protect = require('./auth.js');
const { json } = require('express');
const router = express.Router();

//endpoints------------------------------
router.get('/userid', protect, async function (req, res, next) {
  let userid = res.locals.userid;
  try {
    let data = await db.getUserId(userid);
    res.status(200).json(data.rows[0]).end();
  } catch (err) {
    console.log(err);
    next(err);
  }
});
//user login-----------------------------
router.post('/todousers/login', async function (req, res, next) {
  let credString = req.headers.authorization;
  let cred = authUtils.decodeCred(credString);

  if (cred.username == '' || cred.password == '') {
    res
      .status(401)
      .json({ error: 'You must insert both username and password' })
      .end();
    return;
  }
  let hash = authUtils.createHash(cred.password);

  try {
    let data = await db.getUser(cred.username);
    let user = data.rows[0];
    let userid = user.id;

    let tok = authUtils.createToken(cred.username, userid);

    let verify = authUtils.verifyPassword(
      cred.password,
      user.password,
      user.salt
    );

    if (data.rows.length > 0 && verify === true) {
      res
        .status(200)
        .json({ msg: 'The login was succefully', token: tok })
        .end();
      return;
    } else {
      if (verify === false) {
        res.status(403).json({ error: 'Password is wrong, try again' }).end();
      } else {
        throw 'The user doesn`t exist';
        return;
      }
    }
  } catch (err) {
    json({ error: err });
    next(err);
  }
});

//list allusers-------------------------
router.get('/todousers', protect, async function (req, res, next) {
  res.status(200).send('Hello from GET - /todousers').end();
});

//create a new user-------------------------------
router.post('/todousers', async function (req, res, next) {
  let credString = req.headers.authorization;
  let cred = authUtils.decodeCred(credString);

  let inpUserName = cred.username;

  let allUsers = await db.getUsers();
  //console.log(allUsers.rows.length);

  let userCheck = checkUnique(cred.username);

  function checkUnique(inpUser) {
    for (let i = 0; i < allUsers.rows.length; i++) {
      //console.log(allUsers.rows[i]['username']);
      if (allUsers.rows[i]['username'] === inpUser) {
        console.log('finnes');
        return false;
      }
    }
    return true;
  }

  if (cred.username == '' || cred.password == '') {
    res
      .status(401)
      .json({
        error: 'You must choose a username and password for your user',
      })
      .end();
    return;
  } else if (!userCheck) {
    res
      .status(403)
      .json({
        error:
          'The username you picked is already in use. Please pick a new one',
      })
      .end();
    return;
  }
  let hash = authUtils.createHash(cred.password);

  try {
    let data = await db.createUser(cred.username, hash.value, hash.salt);
    if (data.rows.length > 0) {
      res.status(200).json({ msg: 'The user was created succefully' }).end();
      return;
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
