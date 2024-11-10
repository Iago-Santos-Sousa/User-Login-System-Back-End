const loginService = require("../services/login");
const HttpResponseError = require("../utils/HttpResponseError");

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new HttpResponseError.BadRequestError(
        "Email and password is required!"
      );
    }
    const userData = await loginService.login(email, password);
    res.status(200).json(userData);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.messageResponse || "Internal server error.",
    });
  }
};

module.exports = {
  loginController,
};
