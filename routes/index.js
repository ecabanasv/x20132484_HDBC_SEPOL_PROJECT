let express = require("express");
let router = express.Router();

// Bike WebApp Controller
var bikeapp_controller = require("../controllers/bikeAppController");

// Home
router.get("/", bikeapp_controller.index);

// Register bike
router.get("/registerBike", bikeapp_controller.regiter_bike_get);
router.post("/registerBike", bikeapp_controller.regiter_bike_post);

// Management
router.get("/management", bikeapp_controller.management_get);
// router.get("/showDetails", bikeapp_controller.management_get);
// router.get("/addDetails", bikeapp_controller.management_get);
// router.get("/transferOwnership", bikeapp_controller.management_get);
// router.get("/renounceOwnership", bikeapp_controller.management_get);

// FAQ
router.get("/faq", bikeapp_controller.faq_get);

// Contact
router.get("/contact", bikeapp_controller.contact_get);
router.post("/contact", bikeapp_controller.contact_post);

module.exports = router;
