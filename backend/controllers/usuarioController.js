const usuarioService = require("../services/usuarioService");

async function listar(req, res) {
  try {
    const filtros = {};

    if (req.query.status !== undefined) {
      filtros.status = req.query.status === "true";
    }

    if (req.query.perfil !== undefined) {
      filtros.perfil = req.query.perfil;
    }

    const usuarios = await usuarioService.listarUsuarios(filtros);

    return res.status(200).json(usuarios);
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message
    });
  }
}

async function buscarPorId(req, res) {
  try {
    const { id } = req.params;

    const usuario = await usuarioService.buscarUsuarioPorId(id);

    return res.status(200).json(usuario);
  } catch (error) {
    return res.status(404).json({
      mensagem: error.message
    });
  }
}

async function criar(req, res) {
  try {
    const usuario = await usuarioService.criarUsuario(req.body, req.usuario);

    return res.status(201).json({
      mensagem: "Usuário criado com sucesso.",
      usuario
    });
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message
    });
  }
}

async function atualizar(req, res) {
  try {
    const { id } = req.params;

    const usuario = await usuarioService.atualizarUsuario(
      id,
      req.body,
      req.usuario
    );

    return res.status(200).json({
      mensagem: "Usuário atualizado com sucesso.",
      usuario
    });
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message
    });
  }
}

async function inativar(req, res) {
  try {
    const { id } = req.params;

    const usuario = await usuarioService.inativarUsuario(id, req.usuario);

    return res.status(200).json({
      mensagem: "Usuário inativado com sucesso.",
      usuario
    });
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message
    });
  }
}

async function reativar(req, res) {
  try {
    const { id } = req.params;

    const usuario = await usuarioService.reativarUsuario(id, req.usuario);

    return res.status(200).json({
      mensagem: "Usuário reativado com sucesso.",
      usuario
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
  atualizar,
  inativar, 
  reativar
};