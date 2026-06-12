function adminMiddleware(req, res, next) {
  if (!req.usuario) {
    return res.status(401).json({
      mensagem: "Usuário não autenticado."
    });
  }

  if (req.usuario.perfil !== "ADMINISTRADOR") {
    return res.status(403).json({
      mensagem: "Acesso permitido apenas para administradores."
    });
  }

  return next();
}

module.exports = adminMiddleware;