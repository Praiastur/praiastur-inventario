const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Usuario } = require("../models");

async function login(email, senha) {
  if (!email || !senha) {
    throw new Error("E-mail e senha são obrigatórios.");
  }

  const usuario = await Usuario.findOne({
    where: { email }
  });

  if (!usuario) {
    throw new Error("E-mail ou senha inválidos.");
  }

  if (!usuario.status) {
    throw new Error("Usuário inativo. Procure o administrador.");
  }

  const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

  if (!senhaCorreta) {
    throw new Error("E-mail ou senha inválidos.");
  }

  const token = jwt.sign(
    {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d"
    }
  );

  return {
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil,
      status: usuario.status
    }
  };
}

module.exports = {
  login
};