const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      mensagem: "Token não informado."
    });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    return res.status(401).json({
      mensagem: "Token inválido."
    });
  }

  const [scheme, token] = parts;

  if (scheme !== "Bearer") {
    return res.status(401).json({
      mensagem: "Formato do token inválido."
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.jwt_secret);

    req.usuario = decoded;

    return next();
  } catch (error) {
    return res.status(401).json({
      mensagem: "Token inválido ou expirado."
    });
  }
}

module.exports = authMiddleware;