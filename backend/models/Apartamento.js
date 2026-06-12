const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/connection");

const Apartamento = sequelize.define("apartamentos", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },

  residencial_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },

  nome_numero: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  tipo: {
    type: DataTypes.STRING(50),
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
}, {
  indexes: [
    {
      unique: true,
      fields: ["residencial_id", "nome_numero"]
    }
  ]
});

module.exports = Apartamento;