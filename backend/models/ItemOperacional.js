const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/connection");

const ItemOperacional = sequelize.define("itens_operacionais", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },

  apartamento_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },

  nome: {
    type: DataTypes.STRING(150),
    allowNull: false
  },

  quantidade: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 1
  },

  status_item: {
    type: DataTypes.ENUM("BOM", "ATENCAO", "PROBLEMA", "EM_FALTA"),
    allowNull: false,
    defaultValue: "BOM"
  },

  observacao: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  imagem: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  updated_by: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true
  }
});

module.exports = ItemOperacional;