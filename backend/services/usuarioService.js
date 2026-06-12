const bcrypt = require("bcrypt");
const { Usuario, HistoricoMovimentacao } = require("../models");

async function listarUsuarios(filtros = {}) {
  const where = {};

  if (filtros.status !== undefined) {
    where.status = filtros.status;
  }

  if (filtros.perfil !== undefined) {
    where.perfil = filtros.perfil;
  }

  const usuarios = await Usuario.findAll({
    where,
    attributes: ["id", "nome", "email", "perfil", "status", "created_at", "updated_at"],
    order: [["nome", "ASC"]]
  });

  return usuarios;
}

async function buscarUsuarioPorId(id) {
  const usuario = await Usuario.findByPk(id, {
    attributes: ["id", "nome", "email", "perfil", "status", "created_at", "updated_at"]
  });

  if (!usuario) {
    throw new Error("Usuário não encontrado.");
  }

  return usuario;
}

async function criarUsuario(dados, usuarioLogado) {
  const { nome, email, senha, perfil, status } = dados;

  if (!nome || nome.trim() === "") {
    throw new Error("O nome do usuário é obrigatório.");
  }

  if (!email || email.trim() === "") {
    throw new Error("O e-mail do usuário é obrigatório.");
  }

  if (!senha || senha.trim() === "") {
    throw new Error("A senha do usuário é obrigatória.");
  }

  const perfisPermitidos = ["ADMINISTRADOR", "OPERACIONAL"];

  if (!perfil || !perfisPermitidos.includes(perfil)) {
    throw new Error("Perfil inválido.");
  }

  const usuarioExistente = await Usuario.findOne({
    where: {
      email: email.trim()
    }
  });

  if (usuarioExistente) {
    throw new Error("Já existe um usuário com esse e-mail.");
  }

  const senhaCriptografada = await bcrypt.hash(senha, 10);

  const usuario = await Usuario.create({
    nome: nome.trim(),
    email: email.trim(),
    senha: senhaCriptografada,
    perfil,
    status: status !== undefined ? status : true
  });

  await HistoricoMovimentacao.create({
    usuario_id: usuarioLogado?.id || null,
    modulo: "USUARIOS",
    acao: "CRIAR",
    tabela_referenciada: "usuarios",
    registro_id: usuario.id,
    descricao: `Usuário criado: ${usuario.nome}`
  });

  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    perfil: usuario.perfil,
    status: usuario.status,
    created_at: usuario.created_at,
    updated_at: usuario.updated_at
  };
}

async function atualizarUsuario(id, dados, usuarioLogado) {
  const usuario = await Usuario.findByPk(id);

  if (!usuario) {
    throw new Error("Usuário não encontrado.");
  }

  const { nome, email, senha, perfil, status } = dados;

  if (nome !== undefined && nome.trim() === "") {
    throw new Error("O nome do usuário não pode ficar vazio.");
  }

  if (email !== undefined && email.trim() === "") {
    throw new Error("O e-mail do usuário não pode ficar vazio.");
  }

  const perfisPermitidos = ["ADMINISTRADOR", "OPERACIONAL"];

  if (perfil !== undefined && !perfisPermitidos.includes(perfil)) {
    throw new Error("Perfil inválido.");
  }

  if (email !== undefined) {
    const usuarioComMesmoEmail = await Usuario.findOne({
      where: {
        email: email.trim()
      }
    });

    if (usuarioComMesmoEmail && usuarioComMesmoEmail.id !== Number(id)) {
      throw new Error("Já existe outro usuário com esse e-mail.");
    }
  }

  let novaSenha = usuario.senha;

  if (senha !== undefined && senha.trim() !== "") {
    novaSenha = await bcrypt.hash(senha, 10);
  }

  await usuario.update({
    nome: nome !== undefined ? nome.trim() : usuario.nome,
    email: email !== undefined ? email.trim() : usuario.email,
    senha: novaSenha,
    perfil: perfil !== undefined ? perfil : usuario.perfil,
    status: status !== undefined ? status : usuario.status
  });

  await HistoricoMovimentacao.create({
    usuario_id: usuarioLogado?.id || null,
    modulo: "USUARIOS",
    acao: "EDITAR",
    tabela_referenciada: "usuarios",
    registro_id: usuario.id,
    descricao: `Usuário atualizado: ${usuario.nome}`
  });

  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    perfil: usuario.perfil,
    status: usuario.status,
    created_at: usuario.created_at,
    updated_at: usuario.updated_at
  };
}

async function inativarUsuario(id, usuarioLogado) {
  const usuario = await Usuario.findByPk(id);

  if (!usuario) {
    throw new Error("Usuário não encontrado.");
  }

  if (usuarioLogado?.id === Number(id)) {
    throw new Error("Você não pode inativar o próprio usuário logado.");
  }

  await usuario.update({
    status: false
  });

  await HistoricoMovimentacao.create({
    usuario_id: usuarioLogado?.id || null,
    modulo: "USUARIOS",
    acao: "INATIVAR",
    tabela_referenciada: "usuarios",
    registro_id: usuario.id,
    descricao: `Usuário inativado: ${usuario.nome}`
  });

  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    perfil: usuario.perfil,
    status: usuario.status,
    created_at: usuario.created_at,
    updated_at: usuario.updated_at
  };
}

async function reativarUsuario(id, usuarioLogado) {
  const usuario = await Usuario.findByPk(id);

  if (!usuario) {
    throw new Error("Usuário não encontrado.");
  }

  await usuario.update({
    status: true
  });

  await HistoricoMovimentacao.create({
    usuario_id: usuarioLogado?.id || null,
    modulo: "USUARIOS",
    acao: "REATIVAR",
    tabela_referenciada: "usuarios",
    registro_id: usuario.id,
    descricao: `Usuário reativado: ${usuario.nome}`
  });

  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    perfil: usuario.perfil,
    status: usuario.status,
    created_at: usuario.created_at,
    updated_at: usuario.updated_at
  };
}

module.exports = {
  listarUsuarios,
  buscarUsuarioPorId,
  criarUsuario,
  atualizarUsuario,
  inativarUsuario,
  reativarUsuario
};