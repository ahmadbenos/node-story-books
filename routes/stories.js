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
    .sort({ createdAt: "desc" })
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

//? edit story
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Story.findOne({ _id: req.params.id })
    .then((story) => {
      if (!story) {
        res.send("story doesnt exist!");
      }

      if (story.user != req.user.id) {
        res.redirect("/stories");
      } else {
        res.render("edit", {
          layout: "addLayout",
          story,
        });
      }
    })
    .catch((err) => {
      if (err) console.log(err);
    });
});

//? proccess edit request
router.put("/edit/:id", ensureAuthenticated, (req, res) => {
  Story.findById(req.params.id).then((story) => {
    if (!story) {
      res.send("story doesnt exist!");
    }

    if (story.user != req.user.id) {
      res.redirect("/stories");
    } else {
      Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      }).then((story) => res.redirect("/dashboard"));
    }
  });
});

//? show specific story
router.get("/spec", ensureAuthenticated, (req, res) => {
  res.render("spec_story", {
    layout: "specLayout",
  });
});

module.exports = router;
