// Requirements
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

require("./db");
const express = require("express");
const app = express();
const session = require("express-session");
const { urlencoded } = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const passport = require("passport");
const blogRouter = require("./controllers/controller");
const BlogModel = require("./models/blog-model");
const initializePassport = require("./passport");
initializePassport(passport);

// Middlewares
app.use("/public", express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/", blogRouter);

// Listening port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server is running on port 5000...");
});
