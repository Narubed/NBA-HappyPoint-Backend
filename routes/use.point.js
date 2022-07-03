const router = require("express").Router();
const usePoint = require("../controllers/use.point.controllers");

router.post("/", usePoint.create);
router.get("/", usePoint.findAll);
router.get("/:id", usePoint.findOne);
router.delete("/:id", usePoint.delete);
router.put("/:id", usePoint.update);

module.exports = router;
