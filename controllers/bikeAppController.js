let jwt = require("jsonwebtoken");
let Web3 = require("web3");
let moment = require("moment");
let contract = require("@truffle/contract");
const { body, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");

// Fake email created for contact form
// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "nelson.blick@ethereal.email",
    pass: "tjvxkudhv79s1rdk1p",
  },
});

// Provider 7545 (Ganache)
let provider = new Web3.providers.HttpProvider("http://localhost:7545");

// Get BikeContract contract from build folder
const bikeJSON = require("../build/contracts/BikeContract.json");

// Assign bikeJSON to variable BikeContract
let BikeContract = contract(bikeJSON);

// Set provider
BikeContract.setProvider(provider);

// Gas limit for transactions
let GAS_LIMIT = 1000000;

// Index
exports.index = async function (req, res) {
  // Get token value if exist
  let token = req.cookies.token;
  // Get name from JWT token if exist
  let user_name = null;
  // If token exists render page with name value (login name)
  // If token doesn't exist render normal page
  if (token) {
    user_name = jwt.verify(token, "BikeSmartContract").username;
    res.render("index", {
      page: "Home",
      menu_id: "home",
      name: user_name,
      email: null,
    });
  } else {
    res.render("index", {
      page: "Home",
      menu_id: "home",
      name: null,
      email: null,
    });
  }
};

// Register bike (GET)
exports.regiter_bike_get = async function (req, res) {
  // Get token value if exist
  let token = req.cookies.token;
  // Get name from JWT token if exist
  let user_name = null;
  // If token exists render page with name value (login name)
  // If token doesn't exist render normal page
  if (token) {
    user_name = jwt.verify(token, "BikeSmartContract").username;
    res.render("register-bike", {
      page: "Register bike",
      menu_id: "register-bike",
      name: user_name,
      errors: null,
      email: null,
    });
  } else {
    return res.redirect("/");
  }
};

// Register bike (POST)
exports.regiter_bike_post = [
  body("inputMake")
    .trim()
    .isLength({ min: 4, max: 15 })
    .escape()
    .withMessage(
      "Make must be specified and less than 15 alphanumeric characters"
    )
    .isAlphanumeric()
    .withMessage("Make has non-alphanumeric characters."),
  body("inputModel")
    .trim()
    .isLength({ min: 4, max: 15 })
    .escape()
    .withMessage(
      "Model must be specified and less than 15 alphanumeric characters"
    )
    .isAlphanumeric()
    .withMessage("Model name has non-alphanumeric characters."),
  body("inputFrame")
    .trim()
    .isLength({ min: 7, max: 10 })
    .escape()
    .withMessage("Frame must be specified also in between 7 to 10 numbers.")
    .isNumeric()
    .withMessage("Frame name has non-numeric characters"),
  body("inputName")
    .trim()
    .isLength({ min: 2, max: 20 })
    .escape()
    .withMessage("Name must be specified and less than 20 characters")
    .isAlpha()
    .withMessage("Name has non-letters characters."),
  body("inputEmail")
    .trim()
    .isLength({ min: 4, max: 50 })
    .escape()
    .withMessage("Email must be specified and less than 50 characters")
    .isEmail()
    .withMessage("Email must be valid."),
  async (req, res) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Assign JWT token to token (if exist)
    let token = req.cookies.token;
    user_name = jwt.verify(token, "BikeSmartContract").username;
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values and error messages.
      res.render("register-bike", {
        page: "Register new bike",
        menu_id: "register-bike",
        name: user_name,
        errors: errors.array(),
      });
      return;
    } else {
      try {
        if (token) {
          user_address = jwt.verify(token, "BikeSmartContract").address;
          const bikeContract = await BikeContract.deployed();
          await bikeContract.newBike.sendTransaction(
            req.body.inputMake,
            req.body.inputModel,
            req.body.inputFrame,
            req.body.inputName,
            req.body.inputEmail,
            {
              from: user_address,
              gas: GAS_LIMIT,
            }
          );
        }
      } catch (err) {
        console.log(err);
      }
    }
    res.redirect("/management");
  },
];

// Management - General (GET)
exports.management_get = async function (req, res) {
  // Get token value if exist
  let token = req.cookies.token;
  // Empty array for user bikes
  let user_bikes = [];
  try {
    if (token === undefined) {
      res.redirect("/logout");
    } else {
      // Assign name & address from token
      let user_name = jwt.verify(token, "BikeSmartContract").username;
      let user_address = jwt.verify(token, "BikeSmartContract").address;

      let bikeContract = await BikeContract.deployed();
      bikeList = await bikeContract.showListBikeDetails.call();
      for (let i = 0; i < bikeList.length; i++) {
        if (bikeList[i][5].toLowerCase() == user_address.toLowerCase()) {
          user_bikes.push(bikeList[i]);
        }
      }

      res.render("management", {
        page: "Management",
        menu_id: "management",
        name: user_name,
        bikes: user_bikes,
        moment: moment,
      });
    }
  } catch (err) {
    console.log("error");
    console.log(err);
    res.redirect("/");
  }
};

// Management - Show details (GET)
exports.show_details_get = async (req, res) => {
  // Get token value if exist
  let token = req.cookies.token;
  let bike_details = [];
  let bike_info = [];
  let owner_info = [];
  // Empty array for user bikes
  try {
    if (token === undefined) {
      res.redirect("/logout");
    } else {
      user_name = jwt.verify(token, "BikeSmartContract").username;

      // Get JSON params from BikeContract
      const bikeContract = await BikeContract.deployed();

      // Get Bike Details
      bike_info = await bikeContract.showBikeDetails.call(req.query.bike_id);
      // Get Owner Details
      owner_info = await bikeContract.showOwnerDetails.call(req.query.bike_id);

      //struct listDetails {uint256 bikeID; uint256 date; string details; }
      details_list = await bikeContract.showAllDetails.call();
      for (let i = 0; i < details_list.length; i++) {
        if (details_list[i][0] == req.query.bike_id) {
          bike_details.push(details_list[i]);
        }
      }

      res.render("show-details", {
        page: "Show details",
        menu_id: "show-details",
        name: user_name,
        bike_id: req.query.bike_id,
        bike: bike_info,
        owner: owner_info,
        details: bike_details,
        moment: moment,
      });
    }
  } catch (err) {
    console.log("error");
    console.log(err);
    res.redirect("/logout");
  }
};

// Management - Add details (GET)
exports.add_details_get = async function (req, res) {
  // Get token value if exist
  let token = req.cookies.token;
  // Get name from JWT token if exist
  let user_name = null;
  let bike_info = [];
  // If token exists render page with name value (login name)
  // If token doesn't exist render normal page
  if (token) {
    user_name = jwt.verify(token, "BikeSmartContract").username;
    // Get JSON params from BikeContract
    const bikeContract = await BikeContract.deployed();
    // Get Bike Details
    bike_info = await bikeContract.showBikeDetails.call(req.query.bike_id);

    res.render("add-details", {
      page: "Add details",
      menu_id: "add-details",
      name: user_name,
      bike_id: req.query.bike_id,
      bike: bike_info,
      moment: moment,
      errors: null,
    });
  } else {
    return res.redirect("/");
  }
};

// Management - Add details (POST)
exports.add_details_post = [
  body("inputDetails")
    .trim()
    .isLength({ min: 20, max: 180 })
    .escape()
    .withMessage(
      "Details must be specified and between 20-90 alphanumeric characters"
    )
    .isAlphanumeric()
    .withMessage("Details has non-alphanumeric characters."),
  async (req, res) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Assign JWT token to token (if exist)
    let token = req.cookies.token;
    // Empty array for user bikes
    let bike_info = [];
    user_name = jwt.verify(token, "BikeSmartContract").username;
    // Get JSON params from BikeContract
    const bikeContract = await BikeContract.deployed();
    // Get Bike Details
    bike_info = await bikeContract.showBikeDetails.call(req.body.bike_id);

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values and error messages.
      res.render("add-details", {
        page: "Add details form",
        menu_id: "register-bike",
        name: user_name,
        bike_id: req.query.bike_id,
        bike: bike_info,
        moment: moment,
        errors: errors.array(),
      });
      return;
    } else {
      try {
        if (token) {
          // Get user address from JWT token
          user_address = jwt.verify(token, "BikeSmartContract").address;

          // Get JSON params from BikeContract
          const bikeContract = await BikeContract.deployed();
          // Get Bike Details
          bike_info = await bikeContract.showBikeDetails.call(req.body.bike_id);

          // If user try to update details for a different bike id it will be logout
          // If match can send transaction
          if (user_address == bike_info[4].toLowerCase()) {
            await bikeContract.addDetails.sendTransaction(
              req.body.bike_id,
              req.body.inputDetails,
              {
                from: user_address,
                gas: GAS_LIMIT,
              }
            );
          } else {
            console.log(
              "Invalid Metamask account. Please login with the correct one."
            );
            res.redirect("/logout");
          }
          res.redirect("/show-details?bike_id=" + req.body.bike_id);
        }
      } catch (err) {
        console.log("error");
        console.log(err);
        res.redirect("/logout");
      }
    }
  },
];

// Management - Transfer ownership (GET)
exports.transfer_ownership_get = async function (req, res) {
  // Get token value if exist
  let token = req.cookies.token;
  // Get name from JWT token if exist
  let user_name = null;
  // info bike
  let bike_info = [];
  // owner info
  let owner_info = [];
  // If token exists render page with name value (login name)
  // If token doesn't exist render normal page
  if (token) {
    // Get user address from JWT token
    user_name = jwt.verify(token, "BikeSmartContract").username;
    // Get JSON params from BikeContract
    const bikeContract = await BikeContract.deployed();
    // Get Bike Details
    bike_info = await bikeContract.showBikeDetails.call(req.query.bike_id);
    // Get Owner Details
    owner_info = await bikeContract.showOwnerDetails.call(req.query.bike_id);

    res.render("transfer-ownership", {
      page: "Transfer ownership",
      menu_id: "transfer-ownership",
      name: user_name,
      bike_id: req.query.bike_id,
      bike: bike_info,
      owner: owner_info,
      moment: moment,
      errors: null,
    });
  } else {
    return res.redirect("/");
  }
};

// Management -  Transfer ownership (POST)
exports.transfer_ownership_post = [
  body("inputName")
    .trim()
    .isLength({ min: 2, max: 20 })
    .escape()
    .withMessage("Name must be specified and less than 20 characters")
    .isAlpha()
    .withMessage("Name has non-letters characters."),
  body("inputEmail")
    .trim()
    .isLength({ min: 4, max: 50 })
    .escape()
    .withMessage("Email must be specified and less than 50 characters")
    .isEmail()
    .withMessage("Email must be valid."),
  body("inputNewAddress")
    .trim()
    .isLength({ min: 42, max: 42 })
    .withMessage("Address must be 42 alphanumeric characters.")
    .isAlphanumeric()
    .withMessage("Address name has non-alphanumeric characters."),
  async (req, res) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Assign JWT token to token (if exist)
    let token = req.cookies.token;
    // Get name from JWT token if exist
    let user_name = null;
    // info bike
    let bike_info = [];
    // owner info
    let owner_info = [];
    if (!errors.isEmpty()) {
      try {
        // Get JSON params from BikeContract
        const bikeContract = await BikeContract.deployed();
        // Get Bike Details
        bike_info = await bikeContract.showBikeDetails.call(req.body.bike_id);
        // Get Owner Details
        owner_info = await bikeContract.showOwnerDetails.call(req.body.bike_id);
        // There are errors. Render the form again with sanitized values and error messages.
        res.render("transfer-ownership", {
          page: "Transfer ownership",
          menu_id: "transfer-ownership",
          name: user_name,
          errors: errors.array(),
          bike_id: req.body.bike_id,
          bike: bike_info,
          owner: owner_info,
          moment: moment,
        });
        return;
      } catch (err) {
        console.log("error");
        console.log(err);
        res.redirect("/management");
      }
    } else {
      try {
        if (token) {
          // Get user address from JWT token
          user_address = jwt.verify(token, "BikeSmartContract").address;
          // Get JSON params from BikeContract
          const bikeContract = await BikeContract.deployed();
          // Get Bike Details
          bike_info = await bikeContract.showBikeDetails.call(req.body.bike_id);
          console.log(req.body.bike_id);
          // If user try to renounce different ID (changed manually in URL) it will be logout
          // If match can send transaction
          if (user_address == bike_info[4].toLowerCase()) {
            await bikeContract.transferOwnership.sendTransaction(
              req.body.bike_id,
              req.body.inputNewAddress,
              req.body.inputName,
              req.body.inputEmail,
              {
                from: user_address,
                gas: GAS_LIMIT,
              }
            );
          } else {
            console.log(
              "Invalid Metamask account. Please login with the correct one."
            );
            res.redirect("/logout");
          }
          res.redirect("/management");
        }
      } catch (err) {
        console.log("error");
        console.log(err);
        res.redirect("/management");
      }
    }
  },
];

// Management - Renounce ownership (GET)
exports.renounce_ownership_get = async function (req, res) {
  // Get token value if exist
  let token = req.cookies.token;
  // Get name from JWT token if exist
  let user_name = null;
  // If token exists render page with name value (login name)
  // If token doesn't exist render normal page
  if (token) {
    // Get user address from JWT token
    user_name = jwt.verify(token, "BikeSmartContract").username;
    // Get JSON params from BikeContract
    const bikeContract = await BikeContract.deployed();
    // Get Bike Details
    bike_info = await bikeContract.showBikeDetails.call(req.query.bike_id);
    res.render("renounce-ownership", {
      page: "Renounce ownership",
      menu_id: "renounce-ownership",
      name: user_name,
      bike_id: req.query.bike_id,
      bike: bike_info,
      moment: moment,
    });
  } else {
    return res.redirect("/");
  }
};

// Management -  Renounce ownership (POST)
exports.renounce_ownership_post = async function (req, res) {
  // Assign JWT token to token (if exist)
  let token = req.cookies.token;
  // Empty array for user bikes
  let user_bikes = [];
  try {
    if (token) {
      // Get user address from JWT token
      user_address = jwt.verify(token, "BikeSmartContract").address;

      // Get JSON params from BikeContract
      const bikeContract = await BikeContract.deployed();

      // Get Bike Details
      bike_info = await bikeContract.showBikeDetails.call(req.body.bike_id);

      // If user try to renounce different ID (changed manually in URL) it will be logout
      // If match can send transaction
      if (user_address == bike_info[4].toLowerCase()) {
        await bikeContract.renounceOwnership.sendTransaction(req.body.bike_id, {
          from: user_address,
          gas: GAS_LIMIT,
        });
      } else {
        console.log(
          "Invalid Metamask account. Please login with the correct one."
        );
        res.redirect("/logout");
      }

      res.redirect("/management");
    }
  } catch (err) {
    console.log("error");
    console.log(err);
    res.redirect("/logout");
  }
};

// FAQ (GET)
exports.faq_get = async function (req, res) {
  // Get token value if exist
  let token = req.cookies.token;
  // Get name from JWT token if exist
  let user_name = null;
  // If token exists render page with name value (login name)
  // If token doesn't exist render normal page
  if (token) {
    user_name = jwt.verify(token, "BikeSmartContract").username;
    res.render("faq", {
      page: "FAQ",
      menu_id: "faq",
      name: user_name,
    });
  } else {
    return res.render("faq", {
      page: "FAQ",
      menu_id: "faq",
      name: null,
    });
  }
};

// CONTACT (GET)
exports.contact_get = async function (req, res) {
  // Get token value if exist
  let token = req.cookies.token;
  // Get name from JWT token if exist
  let user_name = null;
  // If token exists render page with name value (login name)
  // If token doesn't exist render normal page
  if (token) {
    user_name = jwt.verify(token, "BikeSmartContract").username;
    res.render("contact", {
      page: "Contact",
      menu_id: "contact",
      name: user_name,
      errors: null,
    });
  } else {
    return res.render("contact", {
      page: "Contact",
      menu_id: "contact",
      name: null,
      errors: null,
    });
  }
};

// CONTACT (POST)
exports.contact_post = [
  body("inputName")
    .trim()
    .isLength({ min: 2, max: 20 })
    .escape()
    .withMessage("Name must be specified and less than 20 characters")
    .isAlpha()
    .withMessage("Name has non-letters characters."),
  body("inputEmail")
    .trim()
    .isLength({ min: 4, max: 50 })
    .escape()
    .withMessage("Email must be specified and less than 50 characters")
    .isEmail()
    .withMessage("Email must be valid."),
  body("inputSubject")
    .trim()
    .isLength({ min: 10, max: 50 })
    .escape()
    .withMessage("Subject must be 10-50 alphanumeric characters.")
    .isAlphanumeric()
    .withMessage("Subject has non-alphanumeric characters."),
  body("inputMessage")
    .trim()
    .isLength({ min: 50, max: 300 })
    .escape()
    .withMessage("Message must be 50-300 alphanumeric characters.")
    .isAlphanumeric()
    .withMessage("Message has non-alphanumeric characters."),
  async (req, res) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Get token value if exist
    let token = req.cookies.token;
    // Get name from JWT token if exist
    let user_name = null;

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values and error messages.
      res.render("contact", {
        page: "Contact",
        menu_id: "contact",
        name: user_name,
        errors: errors.array(),
      });
      return;
    }
    // If token exists render page with name value (login name)
    // If token doesn't exist render normal page
    if (token) {
      try {
        user_name = jwt.verify(token, "BikeSmartContract").username;
        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: req.body.inputEmail, // sender address
          to: "nelson.blick@ethereal.email", // list of receivers
          subject: "Bike Smart Contract - User: " + user_name, // Subject line
          text: req.body.inputMessage, // plain text body
          html: req.body.inputMessage, // html body
        });
      } catch (err) {
        console.log("error");
        console.log(err);
      }
      res.render("index", {
        page: "Home",
        menu_id: "home",
        name: user_name,
        email: 1,
      });
    } else {
      let info = await transporter.sendMail({
        from: req.body.inputEmail, // sender address
        to: "nelson.blick@ethereal.email", // list of receivers
        subject: "Bike Smart Contract: " + req.body.inputSubject, // Subject line
        text: req.body.inputMessage, // plain text body
        html: req.body.inputMessage, // html body
      });
      res.render("index", {
        page: "Home",
        menu_id: "home",
        name: null,
        email: 1,
      });
    }
  },
];
