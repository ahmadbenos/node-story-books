const express = require("express");
const router = express.Router();
const passport = require("passport");
const { ensureAuthenticated, forwardAuth } = require("../config/checkAuth");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

//? register page
router.get("/register", forwardAuth, (req, res) => {
  res.render("register");
});

//? login page
router.get("/login", forwardAuth, (req, res) => {
  res.render("login");
});

//? register handle
router.post("/register", (req, res) => {
  const { displayName, email, password, password2 } = req.body;
  let errors = [];

  if (!displayName || !email || !password || !password2) {
    errors.push({ msg: "missing fields" });
  }

  if (password !== password2) {
    errors.push({ msg: "passwords don't match" });
  }

  if (password.length < 6 && password) {
    errors.push({ msg: "password must be at least 6 characters long" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      displayName,
      email,
      password,
      password2,
    });
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "Email already registered!" });
        res.render("register", {
          errors,
          displayName,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          email: email,
          password: password,
          displayName: displayName,
          firstName: displayName,
          lastName: displayName,
          googleId: Math.floor(Math.random() * 1000000000000000000000),
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
              console.log(err);
            }
            newUser.password = hash;

            //save user!
            newUser.save().then(() => {
              console.log("user saved");
              req.flash("success_msg", "You are now registered and can login!");
              res.redirect("/users/login");
            });
          });
        });
      }
    });
  }
});

//? login handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

router.get(
  "/google",
  passport.authenticate("googleReg", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("googleReg", {
    failureRedirect: "/users/register",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success_msg", "Registeration successful!");
    res.redirect("/dashboard");
  }
);

//? logout handle
router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

module.exports = router;
