const loginService = require("../services/login");
const HttpResponseError = require("../utils/HttpResponseError");

const logOutController = async (req, res) => {
  try {
    const { userId } = req.user;
    if (!userId) {
      return res
        .status(400)
        .json({ status: "error", message: "user_id is required!" });
    }

    const result = await loginService.logOut(userId);
    if (!result) {
      return res
        .status(406)
        .json({ status: "error", message: "Unable to log out!" });
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
