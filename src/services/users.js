const UserModel = require("../models/Users");
const HttpResponseError = require("../utils/HttpResponseError");
const someUtils = require("../utils/someUtils");

const createUser = async (name, email, password) => {
  try {
    name = name.trim();
    email = email.trim().toLowerCase();
    password = password.trim();
    const existUserEmail = await UserModel.getUserByEmail(email);

    if (existUserEmail.length > 0) {
      throw new HttpResponseError.ExistResourceError(
        "There is already a user with this email!"
      );
    }

    const userId = await UserModel.createUser(name, email, password);

    if (!userId) {
      throw new HttpResponseError.NotAcceptableError("Unable to create user!");
    }

    const userHashId = someUtils.generateUserHashId(userId);
    await UserModel.updateHashUserId(userHashId, userId);

    return userId;
  } catch (error) {
    throw error;
  }
};

const getUser = async (user_id) => {
  try {
    // user_id = parseInt(user_id);
    // if (Number.isNaN(user_id)) {
    //   throw new HttpResponseError.BadRequestError("User ID must required!");
    // }

    user_id = user_id.trim();
    const user = await UserModel.getUserById(user_id);

    if (!user) {
      throw new HttpResponseError.NotFoundError("User not exists!");
    }

    return user;
  } catch (error) {
    throw error;
  }
};

const forgotPasswordEmail = async (email) => {
  try {
    email = email.trim().toLowerCase();
    const user = await UserModel.getUserByEmail(email);

    if (user.length === 0) {
      throw HttpResponseError.NotFoundError("This email is not valid!");
    }

    const token = await UserModel.getResetTokenByUserId(user[0].user_id);

    if (token.length > 0) {
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
    resetPasswordToken = resetPassword.trim();
    password = password.trim();

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
  getUser,
};
