const {
  ItemOperacional,
  Apartamento,
  Residencial,
  HistoricoMovimentacao
} = require("../models");

async function listarItens(filtros = {}) {
  const where = {};

  if (filtros.status_item !== undefined) {
    where.status_item = filtros.status_item;
  }

  if (filtros.apartamento_id !== undefined) {
    where.apartamento_id = filtros.apartamento_id;
  }

  const itens = await ItemOperacional.findAll({
    where,
    include: [
      {
        model: Apartamento,
        as: "apartamento",
        attributes: ["id", "nome_numero", "tipo"],
        include: [
          {
            model: Residencial,
            as: "residencial",
            attributes: ["id", "nome", "cidade", "estado"]
          }
        ]
      }
    ],
    order: [["nome", "ASC"]]
  });

  return itens;
}

async function buscarItemPorId(id) {
  const item = await ItemOperacional.findByPk(id, {
    include: [
      {
        model: Apartamento,
        as: "apartamento",
        attributes: ["id", "nome_numero", "tipo"],
        include: [
          {
            model: Residencial,
            as: "residencial",
            attributes: ["id", "nome", "cidade", "estado"]
          }
        ]
      }
    ]
  });

  if (!item) {
    throw new Error("Item operacional não encontrado.");
  }

  return item;
}

async function criarItem(dados, usuarioLogado) {
  const { apartamento_id, nome, quantidade, status_item, observacao } = dados;

  if (!apartamento_id) {
    throw new Error("O apartamento ou espaço é obrigatório.");
  }

  if (!nome || nome.trim() === "") {
    throw new Error("O nome do item é obrigatório.");
  }

  if (quantidade === undefined || quantidade < 0) {
    throw new Error("A quantidade não pode ser negativa.");
  }

  const statusPermitidos = ["BOM", "ATENCAO", "PROBLEMA", "EM_FALTA"];

  if (status_item && !statusPermitidos.includes(status_item)) {
    throw new Error("Status do item inválido.");
  }

  const apartamento = await Apartamento.findByPk(apartamento_id);

  if (!apartamento) {
    throw new Error("Apartamento ou espaço não encontrado.");
  }

  if (!apartamento.status) {
    throw new Error("Não é possível cadastrar item em apartamento/espaço inativo.");
  }

  const item = await ItemOperacional.create({
    apartamento_id,
    nome: nome.trim(),
    quantidade,
    status_item: status_item || "BOM",
    observacao: observacao || null,
    updated_by: usuarioLogado?.id || null
  });

  await HistoricoMovimentacao.create({
    usuario_id: usuarioLogado?.id || null,
    modulo: "ITENS_OPERACIONAIS",
    acao: "CRIAR",
    tabela_referenciada: "itens_operacionais",
    registro_id: item.id,
    descricao: `Item operacional criado: ${item.nome}`
  });

  return item;
}

async function atualizarItem(id, dados, usuarioLogado) {
  const item = await buscarItemPorId(id);

  const { apartamento_id, nome, quantidade, status_item, observacao } = dados;

  if (apartamento_id !== undefined) {
    const apartamento = await Apartamento.findByPk(apartamento_id);

    if (!apartamento) {
      throw new Error("Apartamento ou espaço não encontrado.");
    }

    if (!apartamento.status) {
      throw new Error("Não é possível mover item para apartamento/espaço inativo.");
    }
  }

  if (nome !== undefined && nome.trim() === "") {
    throw new Error("O nome do item não pode ficar vazio.");
  }

  if (quantidade !== undefined && quantidade < 0) {
    throw new Error("A quantidade não pode ser negativa.");
  }

  const statusPermitidos = ["BOM", "ATENCAO", "PROBLEMA", "EM_FALTA"];

  if (status_item !== undefined && !statusPermitidos.includes(status_item)) {
    throw new Error("Status do item inválido.");
  }

  await item.update({
    apartamento_id: apartamento_id !== undefined ? apartamento_id : item.apartamento_id,
    nome: nome !== undefined ? nome.trim() : item.nome,
    quantidade: quantidade !== undefined ? quantidade : item.quantidade,
    status_item: status_item !== undefined ? status_item : item.status_item,
    observacao: observacao !== undefined ? observacao : item.observacao,
    updated_by: usuarioLogado?.id || null
  });

  await HistoricoMovimentacao.create({
    usuario_id: usuarioLogado?.id || null,
    modulo: "ITENS_OPERACIONAIS",
    acao: "EDITAR",
    tabela_referenciada: "itens_operacionais",
    registro_id: item.id,
    descricao: `Item operacional atualizado: ${item.nome}`
  });

  return item;
}

async function alterarStatusItem(id, dados, usuarioLogado) {
  const item = await buscarItemPorId(id);

  const { status_item, observacao } = dados;

  if (!status_item) {
    throw new Error("O status do item é obrigatório.");
  }

  const statusPermitidos = ["BOM", "ATENCAO", "PROBLEMA", "EM_FALTA"];

  if (!statusPermitidos.includes(status_item)) {
    throw new Error("Status do item inválido.");
  }

  await item.update({
    status_item,
    observacao: observacao !== undefined ? observacao : item.observacao,
    updated_by: usuarioLogado?.id || null
  });

  await HistoricoMovimentacao.create({
    usuario_id: usuarioLogado?.id || null,
    modulo: "ITENS_OPERACIONAIS",
    acao: "ALTERAR_STATUS",
    tabela_referenciada: "itens_operacionais",
    registro_id: item.id,
    descricao: `Status do item "${item.nome}" alterado para ${status_item}`
  });

  return item;
}
async function atualizarImagemItem(id, caminhoImagem, usuarioLogado) {
  const item = await buscarItemPorId(id);

  await item.update({
    imagem: caminhoImagem,
    updated_by: usuarioLogado?.id || null
  });

  await HistoricoMovimentacao.create({
    usuario_id: usuarioLogado?.id || null,
    modulo: "ITENS_OPERACIONAIS",
    acao: "UPLOAD_IMAGEM",
    tabela_referenciada: "itens_operacionais",
    registro_id: item.id,
    descricao: `Imagem atualizada do item operacional: ${item.nome}`
  });

  return item;
}

module.exports = {
  listarItens,
  buscarItemPorId,
  criarItem,
  atualizarItem,
  alterarStatusItem,
  atualizarImagemItem
};