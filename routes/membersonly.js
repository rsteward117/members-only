const express = require("express");
const router = express.Router();

const membersonlyController = require("../controller/membersonlyController");

router.get("/", membersonlyController.index);

router.get("/membersonly/become/member", membersonlyController.become_member_get);
router.post("/membersonly/become/member", membersonlyController.become_member_post);

router.get("/membersonly/create/post", membersonlyController.create_post_get);
router.post("/membersonly/create/post", membersonlyController.create_post_post);

module.exports = router;