import { useEffect, useState } from "react";
import api from "../../api/api";
import "./Entradas.css";

function Entradas() {
  const [entradas, setEntradas] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [modalAberto, setModalAberto] = useState(false);

  const [form, setForm] = useState({
    produto_id: "",
    quantidade: "",
    observacao: ""
  });

  async function carregarDados() {
    try {
      setCarregando(true);
      setErro("");

      const [resEntradas, resProdutos] = await Promise.all([
        api.get("/entradas"),
        api.get("/produtos?status=true")
      ]);

      setEntradas(resEntradas.data);
      setProdutos(resProdutos.data);
    } catch (error) {
      setErro(error.response?.data?.mensagem || "Erro ao carregar entradas.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  function abrirModal() {
    setForm({
      produto_id: "",
      quantidade: "",
      observacao: ""
    });

    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
  }

  function atualizarCampo(event) {
    const { name, value } = event.target;

    setForm((dadosAtuais) => ({
      ...dadosAtuais,
      [name]: value
    }));
  }

  async function salvarEntrada(event) {
    event.preventDefault();

    try {
      await api.post("/entradas", {
        produto_id: Number(form.produto_id),
        quantidade: Number(form.quantidade),
        observacao: form.observacao
      });

      fecharModal();
      carregarDados();
    } catch (error) {
      alert(error.response?.data?.mensagem || "Erro ao registrar entrada.");
    }
  }

  function formatarData(data) {
    if (!data) return "-";

    return new Date(data).toLocaleString("pt-BR");
  }

  if (carregando) {
    return <div className="loading-box">Carregando entradas...</div>;
  }

  if (erro) {
    return <div className="error-box">{erro}</div>;
  }

  return (
    <div>
      <div className="page-header entradas-header">
        <div>
          <h1>Entradas Administrativas</h1>
          <p>Registre entradas de materiais e atualize o estoque automaticamente.</p>
        </div>

        <button className="primary-button" onClick={abrirModal}>
          Nova entrada
        </button>
      </div>

      <div className="table-card">
        {entradas.length === 0 ? (
          <div className="empty-box">Nenhuma entrada registrada.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Quantidade</th>
                <th>Observação</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {entradas.map((entrada) => (
                <tr key={entrada.id}>
                  <td>
                    <strong>{entrada.produto?.nome || "-"}</strong>
                  </td>

                  <td>
                    <span className="badge success">
                      +{entrada.quantidade}
                    </span>
                  </td>

                  <td>{entrada.observacao || "-"}</td>

                  <td>{formatarData(entrada.created_at)}</td>
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
              <h2>Nova entrada</h2>
              <button onClick={fecharModal}>X</button>
            </div>

            <form onSubmit={salvarEntrada} className="form-grid">
              <label className="full">
                Produto
                <select
                  name="produto_id"
                  value={form.produto_id}
                  onChange={atualizarCampo}
                >
                  <option value="">Selecione um produto</option>

                  {produtos.map((produto) => (
                    <option key={produto.id} value={produto.id}>
                      {produto.nome} — estoque atual: {produto.quantidade_atual}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Quantidade
                <input
                  name="quantidade"
                  type="number"
                  min="1"
                  value={form.quantidade}
                  onChange={atualizarCampo}
                  placeholder="Ex: 500"
                />
              </label>

              <label className="full">
                Observação
                <textarea
                  name="observacao"
                  value={form.observacao}
                  onChange={atualizarCampo}
                  placeholder="Ex: Entrada de novos cupons para eventos"
                />
              </label>

              <div className="modal-actions">
                <button type="button" onClick={fecharModal}>
                  Cancelar
                </button>

                <button type="submit" className="primary-button">
                  Salvar entrada
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Entradas;