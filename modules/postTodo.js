const express = require('express');
const db = require('./db.js');
const router = express.Router();
const protect = require('./auth');

// endpoints ----------------------------
router.get('/todoposts', protect, async function (req, res, next) {
  let userid = res.locals.userid;
  try {
    let data = await db.getUserPosts(userid);
    res.status(200).json(data.rows).end();
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// ------- Create post
router.post('/todoposts', protect, async function (req, res, next) {
  let updata = req.body;
  let userid = res.locals.userid;

  try {
    let data = await db.createPost(updata.heading, updata.blogtext, userid);

    if (data.rows.length > 0) {
      res.status(200).json({ msg: '' }).end();
    } else {
      throw "The blogpost couldn't be created";
    }
  } catch (err) {
    next(err);
  }
});

// ----- delete post
router.delete('/todoposts', protect, async function (req, res, next) {
  let updata = req.body;
  let userid = res.locals.userid;

  try {
    let data = await db.deleteUserPost(updata.id, userid);

    if (data.rows.length > 0) {
      res.status(200).json({ msg: '' }).end();
    } else {
      throw "The blogpost couldn't be deleted";
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
