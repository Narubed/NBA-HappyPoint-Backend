const router = require("express").Router();

const reportHistory = require("../controllers/report.history.controller");

router.post("/", reportHistory.create);
router.get("/", reportHistory.findAll);
router.get("/:id", reportHistory.findOne);
router.delete("/:id", reportHistory.delete);
router.put("/:id", reportHistory.update);
router.get("/member/:id", reportHistory.findMyMember);

module.exports = router;
