const {
  ProdutoAdministrativo,
  SaidaAdministrativa,
  SaidaItem,
  HistoricoMovimentacao
} = require("../models");

const { sequelize } = require("../db/connection");

function gerarCodigoSaida() {
  const data = new Date();

  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  const hora = String(data.getHours()).padStart(2, "0");
  const minuto = String(data.getMinutes()).padStart(2, "0");
  const segundo = String(data.getSeconds()).padStart(2, "0");

  return `SAI-${ano}${mes}${dia}-${hora}${minuto}${segundo}`;
}

async function listarSaidas() {
  const saidas = await SaidaAdministrativa.findAll({
    include: [
      {
        model: SaidaItem,
        as: "itens",
        include: [
          {
            model: ProdutoAdministrativo,
            as: "produto",
            attributes: ["id", "nome"]
          }
        ]
      }
    ],
    order: [["created_at", "DESC"]]
  });

  return saidas;
}

async function buscarSaidaPorId(id) {
  const saida = await SaidaAdministrativa.findByPk(id, {
    include: [
      {
        model: SaidaItem,
        as: "itens",
        include: [
          {
            model: ProdutoAdministrativo,
            as: "produto",
            attributes: ["id", "nome", "quantidade_atual"]
          }
        ]
      }
    ]
  });

  if (!saida) {
    throw new Error("Saída não encontrada.");
  }

  return saida;
}

async function criarSaida(dados, usuarioLogado) {
  const { destinatario, observacao, itens } = dados;

  if (!destinatario || destinatario.trim() === "") {
    throw new Error("O destinatário é obrigatório.");
  }

  if (!itens || !Array.isArray(itens) || itens.length === 0) {
    throw new Error("A saída precisa ter pelo menos um produto.");
  }

  const transaction = await sequelize.transaction();

  try {
    const saida = await SaidaAdministrativa.create(
      {
        codigo_saida: gerarCodigoSaida(),
        destinatario: destinatario.trim(),
        observacao: observacao || null,
        status: "FINALIZADA",
        usuario_id: usuarioLogado?.id || null
      },
      { transaction }
    );

    for (const item of itens) {
      const { produto_id, quantidade } = item;

      if (!produto_id) {
        throw new Error("Produto é obrigatório em todos os itens da saída.");
      }

      if (!quantidade || quantidade <= 0) {
        throw new Error("A quantidade de cada produto deve ser maior que zero.");
      }

      const produto = await ProdutoAdministrativo.findByPk(produto_id, {
        transaction
      });

      if (!produto) {
        throw new Error(`Produto com ID ${produto_id} não encontrado.`);
      }

      if (!produto.status) {
        throw new Error(`O produto "${produto.nome}" está inativo.`);
      }

      if (Number(produto.quantidade_atual) < Number(quantidade)) {
        throw new Error(
          `Estoque insuficiente para o produto "${produto.nome}". Estoque atual: ${produto.quantidade_atual}. Quantidade solicitada: ${quantidade}.`
        );
      }

      await SaidaItem.create(
        {
          saida_id: saida.id,
          produto_id,
          quantidade
        },
        { transaction }
      );

      const novaQuantidade = Number(produto.quantidade_atual) - Number(quantidade);

      await produto.update(
        {
          quantidade_atual: novaQuantidade
        },
        { transaction }
      );
    }

    await HistoricoMovimentacao.create(
      {
        usuario_id: usuarioLogado?.id || null,
        modulo: "SAIDAS",
        acao: "CRIAR",
        tabela_referenciada: "saidas_administrativas",
        registro_id: saida.id,
        descricao: `Saída registrada para ${destinatario}`
      },
      { transaction }
    );

    await transaction.commit();

    const saidaCompleta = await buscarSaidaPorId(saida.id);

    return saidaCompleta;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
async function cancelarSaida(id, usuarioLogado) {
  const transaction = await sequelize.transaction();

  try {
    const saida = await SaidaAdministrativa.findByPk(id, {
      include: [
        {
          model: SaidaItem,
          as: "itens",
          include: [
            {
              model: ProdutoAdministrativo,
              as: "produto"
            }
          ]
        }
      ],
      transaction
    });

    if (!saida) {
      throw new Error("Saída não encontrada.");
    }

    if (saida.status === "CANCELADA") {
      throw new Error("Esta saída já está cancelada.");
    }

    for (const item of saida.itens) {
      const produto = item.produto;

      if (!produto) {
        throw new Error("Produto vinculado à saída não encontrado.");
      }

      const novaQuantidade =
        Number(produto.quantidade_atual) + Number(item.quantidade);

      await produto.update(
        {
          quantidade_atual: novaQuantidade
        },
        { transaction }
      );
    }

    await saida.update(
      {
        status: "CANCELADA"
      },
      { transaction }
    );

    await HistoricoMovimentacao.create(
      {
        usuario_id: usuarioLogado?.id || null,
        modulo: "SAIDAS",
        acao: "CANCELAR",
        tabela_referenciada: "saidas_administrativas",
        registro_id: saida.id,
        descricao: `Saída cancelada: ${saida.codigo_saida}. Produtos devolvidos ao estoque.`
      },
      { transaction }
    );

    await transaction.commit();

    const saidaAtualizada = await buscarSaidaPorId(id);

    return saidaAtualizada;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

module.exports = {
  listarSaidas,
  buscarSaidaPorId,
  criarSaida, 
  cancelarSaida
};