let jwt = require("jsonwebtoken");
let Web3 = require("web3");
let moment = require("moment");
let contract = require("@truffle/contract");

// Provider 7545 (Ganache)
let provider = new Web3.providers.HttpProvider("http://localhost:7545");

// Get diaryList contract from build folder
const bikeJSON = require("../build/contracts/BikeContract.json");

// Assign diaryList to variable DiaryList
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
  // If token exist call function newEntry (BikeContract.sol)
  // And create new Diary entry
  try {
    if (token) {
      user_address = jwt.verify(token, "BikeSmartContract").address;
      const bikeContract = await BikeContract.deployed();
      await bikeContract.newBike.sendTransaction(
        req.body.inputMake,
        req.body.inputModel,
        req.body.inputFrame,
        req.body.inputDetails,
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
  // Empty array for user entries
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
        if (bikeList[i][6].toLowerCase() == user_address.toLowerCase()) {
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
// exports.show_details_get = async function (req, res){

// };

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
    res.render("register-bike", {
      page: "Register new bike",
      menu_id: "register-bike",
      name: user_name,
      bike_id: req.query.bike_id,
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
  // Empty array for user entries
  let user_bikes = [];
  // If token exist call function updateEntry (DiaryList.sol)
  // And update Diary entry
  try {
    if (token) {
      user_name = jwt.verify(token, "BikeSmartContract").username;
      user_address = jwt.verify(token, "BikeSmartContract").address;
      const bikeContract = await BikeContract.deployed();
      await bikeContract.addDetails.sendTransaction(
        req.body.bike_id,
        req.body.inputDetails,
        {
          from: user_address,
          gas: GAS_LIMIT,
        }
      );

      let bikeContract = await BikeContract.deployed();
      bikeList = await bikeContract.showListBikeDetails.call();
      for (let i = 0; i < bikeList.length; i++) {
        if (bikeList[i][6].toLowerCase() == user_address.toLowerCase()) {
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

// Management - Transfer ownership (GET)
// exports.transfer_ownership_get = async function (req,res){

// };

// Management -  Transfer ownership (POST)
// exports.transfer_ownership_post = async function (req,res){

// };

// Management - Renounce ownership (GET)
// exports.renounce_ownership_get = async function (req,res){

// };

// Management -  Renounce ownership (POST)
// exports.renounce_ownership_post = async function (req,res){

// };

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
