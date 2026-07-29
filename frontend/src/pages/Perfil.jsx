import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Perfil() {
  const { usuario, cerrarSesion } = useAuth();

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", fontFamily: "sans-serif" }}>
      <h2>Mi perfil</h2>

      <div style={{ border: "1px solid #ccc", padding: "16px", borderRadius: "8px", marginBottom: "20px" }}>
        <p><strong>Correo:</strong> {usuario?.email}</p>
        <p><strong>Miembro desde:</strong> {usuario?.fecha_creacion && new Date(usuario.fecha_creacion).toLocaleDateString()}</p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <Link to="/metodos-pago">
          <button style={{ padding: "10px 20px" }}>Ver mis métodos de pago</button>
        </Link>
      </div>

      <button onClick={cerrarSesion} style={{ padding: "8px 16px" }}>
        Cerrar sesión
      </button>
    </div>
  );
}

export default Perfil;