require("dotenv").config();

let config = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  dialect: "postgres",
  port: process.env.DB_PORT,
  ssl: true,
  logging: false,
  dialectOptions: {
    ssl: true
  }
};

module.exports = config;
