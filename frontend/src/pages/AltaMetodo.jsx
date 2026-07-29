import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosConfig";

function AltaMetodo() {
  const [tipo, setTipo] = useState("tarjeta");
  const [alias, setAlias] = useState("");
  const [institucion, setInstitucion] = useState("");
  const [moneda, setMoneda] = useState("MXN");
  const [identificador, setIdentificador] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  async function manejarSubmit(evento) {
    evento.preventDefault();
    setError("");
    setCargando(true);

    try {
      await api.post("/metodos-pago", {
        tipo,
        alias,
        institucion,
        moneda,
        identificador,
      });
      navigate("/metodos-pago");
    } catch (err) {
      const mensaje = err.response?.data?.detail || "Ocurrió un error al guardar";
      setError(mensaje);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div style={{ maxWidth: "450px", margin: "50px auto", fontFamily: "sans-serif" }}>
      <h2>Agregar método de pago</h2>
      <p><Link to="/metodos-pago">← Volver al listado</Link></p>

      <form onSubmit={manejarSubmit}>
        <div style={{ marginBottom: "12px" }}>
          <label>Tipo</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="tarjeta">Tarjeta</option>
            <option value="cuenta_bancaria">Cuenta bancaria</option>
            <option value="clabe">CLABE</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Alias</label>
          <input
            type="text"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            required
            placeholder="Ej. Mi tarjeta principal"
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Institución</label>
          <input
            type="text"
            value={institucion}
            onChange={(e) => setInstitucion(e.target.value)}
            required
            placeholder="Ej. BBVA"
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Moneda</label>
          <select
            value={moneda}
            onChange={(e) => setMoneda(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="MXN">MXN</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Identificador (número de tarjeta/cuenta/CLABE)</label>
          <input
            type="text"
            value={identificador}
            onChange={(e) => setIdentificador(e.target.value)}
            required
            placeholder="Ej. 4152313312345678"
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={cargando} style={{ padding: "8px 16px" }}>
          {cargando ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </div>
  );
}

export default AltaMetodo;