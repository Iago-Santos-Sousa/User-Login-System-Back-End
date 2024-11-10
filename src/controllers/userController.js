const userService = require("../services/users");
const HttpResponseError = require("../utils/HttpResponseError");

const getUserController = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      throw new HttpResponseError.BadRequestError("user_id is required.");
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
      throw new HttpResponseError.BadRequestError(
        "Name, email and password is required."
      );
    }

    await userService.createUser(name, email, password);

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
