const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/connection");

const HistoricoMovimentacao = sequelize.define("historico_movimentacoes", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },

  usuario_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true
  },

  modulo: {
    type: DataTypes.STRING(50),
    allowNull: false
  },

  acao: {
    type: DataTypes.STRING(50),
    allowNull: false
  },

  tabela_referenciada: {
    type: DataTypes.STRING(100),
    allowNull: true
  },

  registro_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true
  },

  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  updatedAt: false
});

module.exports = HistoricoMovimentacao;