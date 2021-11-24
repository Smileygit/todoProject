const express = require("express");
const db = require("./db.js");
const router = express.Router();

const protect = require("./auth");

// endpoints ----------------------------
router.get("/todoposts", protect, async function (req, res, next) {
  try {
    let data = await db.getAllBlogPosts();
    res.status(200).json(data.rows).end();
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.post("/todoposts", protect, async function (req, res, next) {
  console.log(res.locals.username);
  console.log(res.locals.userid);
  let updata = req.body;
  let userid = res.locals.userid;

  try {
    let data = await db.createBlogPost(updata.heading, updata.blogtext, userid);

    if (data.rows.length > 0) {
      res
        .status(200)
        .json({ msg: "The blogpost was created succefully" })
        .end();
    } else {
      throw "The blogpost couldn't be created";
    }
  } catch (err) {
    next(err);
  }
});

router.delete("/todoposts", protect, async function (req, res, next) {
  let updata = req.body;
  let userid = res.locals.userid;

  try {
    let data = await db.deleteBlogPost(updata.id, userid);

    if (data.rows.length > 0) {
      res
        .status(200)
        .json({ msg: "The blogpost was deleted succefully" })
        .end();
    } else {
      throw "The blogpost couldn't be deleted";
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
