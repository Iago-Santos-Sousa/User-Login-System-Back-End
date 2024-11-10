const router = require("express").Router();
const loginRouter = require("./login");
const refreshTokenRouter = require("./refreshToken");
const usersRouter = require("./users");
const authenticateToken = require("../middlewares/authentication");
// const errorHandler = require("../middlewares/errorHandler");

// Aplicar o middleware de autenticação a todas as rotas
router.use(authenticateToken);

// Rota de login
router.use("/sign", loginRouter);

// Rota de usuários
router.use("/users", usersRouter);

// Rota de refreshToken
router.use("/refresh-token", refreshTokenRouter);

// router.use(errorHandler);

module.exports = router;
