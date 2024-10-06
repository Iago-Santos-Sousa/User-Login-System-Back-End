const UserModel = require("../models/Users");
const sendMail = require("../utils/sendEmail");
const HttpResponse = require("../utils/HttpResponse");

const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw HttpResponse.badRequest(
        "Informe todas as credenciais para criar usuário."
      );
    }

    const existUser = await UserModel.findUser(email);

    if (existUser && existUser.length > 0) {
      throw HttpResponse.existResource("Já existe usuário com esse email!");
    }

    const userId = await UserModel.createUser(name, email, password);

    if (!userId) {
      throw HttpResponse.notAcceptable("Não foi possível criar usuário!");
    }

    res
      .status(201)
      .json({ status: "success", message: "Usuário criado com sucesso!" });
  } catch (error) {
    next(error);
  }
};

const forgotPasswordEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw HttpResponse.badRequest(
        "Informe o seu email para redefinir sua senha."
      );
    }

    const user = await UserModel.getUserByEmail(email);

    if (user && user.length <= 0) {
      throw HttpResponse.badRequest("Este email não é válido!");
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

    await sendMail(userData, linkResetPassword, res);
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { resetPasswordToken, password } = req.body;

    if (!resetPasswordToken) {
      throw HttpResponse.badRequest(
        "Token de redefinição de senha não informado!"
      );
    }

    if (!password) {
      throw HttpResponse.badRequest("Informe a nova senha!");
    }

    const updatedPasswordUser = await UserModel.resetPassword(
      resetPasswordToken,
      password
    );

    if (!updatedPasswordUser) {
      throw HttpResponse.notAcceptable("Não foi possível alterar a senha!");
    }

    res
      .status(200)
      .json({ status: "success", message: "Senha alterada com sucesso." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  forgotPasswordEmail,
  resetPassword,
};
