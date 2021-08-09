let express = require("express");
let router = express.Router();

// Bike WebApp Controller
var bikeapp_controller = require("../controllers/bikeAppController");

// Home
router.get("/", bikeapp_controller.index);

// Register bike
router.get("/register-bike", bikeapp_controller.regiter_bike_get);
router.post("/register-bike", bikeapp_controller.regiter_bike_post);

// Management - General
router.get("/management", bikeapp_controller.management_get);

// Management - Show Details
// router.get("/show-details", bikeapp_controller.show_details_get);

// Management - Add Details
router.get("/add-details", bikeapp_controller.add_details_get);
router.post("/add-details", bikeapp_controller.add_details_post);

// Management - Transfer Ownership
// router.get("/transfer-ownership", bikeapp_controller.transfer_ownership_get);
// router.post("/transfer-ownership", bikeapp_controller.transfer_ownership_post);

// Management - Renounce Ownership
// router.get("/renounce-ownership", bikeapp_controller.renounce_ownership_get);
// router.post("/renounce-ownership", bikeapp_controller.renounce_ownership_post);

// FAQ
router.get("/faq", bikeapp_controller.faq_get);

// Contact
router.get("/contact", bikeapp_controller.contact_get);
router.post("/contact", bikeapp_controller.contact_post);

module.exports = router;
