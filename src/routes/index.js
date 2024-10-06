const router = require("express").Router();
const loginRouter = require("./login");
const refreshTokenRouter = require("./refreshToken");
const usersRouter = require("./users");
const authenticateToken = require("../middlewares/authentication");

// Aplicar o middleware de autenticação a todas as rotas
router.use(authenticateToken);

// Rota de login
router.use("/sign", loginRouter);

// Rota de refreshToken
router.use("/refresh-token", refreshTokenRouter);

// Rota de usuários
router.use("/users", usersRouter);

// Rota de teste de autenticação
router.get("/teste", async (req, res) => {
  res.status(200).json({ message: "Está autenticado!" });
});

module.exports = router;
