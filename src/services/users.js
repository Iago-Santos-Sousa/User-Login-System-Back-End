const UserModel = require("../models/Users");
const HttpResponseError = require("../utils/HttpResponseError");

const createUser = async (name, email, password) => {
  try {
    const existUser = await UserModel.findUser(email);

    if (existUser && existUser.length > 0) {
      throw new HttpResponseError.ExistResourceError(
        "There is already a user with this email!"
      );
    }

    const userId = await UserModel.createUser(name, email, password);

    return userId;
  } catch (error) {
    throw error;
  }
};

const forgotPasswordEmail = async (email) => {
  try {
    const user = await UserModel.getUserByEmail(email);

    if (user && user.length <= 0) {
      throw HttpResponseError.NotFoundError("This email is not valid!");
    }

    const token = await UserModel.getResetTokenByUserId(user[0].user_id);
    if (token && token.length > 0) {
      await UserModel.deleteResetTokenByUserId(user[0].user_id);
    }

    const { resetToken, hashToken } = await UserModel.createUserResetToken();

    const resultResetToken = await UserModel.insertResetToken(
      user[0].user_id,
      hashToken
    );

    const linkResetPassword = `http://localhost:${5173}/reset-password/${resetToken}`;

    const userData = {
      email: email,
    };

    return { userData, linkResetPassword };
  } catch (error) {
    throw error;
  }
};

const resetPassword = async (resetPasswordToken, password) => {
  try {
    const updatedPasswordUser = await UserModel.resetPassword(
      resetPasswordToken,
      password
    );

    return updatedPasswordUser;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUser,
  forgotPasswordEmail,
  resetPassword,
};
