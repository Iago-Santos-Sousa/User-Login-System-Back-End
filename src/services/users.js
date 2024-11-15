const UserModel = require("../models/Users");
const HttpResponseError = require("../utils/HttpResponseError");
const someUtils = require("../utils/someUtils");
const { dbUser, withTransaction } = require("../db/dataBase");

const createUser = async (name, email, password) => {
  try {
    let userId = null;
    name = name.trim();
    email = email.trim().toLowerCase();
    password = password.trim();
    const existUserEmail = await UserModel.getUserByEmail(email);

    if (existUserEmail) {
      throw new HttpResponseError.ExistResourceError(
        "There is already a user with this email!"
      );
    }

    await withTransaction(dbUser, async (connection) => {
      const resultId = await UserModel.createUser(
        connection,
        name,
        email,
        password
      );

      const userHashId = someUtils.generateUserHashId(userId);
      const updateResult = await UserModel.updateHashUserId(
        connection,
        userHashId,
        resultId
      );

      userId = resultId;
    });

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
    if (!email) {
      throw new HttpResponseError.BadRequestError("email is required!");
    }

    const user = await UserModel.getUserByEmail(email);

    if (!user) {
      throw new HttpResponseError.NotFoundError("This email is not valid!");
    }

    const resetPasswordToken = await UserModel.getResetTokenByUserId(
      user.user_id
    );

    if (resetPasswordToken.token_password) {
      await UserModel.deleteResetTokenByUserId(user.user_id);
    }

    const { resetTokenLink, hashTokenDb } =
      await UserModel.createUserResetToken();

    if (!resetTokenLink || !hashTokenDb) {
      throw new HttpResponseError.NotAcceptableError(
        "It was not possible to generate a link to restore the password!"
      );
    }

    const resultResetToken = await UserModel.insertResetToken(
      user.user_id,
      hashTokenDb
    );

    if (!resultResetToken) {
      throw new HttpResponseError.NotAcceptableError(
        "It was not possible to generate a link to restore the password!"
      );
    }

    const linkResetPassword = `http://localhost:${5173}/reset-password/${resetTokenLink}`;

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
    resetPasswordToken = resetPasswordToken.trim();
    password = password.trim();

    if (!resetPasswordToken || !password) {
      throw new HttpResponseError.BadRequestError(
        "Reset password token and new password is required!"
      );
    }

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
