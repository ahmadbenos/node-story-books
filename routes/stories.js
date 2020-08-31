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
});

module.exports = router;
