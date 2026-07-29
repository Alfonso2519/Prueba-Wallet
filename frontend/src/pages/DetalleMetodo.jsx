import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axiosConfig";

function DetalleMetodo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [metodo, setMetodo] = useState(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    api
      .get(`/metodos-pago/${id}`)
      .then((respuesta) => setMetodo(respuesta.data))
      .catch(() => setError("No se pudo cargar el método de pago"))
      .finally(() => setCargando(false));
  }, [id]);

  async function manejarEliminar() {
    const confirmar = window.confirm(
      "¿Seguro que quieres eliminar este método de pago?"
    );
    if (!confirmar) return;

    setEliminando(true);
    try {
      await api.delete(`/metodos-pago/${id}`);
      navigate("/metodos-pago");
    } catch (err) {
      setError("No se pudo eliminar el método de pago");
      setEliminando(false);
    }
  }

  if (cargando) return <p style={{ textAlign: "center" }}>Cargando...</p>;

  if (error && !metodo) {
    return (
      <div style={{ maxWidth: "450px", margin: "50px auto", fontFamily: "sans-serif" }}>
        <p style={{ color: "red" }}>{error}</p>
        <Link to="/metodos-pago">← Volver al listado</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "450px", margin: "50px auto", fontFamily: "sans-serif" }}>
      <h2>Detalle del método de pago</h2>
      <p><Link to="/metodos-pago">← Volver al listado</Link></p>

      <div style={{ border: "1px solid #ccc", padding: "16px", borderRadius: "8px" }}>
        <p><strong>Alias:</strong> {metodo.alias}</p>
        <p><strong>Tipo:</strong> {metodo.tipo}</p>
        <p><strong>Institución:</strong> {metodo.institucion}</p>
        <p><strong>Moneda:</strong> {metodo.moneda}</p>
        <p><strong>Identificador completo:</strong> {metodo.identificador}</p>
        <p><strong>Estatus:</strong> {metodo.estatus}</p>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button
        onClick={manejarEliminar}
        disabled={eliminando}
        style={{ padding: "8px 16px", marginTop: "16px", background: "#e33", color: "white" }}
      >
        {eliminando ? "Eliminando..." : "Eliminar método de pago"}
      </button>
    </div>
  );
}

export default DetalleMetodo;