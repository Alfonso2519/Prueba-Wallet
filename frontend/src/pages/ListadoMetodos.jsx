import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosConfig";

function ListadoMetodos() {
  const [metodos, setMetodos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarMetodos();
  }, []);

  function cargarMetodos() {
    setCargando(true);
    api
      .get("/metodos-pago")
      .then((respuesta) => setMetodos(respuesta.data))
      .catch(() => setError("No se pudieron cargar los métodos de pago"))
      .finally(() => setCargando(false));
  }

  if (cargando) return <p style={{ textAlign: "center" }}>Cargando...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Mis métodos de pago</h2>
        <Link to="/metodos-pago/nuevo">
          <button style={{ padding: "8px 16px" }}>+ Agregar</button>
        </Link>
      </div>

      <p><Link to="/perfil">← Volver al perfil</Link></p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {metodos.length === 0 && !error && (
        <p>No tienes métodos de pago registrados todavía.</p>
      )}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {metodos.map((metodo) => (
          <li
            key={metodo.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "10px",
            }}
          >
            <p><strong>{metodo.alias}</strong> ({metodo.tipo})</p>
            <p>{metodo.institucion} — {metodo.moneda}</p>
            <p>{metodo.identificador_enmascarado}</p>
            <Link to={`/metodos-pago/${metodo.id}`}>Ver detalle</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListadoMetodos;