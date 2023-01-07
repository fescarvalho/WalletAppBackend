const { Pool } = require("pg");
require("dotenv").config();

const { DB_USER, DB_PASSWORD, DB_NAME, DB_HOST, DB_PORT, DB_URL } = process.env;

const db = new Poll(
  DB_URL
    ? {
        connectionString: DB_URL,
      }
    : {
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        host: DB_HOST,
        port: Number(DB_PORT),
      },
);

module.exports = db;
