import { useEffect, useState } from "react";
import api from "../../api/api";
import "./Usuarios.css";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [modalAberto, setModalAberto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    perfil: "OPERACIONAL",
    status: true
  });

  async function carregarUsuarios() {
    try {
      setCarregando(true);
      setErro("");

      const resposta = await api.get("/usuarios");

      setUsuarios(resposta.data);
    } catch (error) {
      setErro(error.response?.data?.mensagem || "Erro ao carregar usuários.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarUsuarios();
  }, []);

  function abrirModalNovo() {
    setUsuarioEditando(null);

    setForm({
      nome: "",
      email: "",
      senha: "",
      perfil: "OPERACIONAL",
      status: true
    });

    setModalAberto(true);
  }

  function abrirModalEditar(usuario) {
    setUsuarioEditando(usuario);

    setForm({
      nome: usuario.nome || "",
      email: usuario.email || "",
      senha: "",
      perfil: usuario.perfil || "OPERACIONAL",
      status: usuario.status
    });

    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setUsuarioEditando(null);
  }

  function atualizarCampo(event) {
    const { name, value, type, checked } = event.target;

    setForm((dadosAtuais) => ({
      ...dadosAtuais,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  async function salvarUsuario(event) {
    event.preventDefault();

    if (!form.nome.trim()) {
      alert("Informe o nome do usuário.");
      return;
    }

    if (!form.email.trim()) {
      alert("Informe o e-mail do usuário.");
      return;
    }

    if (!usuarioEditando && !form.senha.trim()) {
      alert("Informe a senha inicial do usuário.");
      return;
    }

    if (!form.perfil) {
      alert("Selecione o perfil do usuário.");
      return;
    }

    try {
      const dados = {
        nome: form.nome.trim(),
        email: form.email.trim(),
        perfil: form.perfil,
        status: form.status
      };

      if (form.senha.trim() !== "") {
        dados.senha = form.senha;
      }

      if (!usuarioEditando) {
        dados.senha = form.senha;
      }

      if (usuarioEditando) {
        await api.put(`/usuarios/${usuarioEditando.id}`, dados);
      } else {
        await api.post("/usuarios", dados);
      }

      fecharModal();
      carregarUsuarios();
    } catch (error) {
      alert(error.response?.data?.mensagem || "Erro ao salvar usuário.");
    }
  }
  async function inativarUsuario(id) {
    const confirmar = window.confirm("Tem certeza que deseja inativar este usuário?");

    if (!confirmar) return;

    try {
      await api.patch(`/usuarios/${id}/inativar`);
      carregarUsuarios();
    } catch (error) {
      alert(error.response?.data?.mensagem || "Erro ao inativar usuário.");
    }
  }

  async function reativarUsuario(id) {
    try {
      await api.patch(`/usuarios/${id}/reativar`);
      carregarUsuarios();
    } catch (error) {
      alert(error.response?.data?.mensagem || "Erro ao reativar usuário.");
    }
  }

  function formatarData(data) {
    if (!data) return "-";

    return new Date(data).toLocaleString("pt-BR");
  }

  if (carregando) {
    return <div className="loading-box">Carregando usuários...</div>;
  }

  if (erro) {
    return <div className="error-box">{erro}</div>;
  }

  return (
    <div>
      <div className="page-header usuarios-header">
        <div>
          <h1>Usuários</h1>
          <p>Gerencie os acessos dos funcionários ao sistema.</p>
        </div>

        <button className="primary-button" onClick={abrirModalNovo}>
          Novo usuário
        </button>
      </div>

      <div className="table-card">
        {usuarios.length === 0 ? (
          <div className="empty-box">Nenhum usuário cadastrado.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Perfil</th>
                <th>Status</th>
                <th>Criado em</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>
                    <strong>{usuario.nome}</strong>
                  </td>

                  <td>{usuario.email}</td>

                  <td>
                    {usuario.perfil === "ADMINISTRADOR" ? (
                      <span className="badge admin">Administrador</span>
                    ) : (
                      <span className="badge muted">Operacional</span>
                    )}
                  </td>

                  <td>
                    {usuario.status ? (
                      <span className="badge success">Ativo</span>
                    ) : (
                      <span className="badge muted">Inativo</span>
                    )}
                  </td>

                  <td>{formatarData(usuario.created_at)}</td>

                  <td>
                    <div className="actions">
                      <button onClick={() => abrirModalEditar(usuario)}>
                        Editar
                      </button>

                      {usuario.status ? (
                        <button
                          className="danger-button"
                          onClick={() => inativarUsuario(usuario.id)}
                        >
                          Inativar
                        </button>
                      ) : (
                        <button
                          className="success-button"
                          onClick={() => reativarUsuario(usuario.id)}
                        >
                          Reativar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h2>{usuarioEditando ? "Editar usuário" : "Novo usuário"}</h2>

              <button onClick={fecharModal}>X</button>
            </div>

            <form onSubmit={salvarUsuario} className="form-grid">
              <label>
                Nome
                <input
                  name="nome"
                  value={form.nome}
                  onChange={atualizarCampo}
                  placeholder="Nome do funcionário"
                />
              </label>

              <label>
                E-mail
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={atualizarCampo}
                  placeholder="email@praiastur.com.br"
                />
              </label>

              <label>
                Senha
                <input
                  name="senha"
                  type="password"
                  value={form.senha}
                  onChange={atualizarCampo}
                  placeholder={
                    usuarioEditando
                      ? "Deixe vazio para manter a senha"
                      : "Senha inicial"
                  }
                />
              </label>

              <label>
                Perfil
                <select
                  name="perfil"
                  value={form.perfil}
                  onChange={atualizarCampo}
                >
                  <option value="OPERACIONAL">Operacional</option>
                  <option value="ADMINISTRADOR">Administrador</option>
                </select>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="status"
                  checked={form.status}
                  onChange={atualizarCampo}
                />
                Usuário ativo
              </label>

              <div className="modal-actions">
                <button type="button" onClick={fecharModal}>
                  Cancelar
                </button>

                <button type="submit" className="primary-button">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Usuarios;