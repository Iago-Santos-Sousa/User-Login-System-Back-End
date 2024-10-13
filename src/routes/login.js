const router = require("express").Router();
const loginService = require("../services/login");
const HttpResponseError = require("../utils/HttpResponseError");

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new HttpResponseError.BadRequestError("Credentials is missing!");
    }

    const userData = await loginService.login(email, password);
    res.status(200).json(userData);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.messageResponse || "Internal server error.",
    });
  }
});

module.exports = router;
