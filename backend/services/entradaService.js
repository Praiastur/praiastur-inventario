const {
  ProdutoAdministrativo,
  EntradaAdministrativa,
  HistoricoMovimentacao
} = require("../models");

const { sequelize } = require("../db/connection");

async function listarEntradas() {
  const entradas = await EntradaAdministrativa.findAll({
    include: [
      {
        model: ProdutoAdministrativo,
        as: "produto",
        attributes: ["id", "nome", "quantidade_atual"]
      }
    ],
    order: [["created_at", "DESC"]]
  });

  return entradas;
}

async function buscarEntradaPorId(id) {
  const entrada = await EntradaAdministrativa.findByPk(id, {
    include: [
      {
        model: ProdutoAdministrativo,
        as: "produto",
        attributes: ["id", "nome", "quantidade_atual"]
      }
    ]
  });

  if (!entrada) {
    throw new Error("Entrada não encontrada.");
  }

  return entrada;
}

async function criarEntrada(dados, usuarioLogado) {
  const { produto_id, quantidade, observacao } = dados;

  if (!produto_id) {
    throw new Error("O produto é obrigatório.");
  }

  if (!quantidade || quantidade <= 0) {
    throw new Error("A quantidade deve ser maior que zero.");
  }

  const transaction = await sequelize.transaction();

  try {
    const produto = await ProdutoAdministrativo.findByPk(produto_id, {
      transaction
    });

    if (!produto) {
      throw new Error("Produto não encontrado.");
    }

    if (!produto.status) {
      throw new Error("Não é possível registrar entrada para produto inativo.");
    }

    const entrada = await EntradaAdministrativa.create(
      {
        produto_id,
        quantidade,
        observacao: observacao || null,
        usuario_id: usuarioLogado?.id || null
      },
      { transaction }
    );

    const novaQuantidade = Number(produto.quantidade_atual) + Number(quantidade);

    await produto.update(
      {
        quantidade_atual: novaQuantidade
      },
      { transaction }
    );

    await HistoricoMovimentacao.create(
      {
        usuario_id: usuarioLogado?.id || null,
        modulo: "ENTRADAS",
        acao: "CRIAR",
        tabela_referenciada: "entradas_administrativas",
        registro_id: entrada.id,
        descricao: `Entrada registrada: ${quantidade} unidade(s) de ${produto.nome}`
      },
      { transaction }
    );

    await transaction.commit();

    return entrada;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

module.exports = {
  listarEntradas,
  buscarEntradaPorId,
  criarEntrada
};