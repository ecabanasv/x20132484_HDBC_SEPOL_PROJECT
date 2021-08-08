let mongoose = require("mongoose");
let jwt = require("jsonwebtoken");
let bcrypt = require("bcrypt");
let Users = require("../models/user.model");

// Login (GET)
exports.user_login_get = async function (req, res, next) {
  // Get token value if exist
  let token = req.cookies.token;
  // Get name from JWT token if exist
  let userEmail = null;
  // If token exists render page with name value (login name)
  // If token doesn't exist render normal page
  if (token) {
    userEmail = jwt.verify(token, "BikeSmartContract").email;
    res.render("index", { page: "Home", menu_id: "home", email: userEmail });
  } else {
    return res.render("login", {
      page: "Login",
      menu_id: "login",
      email: null,
      error: null,
    });
  }
};

// Login (POST)
exports.user_login_post = function (req, res, next) {
  // Find email in MongoDB
  Users.findOne(
    {
      username: req.body.inputEmail,
    },
    function (err, user) {
      if (user === null || err) {
        console.log(err);
        res.render("login", {
          page: "Login",
          menu_id: "login",
          email: null,
          error: "Email not found",
        });
        return;
      } else {
        // If user try to login with an different account that not belong to his Metamask address
        // It will be send it to home page again
        if (user.address != req.body.currentMetaAcc) {
          return res.redirect("/logout");
        }

        // Compare hashed password in MongoDB with inputPassword in form
        if (!user || !user.comparePassword(req.body.inputPassword)) {
          return res.render("login", {
            page: "Login",
            menu_id: "login",
            email: null,
            error: "Invalid password",
          });
        } else {
          // Sign JWT token with ID, username and address for 7d days
          let token = jwt.sign(
            {
              _id: user._id,
              email: user.email,
              address: user.address,
            },
            "BikeSmartContract",
            { expiresIn: "7d" }
          );
          // Set cookie token with values signed in JWT
          res.cookie("token", token, { maxAge: 1000 * 60 * 60 * 24 * 7 });
          res.redirect("/management");
        }
      }
    }
  );
};

// Signup (GET)
exports.user_signup_get = function (req, res, next) {
  // Get token value if exist
  let token = req.cookies.token;
  // Get name from JWT token if exist
  let userEmail = null;
  // If token exists render page with name value (login name)
  // If token doesn't exist render normal page
  if (token) {
    userEmail = jwt.verify(token, "BikeSmartContract").email;
    res.render("index", { page: "Home", menu_id: "home", email: userEmail });
  } else {
    return res.render("signup", {
      page: "Sign-up",
      menu_id: "signup",
      email: null,
      error: null,
    });
  }
};

// Signup (POST)
exports.user_signup_post = function (req, res, next) {
  // Hash the inputPassword and then saved in MongoDB with rest of user fields (username & address)
  bcrypt.hash(req.body.inputPassword, 10).then((hash) => {
    const user = new Users({
      email: re.body.email,
      has_password: hash,
      address: req.body.currentMetaAcc,
    });
    user
      .save()
      .then((response) => {
        // if saved succesfully will go to login page
        res.status(201).redirect("/login");
      })
      // if not send to signup page
      .catch((error) => {
        res.render("signup", {
          page: "Signup",
          menu_id: "signup",
          email: null,
          error: "Email or Metamask account already registered",
        });
      });
  });
};

// Logout (GET)
exports.user_logout_get = function (req, res, next) {
  res.cookie("token", "", { maxAge: 0 });
  res.redirect("/");
};
