const Router = require("express");
const router = Router();

const controller = require("../controllers/infoController");

router.get("/all", controller.getAll);
router.get("/test", controller.testGET);
router.post("/test", controller.testPOST);
router.get("/status", controller.status);
router.post("/screenshots/clear", controller.clearScreenshots);
router.get("/:identificator", controller.getById);

module.exports = router;