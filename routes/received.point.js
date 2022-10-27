const router = require("express").Router();

const receivedCreate = require("../controllers/received.point.controller/create.members.controller");
const commission = require("../controllers/received.point.controller/commission.point.member.controller");
const members = require("../controllers/received.point.controller");
const auth = require("../lib/auth-token");

router.get("/:id", auth, members.findOne);
router.get("/phone/:id", auth, members.findByPhone);
router.post("/", auth, receivedCreate.create);
router.post("/commission/", auth, commission.commission);

module.exports = router;
