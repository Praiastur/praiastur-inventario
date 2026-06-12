const historicoService = require("../services/historicoService");

async function listar(req, res) {
  try {
    const filtros = {};

    if (req.query.modulo !== undefined) {
      filtros.modulo = req.query.modulo;
    }

    if (req.query.acao !== undefined) {
      filtros.acao = req.query.acao;
    }

    if (req.query.usuario_id !== undefined) {
      filtros.usuario_id = req.query.usuario_id;
    }

    const historicos = await historicoService.listarHistoricos(filtros);

    return res.status(200).json(historicos);
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message
    });
  }
}

async function buscarPorId(req, res) {
  try {
    const { id } = req.params;

    const historico = await historicoService.buscarHistoricoPorId(id);

    return res.status(200).json(historico);
  } catch (error) {
    return res.status(404).json({
      mensagem: error.message
    });
  }
}

module.exports = {
  listar,
  buscarPorId
};