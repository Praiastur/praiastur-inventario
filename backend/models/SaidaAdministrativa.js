const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/connection");

const SaidaAdministrativa = sequelize.define("saidas_administrativas", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },

  codigo_saida: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true
  },

  destinatario: {
    type: DataTypes.STRING(150),
    allowNull: false
  },

  observacao: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  status: {
    type: DataTypes.ENUM("FINALIZADA", "CANCELADA"),
    allowNull: false,
    defaultValue: "FINALIZADA"
  },

  usuario_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true
  }
}, {
  updatedAt: false
});

module.exports = SaidaAdministrativa;