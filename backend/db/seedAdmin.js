const bcrypt = require("bcrypt");
const { Usuario } = require("../models");

async function seedAdmin() {
  const adminName = process.env.ADMIN_NAME || "Usuário ADM";
  const adminEmail = process.env.ADMIN_EMAIL || "admin@praiastur.com.br";
  const adminPassword = process.env.ADMIN_PASSWORD || "123456";

  const usuarioExistente = await Usuario.findOne({
    where: {
      email: adminEmail
    }
  });

  if (usuarioExistente) {
    console.log("Usuário administrador inicial já existe.");
    return;
  }

  const senhaCriptografada = await bcrypt.hash(adminPassword, 10);

  await Usuario.create({
    nome: adminName,
    email: adminEmail,
    senha: senhaCriptografada,
    perfil: "ADMINISTRADOR",
    status: true
  });

  console.log("Usuário administrador inicial criado com sucesso.");
  console.log(`E-mail: ${adminEmail}`);
  console.log(`Senha: ${adminPassword}`);
}

module.exports = seedAdmin;