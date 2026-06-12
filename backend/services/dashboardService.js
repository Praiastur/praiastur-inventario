const {
  ProdutoAdministrativo,
  Residencial,
  Apartamento,
  ItemOperacional,
  SaidaAdministrativa,
  EntradaAdministrativa
} = require("../models");

const { Op } = require("sequelize");

async function obterResumoGeral() {
  const totalProdutos = await ProdutoAdministrativo.count({
    where: {
      status: true
    }
  });

  const produtosEstoqueBaixo = await ProdutoAdministrativo.count({
    where: {
      status: true,
      quantidade_atual: {
        [Op.lte]: ProdutoAdministrativo.sequelize.col("estoque_minimo")
      }
    }
  });

  const totalResidenciais = await Residencial.count({
    where: {
      status: true
    }
  });

  const totalApartamentos = await Apartamento.count({
    where: {
      status: true
    }
  });

  const totalItensOperacionais = await ItemOperacional.count();

  const itensBom = await ItemOperacional.count({
    where: {
      status_item: "BOM"
    }
  });

  const itensAtencao = await ItemOperacional.count({
    where: {
      status_item: "ATENCAO"
    }
  });

  const itensProblema = await ItemOperacional.count({
    where: {
      status_item: "PROBLEMA"
    }
  });

  const itensEmFalta = await ItemOperacional.count({
    where: {
      status_item: "EM_FALTA"
    }
  });

  const totalEntradas = await EntradaAdministrativa.count();

  const totalSaidas = await SaidaAdministrativa.count({
    where: {
      status: "FINALIZADA"
    }
  });

  return {
    administrativo: {
      total_produtos: totalProdutos,
      produtos_estoque_baixo: produtosEstoqueBaixo,
      total_entradas: totalEntradas,
      total_saidas: totalSaidas
    },
    operacional: {
      total_residenciais: totalResidenciais,
      total_apartamentos: totalApartamentos,
      total_itens: totalItensOperacionais,
      itens_bom: itensBom,
      itens_atencao: itensAtencao,
      itens_problema: itensProblema,
      itens_em_falta: itensEmFalta
    }
  };
}

async function listarProdutosEstoqueBaixo() {
  const produtos = await ProdutoAdministrativo.findAll({
    where: {
      status: true,
      quantidade_atual: {
        [Op.lte]: ProdutoAdministrativo.sequelize.col("estoque_minimo")
      }
    },
    order: [["quantidade_atual", "ASC"]]
  });

  return produtos;
}

async function listarItensComProblema() {
  const itens = await ItemOperacional.findAll({
    where: {
      status_item: {
        [Op.in]: ["ATENCAO", "PROBLEMA", "EM_FALTA"]
      }
    },
    order: [["status_item", "ASC"], ["nome", "ASC"]]
  });

  return itens;
}

module.exports = {
  obterResumoGeral,
  listarProdutosEstoqueBaixo,
  listarItensComProblema
};