const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

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
          email: profile._json.email,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
        });

        User.findOne({ googleId: profile.id })
          .then((user) => {
            if (user) {
              done(null, user);
            } else {
              newUser.save().then((userd) => {
                done(null, userd);
              });
            }
          })
          .catch((err) => console.log(err));
      }
    )
  );

  passport.use(
    "googleReg",
    new GoogleStrategy(
      {
        clientID: myClientId,
        clientSecret: myClientSecret,
        callbackURL: "/users/google/callback",
      },
      (accessToken, refreshToken, profile, done) => {
        const newUser = new User({
          googleId: profile.id,
          email: profile._json.email,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
        });

        User.findOne({ googleId: profile.id })
          .then((user) => {
            if (user) {
              done(null, false, {
                message:
                  "You are already registered using this google account!",
              });
            } else {
              newUser.save().then((userd) => {
                done(null, userd);
              });
            }
          })
          .catch((err) => console.log(err));
      }
    )
  );

  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      (email, password, done) => {
        //Match User
        User.findOne({ email: email })
          .then((user) => {
            if (!user) {
              return done(null, false, { message: "Email not registered!" });
            }
            //Match Password
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) throw err;
              if (isMatch) {
                return done(null, user);
              } else {
                return done(null, false, { message: "Password incorrect!" });
              }
            });
          })

          .catch((err) => console.log(err));
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
