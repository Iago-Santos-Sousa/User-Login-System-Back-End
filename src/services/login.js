const jwt = require("jsonwebtoken");
const UserModel = require("../models/Users");
const HttpResponseError = require("../utils/HttpResponseError");

const generateAcessToken = (payload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
  return accessToken;
};

const generateRefreshToken = async (payload) => {
  try {
    // const expiresIn = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES,
    });

    await UserModel.insertRefreshToken(refreshToken, payload.userId);
    return refreshToken;
  } catch (error) {
    console.error(error?.message);
    throw error;
  }
};

const login = async (email, password) => {
  try {
    email = email.trim().toLowerCase();
    password = password.trim();
    const user = await UserModel.getUserEmailAndPassword(email, password);

    if (!user) {
      throw new HttpResponseError.UnauthorizedError(
        "Username or password is incorrect!"
      );
    }

    const resultUser = {
      name: user[0].name,
      email: user[0].email,
      userId: user[0].user_id,
    };

    // Gera o accessToken como as credenciais do usuário como payload
    const accessToken = generateAcessToken(resultUser);

    // Gera o refreshToken como as credenciais do usuário como payload
    const refreshToken = await generateRefreshToken(resultUser);

    // Retorna as credenciais do usuário e o accessToken e refreshToken formado
    resultUser.userId = user[0].user_hash_id;
    const result = {
      user: resultUser,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };

    return result;
  } catch (error) {
    throw error;
  }
};

const createNewAcessAndRefreshToken = async (refreshToken) => {
  let user = [];
  try {
    // Pega o usuário pelo refreshToken
    user = await UserModel.getRefreshToken(refreshToken);

    if (user.length === 0) {
      throw new HttpResponseError.ForbiddenError("Invalid token");
    }
  } catch (error) {
    throw error;
  }
  // Lógica 1. Se quiser gerar um novo refreshToken se o tempo do mesmo for curto (menor que 24h) faz a lógica embaixo.

  // Lógica 2. Se quiser que o tempo de expiração do refreshToken seja de 24h e quando estiver expirado redireciona o usuário para a home para fazer login novamente e gerar um novo accessToken e refreshToken, muda a lógica embaixo.
  let newRefreshToken = "";
  const resultUser = {
    name: user[0].name,
    email: user[0].email,
    userId: user[0].user_id,
  };

  try {
    let newRefreshToken = "";
    const resultUser = {
      name: user[0].name,
      email: user[0].email,
      userId: user[0].user_id,
    };

    // Pode dar esse erro "jwt expired" caso não seja a Lógica 2
    const decode = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    if (!decode) {
      // throw new Error("Token inválido ou expirado");
      console.log("Token inválido ou expirado");
      // Gera um novo access refreshToken
      newRefreshToken = await generateRefreshToken(resultUser);
    }

    // Gera um novo accessToken
    const newAccessToken = generateAcessToken(resultUser);

    // Gera um novo refreshToken
    newRefreshToken = await generateRefreshToken(resultUser);

    return { newAccessToken: newAccessToken, newRefreshToken: newRefreshToken };
    // return { newAccessToken: newAccessToken };
  } catch (error) {
    console.error(error?.message);

    // Lógica 2 abaixo
    if (error?.message === "jwt expired") {
      // Gera um novo accessToken
      const newAccessToken = generateAcessToken(resultUser);

      // Gera um novo refreshToken
      newRefreshToken = await generateRefreshToken(resultUser);

      return {
        newAccessToken: newAccessToken,
        newRefreshToken: newRefreshToken,
      };
    }
    throw error;
  }
};

module.exports = {
  login,
  generateAcessToken,
  generateRefreshToken,
  createNewAcessAndRefreshToken,
};
