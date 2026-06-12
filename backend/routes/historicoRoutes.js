const express = require("express");
const historicoController = require("../controllers/historicoController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, historicoController.listar);

router.get("/:id", authMiddleware, adminMiddleware, historicoController.buscarPorId);

module.exports = router;