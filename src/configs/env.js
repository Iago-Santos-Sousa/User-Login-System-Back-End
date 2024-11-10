require("dotenv").config();

const env = {
  APP_PORT: process.env.APP_PORT,
  DB_CONN_LIMIT: process.env.DB_CONN_LIMIT || 10,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES: process.env.JWT_EXPIRES,
  JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES,
};

exports.env = env;
