const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

const TaskController = require("../controller/TaskController");
const TaskValidation = require("../middleware/TaskValidation");

router.post("/", TaskValidation, TaskController.create);
router.put("/:id", TaskValidation, TaskController.update);
router.get("/:id", TaskController.show);
router.delete("/:id", TaskController.delete);
router.put("/:id/:done", TaskController.done);

router.get("/filter/all/:macaddress", TaskController.all);
router.get("/filter/late/:macaddress", TaskController.late);
router.get("/filter/today/:macaddress", TaskController.today);

module.exports = router;
