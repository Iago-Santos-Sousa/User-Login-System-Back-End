const crypto = require("crypto");
const SECRET_KEY = process.env.HASH_SECRET_KEY;

// Função para gerar hash do ID do usuário
function generateUserHashId(userId) {
  const data = `${userId}-${SECRET_KEY}`;
  return crypto
    .createHash("sha256")
    .update(data)
    .digest("hex")
    .substring(0, 32); // Limitando para 32 caracteres para um hash mais curto
}

module.exports = {
  generateUserHashId,
};
