import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@praiastur.com.br");
  const [senha, setSenha] = useState("123456");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function fazerLogin(event) {
    event.preventDefault();

    setErro("");
    setCarregando(true);

    try {
      const resposta = await api.post("/auth/login", {
        email,
        senha
      });

      localStorage.setItem("token", resposta.data.token);
      localStorage.setItem("usuario", JSON.stringify(resposta.data.usuario));

      navigate("/dashboard");
    } catch (error) {
      setErro(error.response?.data?.mensagem || "Erro ao fazer login.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Praiastur Inventário</h1>
        <p>Acesse o sistema interno de controle.</p>

        <form onSubmit={fazerLogin}>
          <label>E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <label>Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
          />

          {erro && <div className="login-error">{erro}</div>}

          <button type="submit" disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;