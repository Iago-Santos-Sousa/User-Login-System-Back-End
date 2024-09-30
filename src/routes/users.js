const router = require("express").Router();
const userService = require("../services/users");
const usersModel = require("../models/Users");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendEmail");

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Informe todas as credenciais para criar usuário." });
    }

    const user = await userService.createUser(name, email, password);

    if (!user) {
      return res
        .status(406)
        .json({ status: "error", message: "Não foi possível criar usuário!" });
    }

    res
      .status(201)
      .json({ status: "success", message: "Usuário criado com sucesso!" });
  } catch (error) {
    console.error(error?.message);

    if (error?.message === "Já existe usuário com esse email!") {
      return res.status(409).json({ status: "error", message: error?.message });
    }

    res
      .status(500)
      .json({ status: "error", message: "Internal server error!" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(404).json({
        status: "error",
        message: "Informe o seu email para redefinir sua senha.",
      });
    }

    const userData = {
      email: email,
    };

    const linkResetPassword = await userService.forgotPasswordEmail(email);

    await sendMail(userData, linkResetPassword, res);
  } catch (error) {
    console.error(error?.message);

    if (error?.message === "Email does not exist") {
      return res
        .status(404)
        .json({ status: "error", message: "Este email não é válido!" });
    }

    res.status(500).json({
      status: "error",
      message: "Internal server error!",
    });
  }
});

router.post("/reset-password", async (req, res) => {
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

    const passwordUpdated = await userService.resetPassword(
      resetPasswordToken,
      password
    );

    if (!passwordUpdated) {
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
});

// Testar refresh token
// router.get("/check-user", (req, res) => {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ message: "Token is required!" });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       console.log("Token is invalid!");
//       return res.status(401).json({ message: "Invalid token!" });
//     }

//     res.status(200).json({ message: "Token is valid." });
//   });
// });

// Testar refresh token
router.get("/get-user/:email", (req, res) => {
  const email = req.params;
  res.status(200).json(req.user);
});

module.exports = router;
