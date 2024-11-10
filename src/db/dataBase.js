const mysql = require("mysql2/promise");

const dbUser = mysql.createPool({
  connectionLimit: process.env.DB_CONN_LIMIT ? process.env.DB_CONN_LIMIT : 10,
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  port: process.env.DB_PORT || 3306,
  password: process.env.DB_PASS || "123@Iago",
  database: process.env.DB_SCHEMA || "users",
});

//Função que executa SQL em uma transação
const withTransaction = async function withTransaction(pool, callback) {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    await callback(connection);
    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    await connection.release();
  }
};

module.exports = {
  dbUser,
  withTransaction,
};
