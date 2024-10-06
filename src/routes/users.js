const router = require("express").Router();
const userService = require("../services/users");

router.post("/signup", userService.createUser);

router.post("/forgot-password", userService.forgotPasswordEmail);

router.post("/reset-password", userService.resetPassword);

module.exports = router;
