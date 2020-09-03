const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuth } = require("../config/checkAuth");
const User = require("../models/User");
const Story = require("../models/Story");

//? add a story
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("add", {
    layout: "addLayout",
  });
});

//? process story submission
router.post("/", ensureAuthenticated, (req, res) => {
  console.log(req.body);
  const newStory = new Story({
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    user: req.user.id,
    createdAt: Date.now(),
  });

  newStory
    .save()
    .then(() => {
      res.redirect("/dashboard");
    })
    .catch((err) => {
      if (err) console.log(err);
    });
});

//? show public stories
router.get("/", ensureAuthenticated, (req, res) => {
  Story.find({ status: "public" })
    .populate("user")
    .then((stories) => {
      res.render("public_stories", {
        layout: "pubLayout",
        stories,
        myUser: req.user.id,
      });
    })
    .catch((err) => {
      if (err) console.log(err);
    });
});

module.exports = router;
