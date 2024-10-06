const router = require("express").Router();
const loginService = require("../services/login");

router.post("/", loginService.login);

module.exports = router;
