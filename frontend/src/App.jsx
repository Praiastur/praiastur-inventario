import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login/Login";
import MainLayout from "./layouts/MainLayout";
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";

import Dashboard from "./pages/Dashboard/Dashboard";
import Produtos from "./pages/Produtos/Produtos";
import Entradas from "./pages/Entradas/Entradas";
import Saidas from "./pages/Saidas/Saidas";
import Residenciais from "./pages/Residenciais/Residenciais";
import Apartamentos from "./pages/Apartamentos/Apartamentos";
import ItensOperacionais from "./pages/ItensOperacionais/ItensOperacionais";
import Usuarios from "./pages/Usuarios/Usuarios";
import Historicos from "./pages/Historicos/Historicos";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />

        <Route
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/entradas" element={<Entradas />} />
          <Route path="/saidas" element={<Saidas />} />
          <Route path="/residenciais" element={<Residenciais />} />
          <Route path="/apartamentos" element={<Apartamentos />} />
          <Route path="/itens-operacionais" element={<ItensOperacionais />} />

          <Route
            path="/usuarios"
            element={
              <AdminRoute>
                <Usuarios />
              </AdminRoute>
            }
          />

          <Route
            path="/historicos"
            element={
              <AdminRoute>
                <Historicos />
              </AdminRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;