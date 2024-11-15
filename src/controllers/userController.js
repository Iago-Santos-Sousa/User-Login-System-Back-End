const userService = require("../services/users");
const HttpResponseError = require("../utils/HttpResponseError");

const getUserController = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res
        .status(400)
        .json({ status: "error", message: "user_id is required." });
    }

    const result = await userService.getUser(user_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.messageResponse || "Internal server error.",
    });
  }
};

const singUpController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Name, email and password is required.",
      });
    }

    const result = await userService.createUser(name, email, password);
    if (!result) {
      return res.status(406).json({
        status: "error",
        message: "Unable to create user!",
      });
    }

    res
      .status(201)
      .json({ status: "success", message: "User created successfully!" });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.messageResponse || "Internal server error.",
    });
  }
};

module.exports = {
  getUserController,
  singUpController,
};
