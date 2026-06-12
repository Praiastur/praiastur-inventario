import { useEffect, useState } from "react";
import api from "../../api/api";

function Dashboard() {
  const [resumo, setResumo] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  async function carregarResumo() {
    try {
      setCarregando(true);
      setErro("");

      const resposta = await api.get("/dashboard/resumo");

      setResumo(resposta.data);
    } catch (error) {
      setErro(error.response?.data?.mensagem || "Erro ao carregar dashboard.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarResumo();
  }, []);

  if (carregando) {
    return <div className="loading-box">Carregando dashboard...</div>;
  }

  if (erro) {
    return <div className="error-box">{erro}</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Resumo geral do inventário administrativo e operacional.</p>
      </div>

      <h2 className="section-title">Administrativo</h2>

      <div className="card-grid">
        <div className="info-card">
          <span>Total de produtos</span>
          <strong>{resumo?.administrativo?.total_produtos || 0}</strong>
        </div>

        <div className="info-card">
          <span>Produtos com estoque baixo</span>
          <strong>{resumo?.administrativo?.produtos_estoque_baixo || 0}</strong>
        </div>

        <div className="info-card">
          <span>Total de entradas</span>
          <strong>{resumo?.administrativo?.total_entradas || 0}</strong>
        </div>

        <div className="info-card">
          <span>Total de saídas</span>
          <strong>{resumo?.administrativo?.total_saidas || 0}</strong>
        </div>
      </div>

      <h2 className="section-title">Operacional / Predial</h2>

      <div className="card-grid">
        <div className="info-card">
          <span>Total de residenciais</span>
          <strong>{resumo?.operacional?.total_residenciais || 0}</strong>
        </div>

        <div className="info-card">
          <span>Apartamentos / espaços</span>
          <strong>{resumo?.operacional?.total_apartamentos || 0}</strong>
        </div>

        <div className="info-card">
          <span>Total de itens</span>
          <strong>{resumo?.operacional?.total_itens || 0}</strong>
        </div>

        <div className="info-card">
          <span>Itens em bom estado</span>
          <strong>{resumo?.operacional?.itens_bom || 0}</strong>
        </div>

        <div className="info-card">
          <span>Itens com atenção</span>
          <strong>{resumo?.operacional?.itens_atencao || 0}</strong>
        </div>

        <div className="info-card">
          <span>Itens com problema</span>
          <strong>{resumo?.operacional?.itens_problema || 0}</strong>
        </div>

        <div className="info-card">
          <span>Itens em falta</span>
          <strong>{resumo?.operacional?.itens_em_falta || 0}</strong>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;