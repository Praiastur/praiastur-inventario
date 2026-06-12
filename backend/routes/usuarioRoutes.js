const express = require("express");
const usuarioController = require("../controllers/usuarioController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, usuarioController.listar);

router.get("/:id", authMiddleware, adminMiddleware, usuarioController.buscarPorId);

router.post("/", authMiddleware, adminMiddleware, usuarioController.criar);

router.put("/:id", authMiddleware, adminMiddleware, usuarioController.atualizar);

router.patch("/:id/inativar", authMiddleware, adminMiddleware, usuarioController.inativar);

router.patch("/:id/reativar", authMiddleware, adminMiddleware, usuarioController.reativar);

module.exports = router;