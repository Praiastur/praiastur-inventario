const multer = require("multer");
const path = require("path");
const fs = require("fs");

function criarUpload(pasta) {
  const destino = path.join(__dirname, "..", "uploads", pasta);

  if (!fs.existsSync(destino)) {
    fs.mkdirSync(destino, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destino);
    },

    filename: (req, file, cb) => {
      const extensao = path.extname(file.originalname);
      const nomeArquivo = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extensao}`;

      cb(null, nomeArquivo);
    }
  });

  const fileFilter = (req, file, cb) => {
    const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];

    if (tiposPermitidos.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Formato inválido. Envie apenas JPG, PNG ou WEBP."));
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024
    }
  });
}

module.exports = criarUpload;