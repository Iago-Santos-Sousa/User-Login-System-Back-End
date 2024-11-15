const loginService = require("../services/login");
const HttpResponseError = require("../utils/HttpResponseError");

const logOutController = async (req, res) => {
  try {
    const { userId } = req.user;
    if (!userId) {
      throw new HttpResponseError.BadRequestError("user_id is required!");
    }

    const result = await loginService.logOut(userId);
    if (!result) {
      throw new HttpResponseError.NotAcceptableError("Unable to log out!");
    }

    res.status(200).json({ status: "success", message: "logout completed" });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.messageResponse || "Internal server error.",
    });
  }
};

module.exports = {
  logOutController,
};
