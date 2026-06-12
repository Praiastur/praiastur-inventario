const express = require("express");
const entradaController = require("../controllers/entradaController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, entradaController.listar);

router.get("/:id", authMiddleware, entradaController.buscarPorId);

router.post("/", authMiddleware, entradaController.criar);

module.exports = router;