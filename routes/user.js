let express = require("express");
let router = express.Router();

// Require userController (see it Controllers folder)
let user_controller = require("../controllers/userController");

// Login router
router.get("/login", user_controller.user_login_get);
router.post("/login", user_controller.user_login_post);

// Signup router
router.get("/signup", user_controller.user_signup_get);
router.post("/signup", user_controller.user_signup_post);

// Logout router
router.get("/logout", user_controller.user_logout_get);

module.exports = router;
