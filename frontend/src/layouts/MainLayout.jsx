import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./MainLayout.css";
import logoSistema from "../assets/logo-sistema.png";

function MainLayout() {
  const navigate = useNavigate();

  const usuarioSalvo = localStorage.getItem("usuario");
  const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;

  const isAdmin = usuario?.perfil === "ADMINISTRADOR";

  function sair() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    navigate("/login");
  }

  return (
    <div className="main-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src={logoSistema} alt="Sistema Inventário" />
        </div>

        <nav className="sidebar-menu">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/produtos">Produtos</NavLink>
          <NavLink to="/entradas">Entradas</NavLink>
          <NavLink to="/saidas">Saídas</NavLink>
          <NavLink to="/residenciais">Residenciais</NavLink>
          <NavLink to="/apartamentos">Apartamentos</NavLink>
          <NavLink to="/itens-operacionais">Operacionais</NavLink>

          {isAdmin && <NavLink to="/usuarios">Usuários</NavLink>}
          {isAdmin && <NavLink to="/historicos">Histórico</NavLink>}
        </nav>
      </aside>

      <div className="content-area">
        <header className="topbar">
          <div>
            <strong>{usuario?.nome || "Usuário"}</strong>
            <span>{usuario?.perfil || ""}</span>
          </div>

          <button onClick={sair}>Sair</button>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;