const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/connection");

const EntradaAdministrativa = sequelize.define("entradas_administrativas", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },

  produto_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },

  quantidade: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },

  observacao: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  usuario_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true
  }
}, {
  updatedAt: false
});

module.exports = EntradaAdministrativa;