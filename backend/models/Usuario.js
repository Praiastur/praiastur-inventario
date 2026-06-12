const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/connection");

const Usuario = sequelize.define("usuarios", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },

  nome: {
    type: DataTypes.STRING(150),
    allowNull: false
  },

  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true
  },

  senha: {
    type: DataTypes.STRING(255),
    allowNull: false
  },

  perfil: {
    type: DataTypes.ENUM("ADMINISTRADOR", "OPERACIONAL"),
    allowNull: false,
    defaultValue: "OPERACIONAL"
  },

  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
});

module.exports = Usuario;