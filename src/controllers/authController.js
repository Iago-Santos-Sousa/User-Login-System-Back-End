const sendMail = require("../utils/sendEmail");
const userService = require("../services/users");
const loginService = require("../services/login");
const HttpResponseError = require("../utils/HttpResponseError");

const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new HttpResponseError.BadRequestError("email is required!");
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
};

const resetPasswordController = async (req, res) => {
  try {
    const { resetPasswordToken, password } = req.body;

    if (!resetPasswordToken || !password) {
      throw new HttpResponseError.BadRequestError(
        "Reset password token and new password is required!"
      );
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
};

const refreshTokenController = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new HttpResponseError.ForbiddenError("Token not provided!");
    }

    const { newAccessToken, newRefreshToken } =
      await loginService.createNewAcessAndRefreshToken(refreshToken);
    // const { newAccessToken } = await loginService.createNewAcessAndRefreshToken(
    //   refreshToken,
    // );

    res.status(200).json({
      status: "success",
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
    // res
    //   .status(200)
    //   .json({ accessToken: newAccessToken, refreshToken: refreshToken });
  } catch (error) {
    console.error(error?.message);

    if (error?.message === "Token inválido ou expirado") {
      return res
        .status(403)
        .json({ status: "error", message: "Invalid or expired token" });
    }

    res
      .status(500)
      .json({ status: "error", message: "Internal server error!" });
  }
};

module.exports = {
  refreshTokenController,
  resetPasswordController,
  forgotPasswordController,
};
