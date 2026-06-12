const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/connection");

const Residencial = sequelize.define("residenciais", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },

  nome: {
    type: DataTypes.STRING(150),
    allowNull: false
  },

  cidade: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  estado: {
    type: DataTypes.STRING(2),
    allowNull: false
  },

  endereco: {
    type: DataTypes.STRING(255),
    allowNull: true
  },

  observacao: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  imagem: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },

  created_by: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true
  }
});

module.exports = Residencial;