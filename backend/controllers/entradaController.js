const entradaService = require("../services/entradaService");

async function listar(req, res) {
  try {
    const entradas = await entradaService.listarEntradas();

    return res.status(200).json(entradas);
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message
    });
  }
}

async function buscarPorId(req, res) {
  try {
    const { id } = req.params;

    const entrada = await entradaService.buscarEntradaPorId(id);

    return res.status(200).json(entrada);
  } catch (error) {
    return res.status(404).json({
      mensagem: error.message
    });
  }
}

async function criar(req, res) {
  try {
    const entrada = await entradaService.criarEntrada(req.body, req.usuario);

    return res.status(201).json({
      mensagem: "Entrada registrada com sucesso.",
      entrada
    });
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message
    });
  }
}

module.exports = {
  listar,
  buscarPorId,
  criar
};