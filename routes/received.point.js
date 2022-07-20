const router = require("express").Router();

const receivedCreate = require("../controllers/received.point.controller/create.members.controller");
const commission = require("../controllers/received.point.controller/commission.point.member.controller");

router.post("/", receivedCreate.create);
router.post("/commission/", commission.commission);

module.exports = router;
