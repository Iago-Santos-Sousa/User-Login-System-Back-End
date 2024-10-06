const UserModel = require("../models/Users");
const sendMail = require("../utils/sendEmail");

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Informe todas as credenciais para criar usuário." });
    }

    const existUser = await UserModel.findUser(email);

    if (existUser && existUser.length > 0) {
      return res.status(409).json({
        status: "error",
        message: "Já existe usuário com esse email!",
      });
    }

    const userId = await UserModel.createUser(name, email, password);

    if (!userId) {
      return res
        .status(406)
        .json({ status: "error", message: "Não foi possível criar usuário!" });
    }

    res
      .status(201)
      .json({ status: "success", message: "Usuário criado com sucesso!" });
  } catch (error) {
    console.error(error?.message);
    res
      .status(500)
      .json({ status: "error", message: "Internal server error!" });
  }
};

const forgotPasswordEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "Informe o seu email para redefinir sua senha.",
      });
    }

    const user = await UserModel.getUserByEmail(email);
    if (user && user.length <= 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Este email não é válido!" });
    }

    const token = await UserModel.getResetTokenByUserId(user[0].user_id);
    if (token && token.length > 0) {
      await UserModel.deleteResetTokenByUserId(user[0].user_id);
    }

    const { resetToken, hashToken } = await UserModel.createUserResetToken();
    console.error(resetToken);

    const resultResetToken = await UserModel.insertResetToken(
      user[0].user_id,
      hashToken
    );

    const linkResetPassword = `http://localhost:${5173}/reset-password/${resetToken}`;

    const userData = {
      email: email,
    };

    await sendMail(userData, linkResetPassword, res);
  } catch (error) {
    console.error(error?.message);
    res.status(500).json({
      status: "error",
      message: "Internal server error!",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { resetPasswordToken, password } = req.body;

    if (!resetPasswordToken) {
      return res.status(400).json({
        status: "error",
        message: "Token de redefinição de senha não informado!",
      });
    }

    if (!password) {
      return res
        .status(400)
        .json({ status: "error", message: "Informe a nova senha!" });
    }

    const updatedPasswordUser = await UserModel.resetPassword(
      resetPasswordToken,
      password
    );

    if (!updatedPasswordUser) {
      return res.status(406).json({
        status: "error",
        message: "Não foi possível alterar a senha!",
      });
    }

    res
      .status(200)
      .json({ status: "success", message: "Senha alterada com sucesso." });
  } catch (error) {
    console.error(error?.message);
    if (error?.message === "Invalid password reset token!") {
      return res.status(406).json({
        status: "error",
        message: "Token de redefinição de senha inválido!",
      });
    }

    if (error?.message === "Token expired!") {
      return res
        .status(410)
        .json({ status: "error", message: "O token expirou." });
    }

    res.status(500).json({
      status: "error",
      message: "Internal server error!",
    });
  }
};

const uploadImgUser = async (img) => {};

module.exports = {
  createUser,
  uploadImgUser,
  forgotPasswordEmail,
  resetPassword,
};
