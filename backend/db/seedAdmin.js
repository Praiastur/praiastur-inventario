const bcrypt = require("bcrypt");
const { Usuario } = require("../models");

async function seedAdmin() {
  const admin_name = process.env.admin_name || "Usuário ADM";
  const admin_email = process.env.admin_email || "admin@praiastur.com.br";
  const admin_password = process.env.admin_password || "123456";

  const usuario_existente = await Usuario.findOne({
    where: {
      email: admin_email
    }
  });

  if (usuario_existente) {
    console.log("Usuário administrador inicial já existe.");
    return;
  }

  const senha_criptografada = await bcrypt.hash(admin_password, 10);

  await Usuario.create({
    nome: admin_name,
    email: admin_email,
    senha: senha_criptografada,
    perfil: "ADMINISTRADOR",
    status: true
  });

  console.log("Usuário administrador inicial criado com sucesso.");
  console.log(`E-mail: ${admin_email}`);
  console.log(`Senha: ${admin_password}`);
}

module.exports = seedAdmin;