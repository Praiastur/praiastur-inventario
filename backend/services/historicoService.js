const { HistoricoMovimentacao, Usuario } = require("../models");

async function listarHistoricos(filtros = {}) {
  const where = {};

  if (filtros.modulo !== undefined) {
    where.modulo = filtros.modulo;
  }

  if (filtros.acao !== undefined) {
    where.acao = filtros.acao;
  }

  if (filtros.usuario_id !== undefined) {
    where.usuario_id = filtros.usuario_id;
  }

  const historicos = await HistoricoMovimentacao.findAll({
    where,
    include: [
      {
        model: Usuario,
        as: "usuario",
        attributes: ["id", "nome", "email", "perfil"]
      }
    ],
    order: [["created_at", "DESC"]]
  });

  return historicos;
}

async function buscarHistoricoPorId(id) {
  const historico = await HistoricoMovimentacao.findByPk(id, {
    include: [
      {
        model: Usuario,
        as: "usuario",
        attributes: ["id", "nome", "email", "perfil"]
      }
    ]
  });

  if (!historico) {
    throw new Error("Histórico não encontrado.");
  }

  return historico;
}

module.exports = {
  listarHistoricos,
  buscarHistoricoPorId
};