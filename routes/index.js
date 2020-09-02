const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuth } = require("../config/checkAuth");
const User = require("../models/User");
const Story = require("../models/Story");
const moment = require("moment");

//? welcome page
router.get("/", forwardAuth, (req, res) => {
  res.render("welcome");
});

//? dashboard page
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  Story.find({ user: req.user.id })
    .then((stories) => {
      res.render("dashboard", {
        layout: "inlayout",
        name: req.user.firstName,
        stories,
        moment,
      });
    })
    .catch((err) => console.log(err));
});

module.exports = router;
