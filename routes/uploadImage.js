const router = require("express").Router();
const members = require("../controllers/upload.image.controllers");

router.post("/", members.create);

module.exports = router;
