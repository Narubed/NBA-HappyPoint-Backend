const router = require("express").Router();
// const privilege_create = require("../controllers/privilege.controllers/privilege.create");
const privilege = require("../controllers/privilege.controllers");

// router.post("/", privilege_create.create);
router.post("/", privilege.create);
router.get("/", privilege.findAll);
router.get("/:id", privilege.findOne);
router.delete("/:id", privilege.delete);
router.put("/:id", privilege.update);

module.exports = router;
