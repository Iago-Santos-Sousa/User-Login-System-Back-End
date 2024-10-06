const router = require("express").Router();
const loginService = require("../services/login");
const UserModel = require("../models/Users");
// const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res
        .status(400)
        .json({ status: "error", message: "Informe todas as credenciais!" });
    }

    const result = await loginService.login(email, password);

    res.status(200).json(result);
  } catch (error) {
    console.error(error?.message);

    if (error?.message === "Credenciais inválidas!") {
      return res.status(401).json({
        status: "error",
        message: "Usuário ou senha estão incorretos!",
      });
    }

    res
      .status(500)
      .json({ status: "error", message: "Internal server error!" });
  }
});

module.exports = router;
