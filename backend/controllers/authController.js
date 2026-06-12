const authService = require("../services/authService");

async function login(req, res) {
  try {
    const { email, senha } = req.body;

    const resultado = await authService.login(email, senha);

    return res.status(200).json({
      mensagem: "Login realizado com sucesso.",
      token: resultado.token,
      usuario: resultado.usuario
    });
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message
    });
  }
}

module.exports = {
  login
};