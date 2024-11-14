const { dbUser, withTransaction } = require("../db/dataBase");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const salt = bcrypt.genSaltSync(10);
const HttpResponse = require("../utils/HttpResponse");

const createUser = async (connection, name, email, password) => {
  try {
    const hashPassword = bcrypt.hashSync(password, salt);
    const query = `INSERT INTO users.user (name, email, password) VALUES (?, ?, ?)`;
    const params = [name, email, hashPassword];
    const [user] = await connection.query(query, params);
    return user.insertId ?? null;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getUserById = async (user_id) => {
  try {
    const query = `SELECT name, email, user_hash_id AS user_id FROM users.user WHERE user_hash_id = ?`;
    const params = [user_id];
    const [user] = await dbUser.query(query, params);
    return user[0] ?? null;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateHashUserId = async (connection, userHashId, userId) => {
  try {
    const query = `UPDATE users.user SET user_hash_id = ? WHERE user_id = ?`;
    const params = [userHashId, userId];
    const [user] = await connection.query(query, params);
    return user.affectedRows ?? null;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const insertRefreshToken = async (refreshToken, userId) => {
  try {
    const query = `UPDATE users.user SET refresh_token = ? WHERE user_id = ?`;
    const params = [refreshToken, userId];
    await dbUser.query(query, params);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getRefreshToken = async (refreshToken) => {
  try {
    const query = `SELECT user_id, name, email, refresh_token FROM users.user WHERE refresh_token = ?`;
    const params = [refreshToken];
    const [user] = await dbUser.query(query, params);
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getUserEmailAndPassword = async (email, password) => {
  try {
    const query = `SELECT user_id, name, email, user_hash_id, password FROM users.user WHERE email = ?`;
    const params = [email];
    const [results] = await dbUser.query(query, params);

    if (results.length === 0) {
      return null;
    }

    // Faz a comparação da senha do usuário com o hash do bcrypt
    const passwordResult = await bcrypt.compare(password, results[0].password);

    if (!passwordResult) {
      return null;
    }

    return results;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getUserByEmail = async (email) => {
  try {
    const queryString = `SELECT user_id, name, email FROM users.user WHERE email = ?`;
    const [emailUser] = await dbUser.query(queryString, [email]);
    return emailUser;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getResetTokenByUserId = async (userId) => {
  try {
    const queryString = `SELECT user_id, token, token_expiry FROM users.reset_tokens WHERE user_id = ?`;
    const [resetToken] = await dbUser.query(queryString, [userId]);
    return resetToken;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getResetTokenByHashToken = async (hashToken) => {
  try {
    const queryString = `SELECT user_id, token, token_expiry FROM users.reset_tokens WHERE token = ?`;
    const [resetToken] = await dbUser.query(queryString, [hashToken]);
    return resetToken;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const deleteResetTokenByUserId = async (userId) => {
  try {
    const queryString = `DELETE FROM users.reset_tokens WHERE user_id = ?`;
    const [resetToken] = await dbUser.query(queryString, [userId]);
    return resetToken;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const insertResetToken = async (userId, hashToken) => {
  try {
    const queryString = `INSERT INTO users.reset_tokens (user_id, token) VALUES (?, ?)`;
    const queryParams = [userId, hashToken];
    const [resetToken] = await dbUser.query(queryString, queryParams);
    return resetToken;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getAllRowsTokensUser = async (userId) => {
  try {
    const queryString = `SELECT user_id, token, token_expiry FROM users.reset_tokens WHERE user_id = ? FOR UPDATE`;
    const [tokens] = await dbUser.query(queryString, [userId]);
    return tokens;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const createUserResetToken = async () => {
  try {
    let resetToken = crypto.randomBytes(64).toString("hex");
    const hashToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    return { resetToken: resetToken, hashToken: hashToken };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const resetPassword = async (resetPasswordToken, password) => {
  try {
    // Fazemos o hash do requestToken e consultamos o banco de dados baseado no valor hasheado. Se nada for encontrado, lançamos um erro.

    const hashToken = crypto
      .createHash("sha256")
      .update(resetPasswordToken)
      .digest("hex");
    const findHashToken = await getResetTokenByHashToken(hashToken);

    if (
      !findHashToken ||
      findHashToken.length <= 0 ||
      !findHashToken[0]?.token
    ) {
      // throw new Error("Invalid password reset token!");
      throw HttpResponse.notFound("Invalid password reset token!");
    }

    const userIdToken = findHashToken[0].user_id; // Token existe
    //Agora sabemos que o token existe, então ele é válido. Iniciamos uma transação para resetar a senha.

    let result = null;

    await withTransaction(dbUser, async (connection) => {
      // Como o allUserTokens é um array de tokens vindo do banco de dados. Temos que usar uma consulta que bloqueie todas as linhas na tabela que pertencem a este userId. Podemos usar algo como: “SELECT * FROM password_reset_tokens WHERE user_id = userId FOR UPDATE”. A parte “FOR UPDATE" bloqueia todas as linhas relevantes.

      const allUserTokens = await getAllRowsTokensUser(userIdToken);

      // Procuramos a linha que corresponde ao hash do token de entrada, para garantir que outra transação não tenha resgatado ela já.
      let matchedRow = null;

      for (const token of allUserTokens) {
        if (token.token === hashToken) {
          matchedRow = token;
        }
      }

      if (matchedRow === null || matchedRow === undefined) {
        // O token foi resgatado por outra transação. Então saímos.
        // throw new Error("Invalid password reset token!");
        throw HttpResponse.notFound("Invalid password reset token!");
      }

      // Agora vamos deletar todos os tokens pertencentes a este usuário para evitar uso duplicado.
      const queryStringDelete = `DELETE FROM users.reset_tokens WHERE user_id = ?`;
      const deleteParams = [userIdToken];
      await connection.query(queryStringDelete, deleteParams);

      // Agora verificamos se o token atual expirou ou não.
      const currentTime = Date.now();
      const tenMinutesInMillis = 15 * 60 * 1000; // 15 minutos em milissegundos
      const expirationTime = currentTime - matchedRow.token_expiry.getTime();

      if (expirationTime >= tenMinutesInMillis) {
        // throw new Error("Token expired!");
        throw HttpResponse.gone("Token expired!");
      }

      // Agora todas as verificações foram concluídas. Podemos alterar a senha do usuário.
      const hashPassword = await bcrypt.hash(password, 10);
      const queryStringUpdate = `UPDATE users.user SET password = ? WHERE user_id = ?`;
      const updateParams = [hashPassword, userIdToken];
      const [updatedPasswordUser] = await connection.query(
        queryStringUpdate,
        updateParams
      );

      result = updatedPasswordUser.changedRows;
    });

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  createUser,
  getUserEmailAndPassword,
  getUserByEmail,
  getResetTokenByUserId,
  resetPassword,
  getAllRowsTokensUser,
  insertResetToken,
  deleteResetTokenByUserId,
  getResetTokenByHashToken,
  createUserResetToken,
  insertRefreshToken,
  getRefreshToken,
  getUserById,
  updateHashUserId,
};
