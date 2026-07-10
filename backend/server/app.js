const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const routes = require("../routes");

const app = express();

const port = process.env.port || 3000;

const client_url = process.env.client_url;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://192.168.0.21:5173",
  "http://192.168.0.21:3000",
  "https://inventario.praiastur.com",
  client_url
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "uploads"), {
    maxAge: "7d",
    etag: true,
    lastModified: true
  })
);

app.use("/api", routes);

const frontendPath = path.join(__dirname, "..", "..", "frontend", "dist");

app.use(express.static(frontendPath));

app.get("/health", (req, res) => {
  res.json({
    service: "inventario-api",
    status: "ok",
    time: new Date().toISOString()
  });
});

app.get(/^\/(?!api|uploads).*/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  console.log(`Acesse: http://localhost:${port}`);
});