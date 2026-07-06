require("dotenv").config();

const { Sequelize } = require("sequelize");
const mysql = require("mysql2/promise");

const pg_con = process.env.pg_con;

const db_name = process.env.db_name;
const db_user = process.env.db_user;
const db_password = process.env.db_password;
const db_host = process.env.db_host;
const db_port = process.env.db_port || 3306;

const usando_postgres = Boolean(pg_con);

let sequelize;

if (usando_postgres) {
  sequelize = new Sequelize(pg_con, {
    dialect: "postgres",
    logging: false,
    define: {
      underscored: true
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  sequelize = new Sequelize(db_name, db_user, db_password, {
    host: db_host,
    port: Number(db_port),
    dialect: "mysql",
    logging: false,
    define: {
      underscored: true
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
}

async function createDatabaseIfNotExists() {
  if (usando_postgres) {
    return;
  }

  const connection = await mysql.createConnection({
    host: db_host,
    port: Number(db_port),
    user: db_user,
    password: db_password
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${db_name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
  );

  await connection.end();
}

module.exports = {
  sequelize,
  createDatabaseIfNotExists
};