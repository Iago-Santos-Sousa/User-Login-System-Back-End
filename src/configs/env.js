require("dotenv").config();

const env = {
  PORT: process.env.PORT,
  ADM_DB_HOST: process.env.ADM_DB_HOST,
  ADM_DB_USER: process.env.ADM_DB_USER,
  ADM_DB_PASS: process.env.ADM_DB_PASS,
  ADM_DB_SCHEMA: process.env.ADM_DB_SCHEMA,
  CONFIA_DB_HOST: process.env.CONFIA_DB_HOST,
  CONFIA_DB_USER: process.env.CONFIA_DB_USER,
  CONFIA_DB_PASS: process.env.CONFIA_DB_PASS,
  CONFIA_DB_SCHEMA: process.env.CONFIA_DB_SCHEMA,
  GENE_DB_HOST: process.env.GENE_DB_HOST,
  GENE_DB_USER: process.env.GENE_DB_USER,
  GENE_DB_PASS: process.env.GENE_DB_PASS,
  GENE_DB_SCHEMA: process.env.GENE_DB_SCHEMA,
  LOGS_DB_HOST: process.env.LOGS_DB_HOST,
  LOGS_DB_USER: process.env.LOGS_DB_USER,
  LOGS_DB_PASS: process.env.LOGS_DB_PASS,
  LOGS_DB_SCHEMA: process.env.LOGS_DB_SCHEMA,
  AWS_KEY: process.env.AWS_KEY,
  AWS_KEY_ID: process.env.AWS_KEY_ID,
  AWS_REGION: process.env.AWS_REGION,
  DB_CONN_LIMIT: process.env.DB_CONN_LIMIT || 10,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES: process.env.JWT_EXPIRES,
  JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES,
};

exports.env = env;
