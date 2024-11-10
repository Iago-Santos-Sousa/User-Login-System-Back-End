const jwt = require("jsonwebtoken");

// Lista de endpoint sem autenticação
const unsecuredRoutes = [
  "/sign",
  "/signup",
  "/check-user",
  "/forgot-password",
  "/reset-password",
  "/refresh-token",
];

const authenticateToken = (req, res, next) => {
  const el = unsecuredRoutes.find((a) => req.path.includes(a));

  if (el) {
    // Se for uma rota que não precisa de autenticação passa o controle para a próxima rota
    next();
    return;
  }

  /* O JWT, por si só, não é criptografado, apenas assinado. Isso significa que qualquer pessoa com acesso ao token pode decodificá-lo e visualizar seu conteúdo, incluindo o ID do usuário. Se o ID do usuário for um identificador único e sensível, como um número de CPF ou prontuário médico, sua exposição pode levar a sérios riscos de privacidade e segurança. */

  const authHeader = req.headers["authorization"]; // Recebe o token do cabeçalho
  const token = authHeader && authHeader.split(" ")[1]; // Recebe o token do cabeçalho

  if (!token) {
    return res
      .status(403)
      .json({ status: "error", message: "Token not provided!" });
  }

  // Faz a verificação do token recebido no cabeçalho
  jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
    if (err) {
      req.user = null;
      return res
        .status(403)
        .json({ status: "error", message: "Unauthorized user!" });
    }

    // Se for válido coloca o token decodificado na request
    req.user = decode;
    next();
  });
};

module.exports = authenticateToken;
