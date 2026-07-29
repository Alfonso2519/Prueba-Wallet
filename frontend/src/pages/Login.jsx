import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();

  async function manejarSubmit(evento) {
    evento.preventDefault();
    setError("");
    setCargando(true);

    try {
      await iniciarSesion(email, password);
      navigate("/perfil");
    } catch (err) {
      const mensaje = err.response?.data?.detail || "Correo o contraseña incorrectos";
      setError(mensaje);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", fontFamily: "sans-serif" }}>
      <h2>Iniciar sesión</h2>

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
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={cargando} style={{ padding: "8px 16px" }}>
          {cargando ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p>
        ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
      </p>
    </div>
  );
}

export default Login;