const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const myClientId = require("./keys").clientID;
const myClientSecret = require("./keys").clientSecret;

// get the user schema
const User = require("../models/User");

// passport google authentication
/* module.exports = function (passport) {
  passport.use(
    new GoogleStrategy({
      clientID: myClientId,
      clientSecret: myClientSecret,
      callbackURL: "/auth/google/callback",
    })
  );
}; */
