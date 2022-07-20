const router = require("express").Router();

const PointHistory = require("../controllers/point.history.controller");

router.post("/", PointHistory.create);
router.get("/", PointHistory.findAll);
router.get("/:id", PointHistory.findOne);
router.delete("/:id", PointHistory.delete);
router.put("/:id", PointHistory.update);
router.get("/member/:id", PointHistory.findMyMember);

module.exports = router;
