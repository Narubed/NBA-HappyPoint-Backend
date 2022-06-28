const router = require("express").Router();
const test = require("../controllers/test.controller");
const upload = require("../controllers/uploadfile.controller");

router.post("/upload/", upload.create);

router.post("/", test.create);
router.get("/", test.findAll);
router.get("/:id", test.findOne);
router.put("/:id", test.update);
router.put("/editphone/:id", test.editphone);

module.exports = router;
