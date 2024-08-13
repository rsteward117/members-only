const express = require("express");
const router = express.Router();

const membersonlyController = require("../controller/membersonlyController");

router.get("/", membersonlyController.index);

module.exports = router;