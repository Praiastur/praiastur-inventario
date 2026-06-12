import { useEffect, useState } from "react";
import api from "../../api/api";
import "./Saidas.css";

function Saidas() {
  const [saidas, setSaidas] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [modalAberto, setModalAberto] = useState(false);

  const [form, setForm] = useState({
    destinatario: "",
    observacao: "",
    itens: [
      {
        produto_id: "",
        quantidade: ""
      }
    ]
  });

  async function carregarDados() {
    try {
      setCarregando(true);
      setErro("");

      const [resSaidas, resProdutos] = await Promise.all([
        api.get("/saidas"),
        api.get("/produtos?status=true")
      ]);

      setSaidas(resSaidas.data);
      setProdutos(resProdutos.data);
    } catch (error) {
      setErro(error.response?.data?.mensagem || "Erro ao carregar saídas.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  function abrirModal() {
    setForm({
      destinatario: "",
      observacao: "",
      itens: [
        {
          produto_id: "",
          quantidade: ""
        }
      ]
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

  function atualizarItem(index, campo, valor) {
    setForm((dadosAtuais) => {
      const novosItens = [...dadosAtuais.itens];

      novosItens[index] = {
        ...novosItens[index],
        [campo]: valor
      };

      return {
        ...dadosAtuais,
        itens: novosItens
      };
    });
  }

  function adicionarItem() {
    setForm((dadosAtuais) => ({
      ...dadosAtuais,
      itens: [
        ...dadosAtuais.itens,
        {
          produto_id: "",
          quantidade: ""
        }
      ]
    }));
  }

  function removerItem(index) {
    setForm((dadosAtuais) => {
      if (dadosAtuais.itens.length === 1) {
        alert("A saída precisa ter pelo menos um produto.");
        return dadosAtuais;
      }

      const novosItens = dadosAtuais.itens.filter((_, i) => i !== index);

      return {
        ...dadosAtuais,
        itens: novosItens
      };
    });
  }

  async function salvarSaida(event) {
    event.preventDefault();

    try {
      const itensFormatados = form.itens.map((item) => ({
        produto_id: Number(item.produto_id),
        quantidade: Number(item.quantidade)
      }));

      await api.post("/saidas", {
        destinatario: form.destinatario,
        observacao: form.observacao,
        itens: itensFormatados
      });

      fecharModal();
      carregarDados();
    } catch (error) {
      alert(error.response?.data?.mensagem || "Erro ao registrar saída.");
    }
  }

  async function abrirPdf(saidaId) {
    try {
      const resposta = await api.get(`/saidas/${saidaId}/pdf`, {
        responseType: "blob"
      });

      const arquivo = new Blob([resposta.data], {
        type: "application/pdf"
      });

      const url = window.URL.createObjectURL(arquivo);

      window.open(url, "_blank");
    } catch (error) {
      alert(error.response?.data?.mensagem || "Erro ao abrir PDF.");
    }
  }

  async function cancelarSaida(id) {
    const confirmar = window.confirm(
      "Tem certeza que deseja cancelar esta saída? Os produtos serão devolvidos ao estoque."
    );

    if (!confirmar) return;

    try {
      await api.patch(`/saidas/${id}/cancelar`);
      carregarDados();
    } catch (error) {
      alert(error.response?.data?.mensagem || "Erro ao cancelar saída.");
    }
  }

  function formatarData(data) {
    if (!data) return "-";

    return new Date(data).toLocaleString("pt-BR");
  }

  if (carregando) {
    return <div className="loading-box">Carregando saídas...</div>;
  }

  if (erro) {
    return <div className="error-box">{erro}</div>;
  }

  return (
    <div>
      <div className="page-header saidas-header">
        <div>
          <h1>Saídas Administrativas</h1>
          <p>Registre retiradas de materiais e baixe o estoque automaticamente.</p>
        </div>

        <button className="primary-button" onClick={abrirModal}>
          Nova saída
        </button>
      </div>

      <div className="table-card">
        {saidas.length === 0 ? (
          <div className="empty-box">Nenhuma saída registrada.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Destinatário</th>
                <th>Produtos</th>
                <th>Status</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {saidas.map((saida) => (
                <tr key={saida.id}>
                  <td>
                    <strong>{saida.codigo_saida}</strong>
                  </td>

                  <td>{saida.destinatario}</td>

                  <td>
                    {saida.itens?.length > 0 ? (
                      <ul className="saida-itens-lista">
                        {saida.itens.map((item) => (
                          <li key={item.id}>
                            {item.produto?.nome || "Produto"} — {item.quantidade}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td>
                    {saida.status === "FINALIZADA" ? (
                      <span className="badge success">Finalizada</span>
                    ) : (
                      <span className="badge muted">Cancelada</span>
                    )}
                  </td>

                  <td>{formatarData(saida.created_at)}</td>

                  <td>
                    <div className="actions">
                      <button onClick={() => abrirPdf(saida.id)}>PDF</button>

                      {saida.status === "FINALIZADA" && (
                        <button
                          className="danger-button"
                          onClick={() => cancelarSaida(saida.id)}
                        >
                          Cancelar
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
          <div className="modal-card saida-modal">
            <div className="modal-header">
              <h2>Nova saída</h2>
              <button onClick={fecharModal}>X</button>
            </div>

            <form onSubmit={salvarSaida} className="form-grid">
              <label>
                Destinatário
                <input
                  name="destinatario"
                  value={form.destinatario}
                  onChange={atualizarCampo}
                  placeholder="Ex: Bruno Dias"
                />
              </label>

              <label className="full">
                Observação
                <textarea
                  name="observacao"
                  value={form.observacao}
                  onChange={atualizarCampo}
                  placeholder="Ex: Materiais para feira em Blumenau"
                />
              </label>

              <div className="saida-itens-box full">
                <div className="saida-itens-header">
                  <h3>Produtos da saída</h3>

                  <button type="button" onClick={adicionarItem}>
                    + Adicionar produto
                  </button>
                </div>

                {form.itens.map((item, index) => (
                  <div className="saida-item-row" key={index}>
                    <label>
                      Produto
                      <select
                        value={item.produto_id}
                        onChange={(event) =>
                          atualizarItem(index, "produto_id", event.target.value)
                        }
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
                        type="number"
                        min="1"
                        value={item.quantidade}
                        onChange={(event) =>
                          atualizarItem(index, "quantidade", event.target.value)
                        }
                        placeholder="Ex: 300"
                      />
                    </label>

                    <button
                      type="button"
                      className="remove-item-button"
                      onClick={() => removerItem(index)}
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>

              <div className="modal-actions">
                <button type="button" onClick={fecharModal}>
                  Cancelar
                </button>

                <button type="submit" className="primary-button">
                  Salvar saída
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Saidas;