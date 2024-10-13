const router = require("express").Router();
const sendMail = require("../utils/sendEmail");
const userService = require("../services/users");
const HttpResponseError = require("../utils/HttpResponseError");

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new HttpResponseError.BadRequestError("Credentials is missing!");
    }

    const user = await userService.createUser(name, email, password);

    if (!user) {
      throw new HttpResponseError.NotAcceptableError("Unable to create user!");
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
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new HttpResponseError.BadRequestError("Credentials is missing!");
    }

    const { userData, linkResetPassword } =
      await userService.forgotPasswordEmail(email);

    await sendMail(userData, linkResetPassword, res);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.messageResponse || "Internal server error.",
    });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { resetPasswordToken, password } = req.body;

    if (!resetPasswordToken || !password) {
      throw new HttpResponseError.BadRequestError("Credentials is missing!");
    }

    const result = await userService.resetPassword(
      resetPasswordToken,
      password
    );

    if (!result) {
      throw new HttpResponseError.NotAcceptableError(
        "Unable to change password!"
      );
    }

    res
      .status(200)
      .json({ status: "success", message: "Password changed successfully." });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.messageResponse || "Internal server error.",
    });
  }
});

module.exports = router;
