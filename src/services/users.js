const UserModel = require("../models/Users");

const createUser = async (name, email, password) => {
  try {
    const existUser = await UserModel.findUser(email);

    if (existUser && existUser.length > 0) {
      throw new Error("Já existe usuário com esse email!");
    }

    const userId = await UserModel.createUser(name, email, password);

    if (!userId) {
      return null;
    }

    return userId;
  } catch (error) {
    console.error(error?.message);
    throw error;
  }
};

const forgotPasswordEmail = async (email) => {
  try {
    const user = await UserModel.getUserByEmail(email);
    if (user && user.length <= 0) {
      throw new Error("Email does not exist");
    }

    const token = await UserModel.getResetTokenByUserId(user[0].user_id);
    if (token && token.length > 0) {
      await UserModel.deleteResetTokenByUserId(user[0].user_id);
    }

    const { resetToken, hashToken } = await UserModel.createUserResetToken();
    console.error(resetToken);

    const resultResetToken = await UserModel.insertResetToken(
      user[0].user_id,
      hashToken,
    );

    const linkResetPassword = `http://localhost:${5173}/reset-password/${resetToken}`;

    return linkResetPassword;
  } catch (error) {
    console.error(error?.message);
    throw error;
  }
};

const resetPassword = async (resetPasswordToken, password) => {
  try {
    const updatedPasswordUser = await UserModel.resetPassword(
      resetPasswordToken,
      password,
    );
    return updatedPasswordUser;
  } catch (error) {
    console.error(error?.message);
    throw error;
  }
};

const uploadImgUser = async (img) => {};

module.exports = {
  createUser,
  uploadImgUser,
  forgotPasswordEmail,
  resetPassword,
};
