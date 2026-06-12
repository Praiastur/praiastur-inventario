const { Sequelize } = require("sequelize");
const mysql = require("mysql2/promise");
require("dotenv").config();

const dbName = process.env.DB_NAME || "praiastur_inventario";

async function createDatabaseIfNotExists() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || ""
  });

  await connection.query(`
    CREATE DATABASE IF NOT EXISTS \`${dbName}\`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
  `);

  await connection.end();
}

const sequelize = new Sequelize(
  dbName,
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    dialect: "mysql",
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  }
);

module.exports = {
  sequelize,
  createDatabaseIfNotExists
};