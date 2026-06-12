const saidaService = require("../services/saidaService");
const pdfService = require("../services/pdfService");

async function listar(req, res) {
  try {
    const saidas = await saidaService.listarSaidas();

    return res.status(200).json(saidas);
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message
    });
  }
}

async function buscarPorId(req, res) {
  try {
    const { id } = req.params;

    const saida = await saidaService.buscarSaidaPorId(id);

    return res.status(200).json(saida);
  } catch (error) {
    return res.status(404).json({
      mensagem: error.message
    });
  }
}

async function criar(req, res) {
  try {
    const saida = await saidaService.criarSaida(req.body, req.usuario);

    return res.status(201).json({
      mensagem: "Saída registrada com sucesso.",
      saida
    });
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message
    });
  }
}

async function gerarPdf(req, res) {
  try {
    const { id } = req.params;

    await pdfService.gerarPdfSaida(id, res);
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message
    });
  }
}

async function cancelar(req, res) {
  try {
    const { id } = req.params;

    const saida = await saidaService.cancelarSaida(id, req.usuario);

    return res.status(200).json({
      mensagem: "Saída cancelada com sucesso.",
      saida
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
  criar,
  gerarPdf,
  cancelar
};