import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

import Registro from "./pages/Registro.jsx";
import Login from "./pages/Login.jsx";
import Perfil from "./pages/Perfil.jsx";
import ListadoMetodos from "./pages/ListadoMetodos.jsx";
import AltaMetodo from "./pages/AltaMetodo.jsx";
import DetalleMetodo from "./pages/DetalleMetodo.jsx";

function RutaProtegida({ children }) {
  const { usuario, cargando } = useAuth();

  if (cargando) return <p>Cargando...</p>;
  if (!usuario) return <Navigate to="/login" replace />;

  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/registro" element={<Registro />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/perfil"
        element={
          <RutaProtegida>
            <Perfil />
          </RutaProtegida>
        }
      />
      <Route
        path="/metodos-pago"
        element={
          <RutaProtegida>
            <ListadoMetodos />
          </RutaProtegida>
        }
      />
      <Route
        path="/metodos-pago/nuevo"
        element={
          <RutaProtegida>
            <AltaMetodo />
          </RutaProtegida>
        }
      />
      <Route
        path="/metodos-pago/:id"
        element={
          <RutaProtegida>
            <DetalleMetodo />
          </RutaProtegida>
        }
      />

      <Route path="/" element={<Navigate to="/perfil" replace />} />
    </Routes>
  );
}

export default App;