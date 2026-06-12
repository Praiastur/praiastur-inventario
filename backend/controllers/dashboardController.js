const dashboardService = require("../services/dashboardService");

async function resumoGeral(req, res) {
  try {
    const resumo = await dashboardService.obterResumoGeral();

    return res.status(200).json(resumo);
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message
    });
  }
}

async function produtosEstoqueBaixo(req, res) {
  try {
    const produtos = await dashboardService.listarProdutosEstoqueBaixo();

    return res.status(200).json(produtos);
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message
    });
  }
}

async function itensComProblema(req, res) {
  try {
    const itens = await dashboardService.listarItensComProblema();

    return res.status(200).json(itens);
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message
    });
  }
}

module.exports = {
  resumoGeral,
  produtosEstoqueBaixo,
  itensComProblema
};