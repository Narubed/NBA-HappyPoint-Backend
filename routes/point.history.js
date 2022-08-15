const router = require("express").Router();
const jwt = require("jsonwebtoken");

const PointHistory = require("../controllers/point.history.controller");

router.post("/", PointHistory.create);
router.get("/", PointHistory.findAll);
router.get("/:id", PointHistory.findOne);
router.delete("/:id", PointHistory.delete);
router.put("/:id", PointHistory.update);
router.get("/member/:id", PointHistory.findMyMember);
router.post("/token/", function (req, res, next) {
  //   const token = req.headers.authorization;
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "nbadigital");
  res.json({ decoded });
});

module.exports = router;
