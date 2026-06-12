import { useEffect, useState } from "react";
import api from "../../api/api";
import "./ItensOperacionais.css";

function ItensOperacionais() {
  const [itens, setItens] = useState([]);
  const [apartamentos, setApartamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [modalAberto, setModalAberto] = useState(false);
  const [itemEditando, setItemEditando] = useState(null);

  const [filtroApartamento, setFiltroApartamento] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");

  const [form, setForm] = useState({
    apartamento_id: "",
    nome: "",
    quantidade: "",
    status_item: "BOM",
    observacao: ""
  });

  async function carregarDados() {
    try {
      setCarregando(true);
      setErro("");

      const params = new URLSearchParams();

      if (filtroApartamento) {
        params.append("apartamento_id", filtroApartamento);
      }

      if (filtroStatus) {
        params.append("status_item", filtroStatus);
      }

      const query = params.toString() ? `?${params.toString()}` : "";

      const [resItens, resApartamentos] = await Promise.all([
        api.get(`/itens-operacionais${query}`),
        api.get("/apartamentos?status=true")
      ]);

      setItens(resItens.data);
      setApartamentos(resApartamentos.data);
    } catch (error) {
      setErro(error.response?.data?.mensagem || "Erro ao carregar itens operacionais.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, [filtroApartamento, filtroStatus]);

  function abrirModalNovo() {
    setItemEditando(null);

    setForm({
      apartamento_id: filtroApartamento || "",
      nome: "",
      quantidade: "",
      status_item: "BOM",
      observacao: ""
    });

    setModalAberto(true);
  }

  function abrirModalEditar(item) {
    setItemEditando(item);

    setForm({
      apartamento_id: item.apartamento_id || "",
      nome: item.nome || "",
      quantidade: item.quantidade || 0,
      status_item: item.status_item || "BOM",
      observacao: item.observacao || ""
    });

    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setItemEditando(null);
  }

  function atualizarCampo(event) {
    const { name, value } = event.target;

    setForm((dadosAtuais) => ({
      ...dadosAtuais,
      [name]: value
    }));
  }

  async function salvarItem(event) {
    event.preventDefault();

    try {
      const dados = {
        apartamento_id: Number(form.apartamento_id),
        nome: form.nome,
        quantidade: Number(form.quantidade),
        status_item: form.status_item,
        observacao: form.observacao
      };

      if (itemEditando) {
        await api.put(`/itens-operacionais/${itemEditando.id}`, dados);
      } else {
        await api.post("/itens-operacionais", dados);
      }

      fecharModal();
      carregarDados();
    } catch (error) {
      alert(error.response?.data?.mensagem || "Erro ao salvar item operacional.");
    }
  }

  async function alterarStatusRapido(itemId, novoStatus) {
    try {
      await api.patch(`/itens-operacionais/${itemId}/status`, {
        status_item: novoStatus
      });

      carregarDados();
    } catch (error) {
      alert(error.response?.data?.mensagem || "Erro ao alterar status do item.");
    }
  }

  function nomeStatus(status) {
    const nomes = {
      BOM: "Bom",
      ATENCAO: "Atenção",
      PROBLEMA: "Problema",
      EM_FALTA: "Em falta"
    };

    return nomes[status] || status;
  }

  function classeStatus(status) {
    if (status === "BOM") return "success";
    if (status === "ATENCAO") return "warning";
    if (status === "PROBLEMA") return "danger";
    if (status === "EM_FALTA") return "muted";

    return "muted";
  }

  if (carregando) {
    return <div className="loading-box">Carregando itens operacionais...</div>;
  }

  if (erro) {
    return <div className="error-box">{erro}</div>;
  }

  async function enviarImagem(event, itemId) {
    const arquivo = event.target.files[0];

    if (!arquivo) return;

    const formData = new FormData();
    formData.append("imagem", arquivo);

    try {
      await api.patch(`/itens-operacionais/${itemId}/imagem`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      carregarDados();
    } catch (error) {
      alert(error.response?.data?.mensagem || "Erro ao enviar imagem.");
    }
  }

  function montarUrlImagem(caminho) {
    if (!caminho) return null;

    return `http://localhost:3000${caminho}`;
  }
  return (
    <div>
      <div className="page-header itens-header">
        <div>
          <h1>Itens Operacionais</h1>
          <p>Controle os itens físicos dos apartamentos, casas, depósitos e residenciais.</p>
        </div>

        <button className="primary-button" onClick={abrirModalNovo}>
          Novo item
        </button>
      </div>

      <div className="filters-card itens-filters">
        <label>
          Filtrar por apartamento/espaço
          <select
            value={filtroApartamento}
            onChange={(event) => setFiltroApartamento(event.target.value)}
          >
            <option value="">Todos os apartamentos/espaços</option>

            {apartamentos.map((apartamento) => (
              <option key={apartamento.id} value={apartamento.id}>
                {apartamento.nome_numero}
                {apartamento.residencial
                  ? ` — ${apartamento.residencial.nome}`
                  : ""}
              </option>
            ))}
          </select>
        </label>

        <label>
          Filtrar por status
          <select
            value={filtroStatus}
            onChange={(event) => setFiltroStatus(event.target.value)}
          >
            <option value="">Todos os status</option>
            <option value="BOM">Bom</option>
            <option value="ATENCAO">Atenção</option>
            <option value="PROBLEMA">Problema</option>
            <option value="EM_FALTA">Em falta</option>
          </select>
        </label>
      </div>

      <div className="table-card">
        {itens.length === 0 ? (
          <div className="empty-box">Nenhum item operacional cadastrado.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Imagem</th>
                <th>Item</th>
                <th>Quantidade</th>
                <th>Status</th>
                <th>Apartamento / Espaço</th>
                <th>Observação</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {itens.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="mini-image-box">
                      {item.imagem ? (
                        <img
                          src={montarUrlImagem(item.imagem)}
                          alt={item.nome}
                        />
                      ) : (
                        <span>Sem imagem</span>
                      )}
                    </div>

                    <label className="mini-upload">
                      Alterar
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(event) => enviarImagem(event, item.id)}
                      />
                    </label>
                  </td>
                  <td>
                    <strong>{item.nome}</strong>
                  </td>

                  <td>{item.quantidade}</td>

                  <td>
                    <span className={`badge ${classeStatus(item.status_item)}`}>
                      {nomeStatus(item.status_item)}
                    </span>
                  </td>

                  <td>
                    {item.apartamento ? (
                      <>
                        <strong>{item.apartamento.nome_numero}</strong>
                        <br />
                        <small>
                          {item.apartamento.residencial?.nome || "-"}
                        </small>
                      </>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td>{item.observacao || "-"}</td>

                  <td>
                    <div className="actions">
                      <button onClick={() => abrirModalEditar(item)}>
                        Editar
                      </button>

                      <select
                        className="status-select"
                        value={item.status_item}
                        onChange={(event) =>
                          alterarStatusRapido(item.id, event.target.value)
                        }
                      >
                        <option value="BOM">Bom</option>
                        <option value="ATENCAO">Atenção</option>
                        <option value="PROBLEMA">Problema</option>
                        <option value="EM_FALTA">Em falta</option>
                      </select>
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
              <h2>{itemEditando ? "Editar item" : "Novo item operacional"}</h2>

              <button onClick={fecharModal}>X</button>
            </div>

            <form onSubmit={salvarItem} className="form-grid">
              <label className="full">
                Apartamento / Espaço
                <select
                  name="apartamento_id"
                  value={form.apartamento_id}
                  onChange={atualizarCampo}
                >
                  <option value="">Selecione um apartamento/espaço</option>

                  {apartamentos.map((apartamento) => (
                    <option key={apartamento.id} value={apartamento.id}>
                      {apartamento.nome_numero}
                      {apartamento.residencial
                        ? ` — ${apartamento.residencial.nome}`
                        : ""}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Nome do item
                <input
                  name="nome"
                  value={form.nome}
                  onChange={atualizarCampo}
                  placeholder="Ex: TV 42 polegadas"
                />
              </label>

              <label>
                Quantidade
                <input
                  name="quantidade"
                  type="number"
                  min="0"
                  value={form.quantidade}
                  onChange={atualizarCampo}
                  placeholder="Ex: 1"
                />
              </label>

              <label>
                Status
                <select
                  name="status_item"
                  value={form.status_item}
                  onChange={atualizarCampo}
                >
                  <option value="BOM">Bom</option>
                  <option value="ATENCAO">Atenção</option>
                  <option value="PROBLEMA">Problema</option>
                  <option value="EM_FALTA">Em falta</option>
                </select>
              </label>

              <label className="full">
                Observação
                <textarea
                  name="observacao"
                  value={form.observacao}
                  onChange={atualizarCampo}
                  placeholder="Ex: Controle com pilha fraca, toalhas manchadas..."
                />
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

export default ItensOperacionais;