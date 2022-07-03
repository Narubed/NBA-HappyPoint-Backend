const router = require("express").Router();

const receivedCreate = require("../controllers/received.point.controller/create.members.controller");
const changePoint = require("../controllers/received.point.controller/change.point.member.controller");

router.post("/", receivedCreate.create);
router.put("/change_point/", changePoint.update);

module.exports = router;
