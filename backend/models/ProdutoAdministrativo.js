const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/connection");

const ProdutoAdministrativo = sequelize.define("produtos_administrativos", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },

  nome: {
    type: DataTypes.STRING(150),
    allowNull: false
  },

  quantidade_atual: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0
  },

  estoque_minimo: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0
  },

  observacao: {
    type: DataTypes.TEXT,
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

module.exports = ProdutoAdministrativo;