import { useEffect, useState } from "react";
import api from "../../api/api";
import "./Historicos.css";

function Historicos() {
  const [historicos, setHistoricos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [filtroModulo, setFiltroModulo] = useState("");
  const [filtroAcao, setFiltroAcao] = useState("");

  async function carregarHistoricos() {
    try {
      setCarregando(true);
      setErro("");

      const params = new URLSearchParams();

      if (filtroModulo) {
        params.append("modulo", filtroModulo);
      }

      if (filtroAcao) {
        params.append("acao", filtroAcao);
      }

      const query = params.toString() ? `?${params.toString()}` : "";

      const resposta = await api.get(`/historicos${query}`);

      setHistoricos(resposta.data);
    } catch (error) {
      setErro(error.response?.data?.mensagem || "Erro ao carregar histórico.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarHistoricos();
  }, [filtroModulo, filtroAcao]);

  function formatarData(data) {
    if (!data) return "-";

    return new Date(data).toLocaleString("pt-BR");
  }

  function nomeModulo(modulo) {
    const modulos = {
      PRODUTOS: "Produtos",
      ENTRADAS: "Entradas",
      SAIDAS: "Saídas",
      RESIDENCIAIS: "Residenciais",
      APARTAMENTOS: "Apartamentos",
      ITENS_OPERACIONAIS: "Itens Operacionais",
      USUARIOS: "Usuários"
    };

    return modulos[modulo] || modulo;
  }

 function nomeAcao(acao) {
  const acoes = {
    CRIAR: "Criar",
    EDITAR: "Editar",
    INATIVAR: "Inativar",
    REATIVAR: "Reativar",
    CANCELAR: "Cancelar",
    ALTERAR_STATUS: "Alterar status",
    UPLOAD_IMAGEM: "Upload de imagem"
  };

  return acoes[acao] || acao;
}

  function classeAcao(acao) {
    if (acao === "CRIAR") return "success";
    if (acao === "EDITAR") return "admin";
    if (acao === "INATIVAR") return "danger";
    if (acao === "REATIVAR") return "success";
    if (acao === "ALTERAR_STATUS") return "warning";
    if (acao === "UPLOAD_IMAGEM") return "muted";

    return "muted";
  }

  if (carregando) {
    return <div className="loading-box">Carregando histórico...</div>;
  }

  if (erro) {
    return <div className="error-box">{erro}</div>;
  }

  return (
    <div>
      <div className="page-header historicos-header">
        <div>
          <h1>Histórico</h1>
          <p>Consulte as principais ações registradas no sistema.</p>
        </div>
      </div>

      <div className="filters-card historicos-filters">
        <label>
          Filtrar por módulo
          <select
            value={filtroModulo}
            onChange={(event) => setFiltroModulo(event.target.value)}
          >
            <option value="">Todos os módulos</option>
            <option value="PRODUTOS">Produtos</option>
            <option value="ENTRADAS">Entradas</option>
            <option value="SAIDAS">Saídas</option>
            <option value="RESIDENCIAIS">Residenciais</option>
            <option value="APARTAMENTOS">Apartamentos</option>
            <option value="ITENS_OPERACIONAIS">Itens Operacionais</option>
            <option value="USUARIOS">Usuários</option>
          </select>
        </label>

        <label>
          Filtrar por ação
          <select
            value={filtroAcao}
            onChange={(event) => setFiltroAcao(event.target.value)}
          >
            <option value="">Todas as ações</option>
            <option value="CRIAR">Criar</option>
            <option value="EDITAR">Editar</option>
            <option value="INATIVAR">Inativar</option>
            <option value="REATIVAR">Reativar</option>
            <option value="CANCELAR">Cancelar</option>
            <option value="ALTERAR_STATUS">Alterar status</option>
            <option value="UPLOAD_IMAGEM">Upload de imagem</option>
          </select>
        </label>
      </div>

      <div className="table-card">
        {historicos.length === 0 ? (
          <div className="empty-box">Nenhum histórico encontrado.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Módulo</th>
                <th>Ação</th>
                <th>Descrição</th>
                <th>Usuário</th>
                <th>Tabela</th>
              </tr>
            </thead>

            <tbody>
              {historicos.map((historico) => (
                <tr key={historico.id}>
                  <td>{formatarData(historico.created_at)}</td>

                  <td>
                    <strong>{nomeModulo(historico.modulo)}</strong>
                  </td>

                  <td>
                    <span className={`badge ${classeAcao(historico.acao)}`}>
                      {nomeAcao(historico.acao)}
                    </span>
                  </td>

                  <td>{historico.descricao || "-"}</td>

                  <td>
                    {historico.usuario ? (
                      <>
                        <strong>{historico.usuario.nome}</strong>
                        <br />
                        <small>{historico.usuario.email}</small>
                      </>
                    ) : (
                      "Sistema"
                    )}
                  </td>

                  <td>
                    <small>{historico.tabela_referenciada || "-"}</small>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Historicos;