const express = require("express");
const cors = require("cors");
require("dotenv").config();

const routes = require("../routes");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api", routes);

app.get("/", (req, res) => {
  return res.json({
    mensagem: "API do Praiastur Inventário está funcionando."
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});