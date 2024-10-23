const Router = require("express");
const router = Router();

const controller = require("../controllers/collectController");

router.post("/send", controller.send);
router.post("/screen", controller.screen);

module.exports = router;