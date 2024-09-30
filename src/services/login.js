const jwt = require("jsonwebtoken");
const UserModel = require("../models/Users");
// const moment = require("moment");

const generateAcessToken = (payload) => {
  const acessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
  return acessToken;
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
    const user = await UserModel.getUserEmailAndPassword(email, password);

    if (!user || user.length <= 0) {
      throw new Error("Credenciais inválidas!");
    }

    const resultUser = {
      name: user[0].name,
      email: user[0].email,
      userId: user[0].user_id,
    };

    // Gera o acessToken como as credenciais do usuário como payload
    const acessToken = generateAcessToken(resultUser);

    // Gera o refreshToken como as credenciais do usuário como payload
    const refreshToken = await generateRefreshToken(resultUser);

    // Retorna as credenciais do usuário e o acessToken e refreshToken formado
    return {
      user: resultUser,
      acessToken: acessToken,
      refreshToken: refreshToken,
    };
  } catch (error) {
    console.error(error?.message);
    throw error;
  }
};

const createNewAcessAndRefreshToken = async (refreshToken, user) => {
  // Lógica 1. Se quiser gerar um novo refreshToken se o tempo do mesmo for curto (menor que 24h) faz a lógica embaixo.

  // Lógica 2. Se quiser que o tempo de expiração do refreshToken seja de 24h e quando estiver expirado redireciona o usuário para a home para fazer login novamente e gerar um novo acessToken e refreshToken, muda a lógica embaixo.
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
    const decode = jwt.verify(refreshToken, process.env.JWT_SECRET);

    if (!decode) {
      // throw new Error("Token inválido ou expirado");
      console.log("Token inválido ou expirado");
      // Gera um novo access refreshToken
      newRefreshToken = await generateRefreshToken(resultUser);
    }

    // Gera um novo accessToken
    const newAcessToken = generateAcessToken(resultUser);

    // Gera um novo refreshToken
    newRefreshToken = await generateRefreshToken(resultUser);

    return { newAcessToken: newAcessToken, newRefreshToken: newRefreshToken };
    // return { newAcessToken: newAcessToken };
  } catch (error) {
    console.error(error?.message);

    // Lógica 2 abaixo
    if (error?.message === "jwt expired") {
      // Gera um novo accessToken
      const newAcessToken = generateAcessToken(resultUser);

      // Gera um novo refreshToken
      newRefreshToken = await generateRefreshToken(resultUser);

      return { newAcessToken: newAcessToken, newRefreshToken: newRefreshToken };
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
