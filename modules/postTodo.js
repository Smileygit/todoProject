const express = require('express');
const db = require('./db.js');
const router = express.Router();
const utils = require('./auth_utils.js');

// endpoints ----------------------------

//new table is /todousers
router.post('/todousers', function (req, res, next) {
  credString = req.headers.authorization;
  let cred = decodeCred(credString);

  console.log(cred.username);
  console.log(cred.password);

  // code for credential checking

  res.status(200).send('Hello from POST').end();
});

router.get('/todoposts', async function (req, res, next) {
  try {
    let data = await db.getAllBlogPosts();
    res.status(200).json(data.rows).end();
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.post('/todoposts', async function (req, res, next) {
  let updata = req.body;
  let userid = 1; //must be changed when we implement users

  try {
    let data = await db.createBlogPost(updata.heading, updata.itemtext, userid);

    if (data.rows.length > 0) {
      res
        .status(200)
        .json({ msg: 'The blogpost was created succefully' })
        .end();
    } else {
      throw "The blogpost couldn't be created";
    }
  } catch (err) {
    next(err);
  }
});

router.delete('/todoposts', async function (req, res, next) {
  let updata = req.body;

  try {
    let data = await db.deleteBlogPost(updata.id);

    if (data.rows.length > 0) {
      res
        .status(200)
        .json({ msg: 'The blogpost was deleted succefully' })
        .end();
    } else {
      throw "The blogpost couldn't be deleted";
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
