const router = require("express").Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

router.post("/signup", userController.singUpController);
router.get("/get-user/:user_id", userController.getUserController);
router.post("/forgot-password", authController.forgotPasswordController);
router.post("/reset-password", authController.resetPasswordController);

module.exports = router;
