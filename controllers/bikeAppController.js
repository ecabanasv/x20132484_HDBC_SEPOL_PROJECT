let jwt = require("jsonwebtoken");
let Web3 = require("web3");
let moment = require("moment");
let contract = require("@truffle/contract");

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
    });
  } else {
    res.render("index", {
      page: "Home",
      menu_id: "home",
      name: null,
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
      page: "Register new bike",
      menu_id: "register-bike",
      name: user_name,
    });
  } else {
    return res.render("index", {
      page: "Home",
      menu_id: "home",
      name: null,
    });
  }
};

// Register bike (POST)
exports.regiter_bike_post = async (req, res) => {
  // Assign JWT token to token (if exist)
  let token = req.cookies.token;
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
  res.redirect("/management");
};

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
    res.redirect("/logout");
  }
};

// Management - Show details (GET)
exports.show_details_get = async (req, res) => {
  // Get token value if exist
  let token = req.cookies.token;
  // Empty array for user bikes
  let bike_details = [];
  try {
    if (token === undefined) {
      res.redirect("/logout");
    } else {
      // Assign name & address from token
      let user_address = jwt.verify(token, "BikeSmartContract").address;

      // Get Bike Details
      bikeDetails = await bikeContract.showBikeDetails.call(req.body.bike_id);

      //struct listDetails {uint256 bikeID; uint256 date; string details; }
      let bikeContract = await BikeContract.deployed();
      detailsList = await bikeContract.showAllDetails.call();
      for (let i = 0; i < detailsList.length; i++) {
        if (detailsList[i][0] == req.body.bike_id) {
          bike_details.push(detailsList[i]);
        }
      }
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
  // If token exists render page with name value (login name)
  // If token doesn't exist render normal page
  if (token) {
    user_name = jwt.verify(token, "BikeSmartContract").username;
    res.render("add-details", {
      page: "Add details",
      menu_id: "add-details",
      name: user_name,
      bike_id: req.query.bike_id,
      bike_frame: req.query.bike_frame,
    });
  } else {
    return res.render("index", {
      page: "Home",
      menu_id: "home",
      name: null,
    });
  }
};

// Management - Add details (POST)
exports.add_details_post = async (req, res) => {
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
      bikeAddress = await bikeContract.showBikeDetails.call(req.body.bike_id);

      // If user try to update details for a different bike id it will be logout
      // If match can send transaction
      if (user_address == bikeAddress[4].toLowerCase()) {
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
      res.redirect("/management");
    }
  } catch (err) {
    console.log("error");
    console.log(err);
    res.redirect("/logout");
  }
};

// Management - Transfer ownership (GET)
exports.transfer_ownership_get = async function (req, res) {
  // Get token value if exist
  let token = req.cookies.token;
  // Get name from JWT token if exist
  let user_name = null;
  // If token exists render page with name value (login name)
  // If token doesn't exist render normal page
  if (token) {
    // Get user address from JWT token
    user_name = jwt.verify(token, "BikeSmartContract").username;
    res.render("transfer-ownership", {
      page: "Transfer ownership",
      menu_id: "transfer-ownership",
      name: user_name,
      bike_id: req.query.bike_id,
      bike_frame: req.query.bike_frame,
    });
  } else {
    return res.render("index", {
      page: "Home",
      menu_id: "home",
      name: null,
    });
  }
};

// Management -  Transfer ownership (POST)
exports.transfer_ownership_post = async (req, res) => {
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
      bikeAddress = await bikeContract.showBikeDetails.call(req.body.bike_id);

      // If user try to renounce different ID (changed manually in URL) it will be logout
      // If match can send transaction
      if (user_address == bikeAddress[4].toLowerCase()) {
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
    res.redirect("/logout");
  }
};

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
    res.render("renounce-ownership", {
      page: "Renounce ownership",
      menu_id: "renounce-ownership",
      name: user_name,
      bike_id: req.query.bike_id,
      bike_frame: req.query.bike_frame,
    });
  } else {
    return res.render("index", {
      page: "Home",
      menu_id: "home",
      name: null,
    });
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
      bikeAddress = await bikeContract.showBikeDetails.call(req.body.bike_id);

      // If user try to renounce different ID (changed manually in URL) it will be logout
      // If match can send transaction
      if (user_address == bikeAddress[4].toLowerCase()) {
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
    });
  } else {
    return res.render("contact", {
      page: "Contact",
      menu_id: "contact",
      name: null,
    });
  }
};

// CONTACT (POST)
exports.contact_post = function (req, res) {};
