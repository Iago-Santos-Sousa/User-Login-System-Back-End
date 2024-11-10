const jwt = require("jsonwebtoken");

// Lista de endpoint sem autenticação
const unsecuredRoutes = ["/login", "/create-user"];

const authenticateToken = (req, res, next) => {
  const el = unsecuredRoutes.find((a) => req.path.includes(a));

  if (el) {
    // Se for uma rota que não precisa de autenticação passa o controle para a próxima rota
    next();
    return;
  }

  /* O JWT, por si só, não é criptografado, apenas assinado. Isso significa que qualquer pessoa com acesso ao token pode decodificá-lo e visualizar seu conteúdo, incluindo o ID do usuário. Se o ID do usuário for um identificador único e sensível, como um número de CPF ou prontuário médico, sua exposição pode levar a sérios riscos de privacidade e segurança. */

  const token = req.cookies.jwt; // Recebe o token do cookie

  if (!token) {
    return res.status(401).json({ message: "Token não fornecido." });
  }

  // Faz a verificação do token recebido no cookie
  jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
    console.log({ decode });
    if (err) {
      return res.status(404).json({ message: "Usuário não autorizado!" });
    }

    req.user = decode;
    next();
  });
};

module.exports = authenticateToken;
