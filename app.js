const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

//! passport auth
require("./config/passport")(passport);

//! Connect to MongoDB
const db = require("./config/keys").MongoURI;

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(`MongoDB connected to ${mongoose.connection.host}`))
  .catch((err) => console.log(err));

//! URL parser and json
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//! intialize ejs
app.use(expressLayouts);
app.set("view engine", "ejs");

//! session
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

//! intialize passport
app.use(passport.initialize());
app.use(passport.session());

//! static folder
app.use(express.static(path.join(__dirname, "public")));

//! routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
app.use("/auth", require("./routes/auth"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
