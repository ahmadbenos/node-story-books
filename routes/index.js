const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuth } = require("../config/checkAuth");

//? welcome page
router.get("/", forwardAuth, (req, res) => {
  res.render("welcome");
});

//? dashboard page
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    layout: "inlayout",
  });
});

module.exports = router;
