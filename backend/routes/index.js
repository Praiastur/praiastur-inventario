const express = require("express");
const authRoutes = require("./authRoutes");
const produtoRoutes = require("./produtoRoutes");
const entradaRoutes = require("./entradaRoutes");
const saidaRoutes = require("./saidaRoutes");
const residencialRoutes = require("./residencialRoutes");
const apartamentoRoutes = require("./apartamentoRoutes");
const itemOperacionalRoutes = require("./itemOperacionalRoutes");
const usuarioRoutes = require("./usuarioRoutes");
const historicoRoutes = require("./historicoRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", (req, res) => {
  return res.json({
    mensagem: "Rotas da API funcionando."
  });
});

router.get("/health", (req, res) => {
  return res.json({
    status: "ok",
    sistema: "Praiastur Inventário",
    data: new Date()
  });
});

router.get("/me", authMiddleware, (req, res) => {
  return res.json({
    mensagem: "Usuário autenticado.",
    usuario: req.usuario
  });
});

router.use("/auth", authRoutes);
router.use("/produtos", produtoRoutes);
router.use("/entradas", entradaRoutes);
router.use("/saidas", saidaRoutes);
router.use("/residenciais", residencialRoutes);
router.use("/apartamentos", apartamentoRoutes);
router.use("/itens-operacionais", itemOperacionalRoutes);
router.use("/usuarios", usuarioRoutes);
router.use("/historicos", historicoRoutes);
router.use("/dashboard", dashboardRoutes);

module.exports = router;