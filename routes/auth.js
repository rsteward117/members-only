const express = require("express");
const router = express.Router();

const signupController = require("../controller/signupController");
const loginController = require("../controller/loginController");


router.get("/signup", signupController.signup_get);
router.post("/signup", signupController.signup_post);

module.exports = router;