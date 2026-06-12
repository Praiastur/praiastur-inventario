const express = require("express");
const apartamentoController = require("../controllers/apartamentoController");
const authMiddleware = require("../middlewares/authMiddleware");
const criarUpload = require("../middlewares/uploadMiddleware");

const uploadApartamento = criarUpload("apartamentos");

const router = express.Router();

router.get("/", authMiddleware, apartamentoController.listar);

router.get("/:id", authMiddleware, apartamentoController.buscarPorId);

router.post("/", authMiddleware, apartamentoController.criar);

router.put("/:id", authMiddleware, apartamentoController.atualizar);

router.patch("/:id/inativar", authMiddleware, apartamentoController.inativar);

router.patch("/:id/reativar", authMiddleware, apartamentoController.reativar);

router.patch(
  "/:id/imagem",
  authMiddleware,
  uploadApartamento.single("imagem"),
  apartamentoController.uploadImagem
);

module.exports = router;