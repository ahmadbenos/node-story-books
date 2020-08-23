const express = require("express");
const router = express.Router();

//? welcome page
router.get("/", (req, res) => {
  res.render("welcome");
});

//? dashboard page
router.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

module.exports = router;
