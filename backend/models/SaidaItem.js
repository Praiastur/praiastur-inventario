const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/connection");

const SaidaItem = sequelize.define("saida_itens", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },

  saida_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },

  produto_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },

  quantidade: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  }
}, {
  timestamps: false
});

module.exports = SaidaItem;