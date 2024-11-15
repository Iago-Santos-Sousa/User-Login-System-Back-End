const router = require("express").Router();
const loginController = require("../controllers/logOutController");

router.post("/", loginController.logOutController);

module.exports = router;
