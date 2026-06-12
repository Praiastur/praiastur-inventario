const express = require("express");
const saidaController = require("../controllers/saidaController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, saidaController.listar);

router.get("/:id/pdf", authMiddleware, saidaController.gerarPdf);

router.get("/:id", authMiddleware, saidaController.buscarPorId);

router.post("/", authMiddleware, saidaController.criar);

router.patch("/:id/cancelar", authMiddleware, saidaController.cancelar);

module.exports = router;