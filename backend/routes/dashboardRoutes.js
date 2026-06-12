const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/resumo", authMiddleware, dashboardController.resumoGeral);

router.get(
  "/produtos-estoque-baixo",
  authMiddleware,
  dashboardController.produtosEstoqueBaixo
);

router.get(
  "/itens-com-problema",
  authMiddleware,
  dashboardController.itensComProblema
);

module.exports = router;