import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const usuarioSalvo = localStorage.getItem("usuario");
  const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;

  if (usuario?.perfil !== "ADMINISTRADOR") {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export default AdminRoute;