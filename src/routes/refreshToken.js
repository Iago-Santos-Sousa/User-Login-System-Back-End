const router = require("express").Router();
const loginService = require("../services/login");
const UserModel = require("../models/Users");

router.post("/", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res
        .status(403)
        .json({ status: "error", message: "Token não fornecido" });
    }

    // Pega o usuário pelo refreshToken
    const user = await UserModel.getRefreshToken(refreshToken);

    if (!user || user.length <= 0) {
      return res
        .status(403)
        .json({ status: "error", message: "Token inválido" });
    }

    const { newAcessToken, newRefreshToken } =
      await loginService.createNewAcessAndRefreshToken(refreshToken, user);
    // const { newAcessToken } = await loginService.createNewAcessAndRefreshToken(
    //   refreshToken,
    // );

    res.status(200).json({
      status: "success",
      acessToken: newAcessToken,
      refreshToken: newRefreshToken,
    });
    // res
    //   .status(200)
    //   .json({ acessToken: newAcessToken, refreshToken: refreshToken });
  } catch (error) {
    console.error(error?.message);

    if (error?.message === "Token inválido ou expirado") {
      return res
        .status(403)
        .json({ status: "error", message: "Token inválido ou expirado" });
    }

    res
      .status(500)
      .json({ status: "error", message: "Erro ao criar um novo token!" });
  }
});

module.exports = router;
