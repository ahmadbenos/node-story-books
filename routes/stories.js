const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuth } = require("../config/checkAuth");
const User = require("../models/User");
const Story = require("../models/Story");
const moment = require("moment");

//? add a story
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("add", {
    layout: "addLayout",
  });
});

//? process story submission
router.post("/", ensureAuthenticated, (req, res) => {
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
        useFindAndModify: false,
        new: true,
        runValidators: true,
      }).then((story) => res.redirect("/dashboard"));
    }
  });
});

//? delete story
router.delete("/delete/:id", ensureAuthenticated, (req, res) => {
  Story.remove({ _id: req.params.id })
    .then(() => res.redirect("/dashboard"))
    .catch((err) => {
      if (err) {
        console.log(err);
        res.send("Unexpected error!");
      }
    });
});

//? show specific story
router.get("/:id", ensureAuthenticated, (req, res) => {
  Story.findById(req.params.id)
    .populate("user")
    .then((story) => {
      res.render("spec_story", {
        layout: "specLayout",
        story,
        moment,
      });
    });
});

//? show a user's public stories
router.get("/user/:id", ensureAuthenticated, (req, res) => {
  Story.find({ user: req.params.id, status: "public" })
    .populate("user")
    .then((stories) => {
      res.render("user_stories", {
        layout: "specLayout",
        stories,
        myUser: req.user.id,
      });
    })
    .catch((err) => {
      if (err) {
        console.log(err);
        res.send("Unexpected error");
      }
    });
});

module.exports = router;
