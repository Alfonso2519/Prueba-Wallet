import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosConfig";

function Registro() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  async function manejarSubmit(evento) {
    evento.preventDefault();
    setError("");
    setCargando(true);

    try {
      await api.post("/registro", { email, password });
      navigate("/login");
    } catch (err) {
      const mensaje = err.response?.data?.detail || "Ocurrió un error al registrarte";
      setError(mensaje);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", fontFamily: "sans-serif" }}>
      <h2>Crear cuenta</h2>

      <form onSubmit={manejarSubmit}>
        <div style={{ marginBottom: "12px" }}>
          <label>Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={cargando} style={{ padding: "8px 16px" }}>
          {cargando ? "Creando cuenta..." : "Registrarme"}
        </button>
      </form>

      <p>
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  );
}

export default Registro;