let jwt = require("jsonwebtoken");
let Web3 = require("web3");
let moment = require("moment");
let contract = require("@truffle/contract");

// Index
exports.index = function (req, res, next) {
  // Get token value if exist
  let token = req.cookies.token;
  // Get name from JWT token if exist
  let userEmail = null;
  // If token exists render page with name value (login name)
  // If token doesn't exist render normal page
  if (token) {
    userEmail = jwt.verify(token, "BikeSmartContract").email;
    res.render("index", {
      menu_id: "home",
      email: userEmail,
      access: 0,
    });
  } else {
    res.render("index", {
      page: "Home",
      menu_id: "home",
      email: null,
    });
  }
};

// Register bike (GET)
exports.regiter_bike_get = function (req, res, next) {
  // Get token value if exist
  let token = req.cookies.token;
  // Get name from JWT token if exist
  let userEmail = null;
  // If token exists render page with name value (login name)
  // If token doesn't exist render normal page
  if (token) {
    userEmail = jwt.verify(token, "BikeSmartContract").email;
    res.render("registerBike", {
      page: "Register new bike",
      menu_id: "registerBike",
      email: userEmail,
      access: 0,
    });
  } else {
    return res.render("index", {
      page: "Home",
      menu_id: "home",
      email: null,
    });
  }
};

// Register bike (POST)
exports.regiter_bike_post = function (req, res, next) {};

// Management (GET)
exports.management_get = function (req, res, next) {
  // Get token value if exist
  let token = req.cookies.token;
  // Get name from JWT token if exist
  let userEmail = null;
  // If token exists render page with name value (login name)
  // If token doesn't exist render normal page
  if (token) {
    userEmail = jwt.verify(token, "BikeSmartContract").email;
    res.render("management", {
      page: "Management",
      menu_id: "management",
      email: userEmail,
      access: 0,
    });
  } else {
    return res.render("index", {
      page: "Home",
      menu_id: "home",
      email: null,
    });
  }
};

// FAQ (GET)
exports.faq_get = function (req, res, next) {
  res.render("faq", {
    page: "FAQ",
    menu_id: "faq",
    email: null,
  });
};

// CONTACT (GET)
exports.contact_get = function (req, res, next) {
  res.render("contact", {
    page: "Contact",
    menu_id: "contact",
    email: null,
  });
};

// CONTACT (POST)
exports.contact_post = function (req, res, next) {};
