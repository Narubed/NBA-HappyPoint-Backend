const router = require("express").Router();
const members = require("../controllers/members.controller");
const level_members = require("../controllers/level.members.controller");

router.post("/level_members/", level_members.create);
router.get("/level_members/", level_members.findAll);
router.get("/level_members/:id", level_members.findOne);
router.delete("/level_members/:id", level_members.delete);
router.put("/level_members/:id", level_members.update);

router.post("/", members.create);
router.get("/", members.findAll);
router.get("/:id", members.findOne);
router.get("/phone/:id", members.findByPhone);

router.delete("/:id", members.delete);
router.put("/:id", members.update);

module.exports = router;
