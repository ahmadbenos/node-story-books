const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const myClientId = require("./keys").clientID;
const myClientSecret = require("./keys").clientSecret;

// get the user schema
const User = require("../models/User");

// passport google authentication
module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: myClientId,
        clientSecret: myClientSecret,
        callbackURL: "/auth/google/callback",
      },
      (accessToken, refreshToken, profile, done) => {
        const newUser = new User({
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
        });

        User.findOne({ googleId: profile.id })
          .then((user) => {
            if (user) {
              return done(null, user);
            } else {
              newUser.save().then(() => console.log("user saved!"));
              return done(null, user);
            }
          })
          .catch((err) => {
            if (err) console.log(err);
          });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
