import { createContext, useState, useContext, useEffect } from "react";
import api from "../api/axiosConfig";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Al cargar la app, si hay un token guardado, intentamos recuperar el perfil
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCargando(false);
      return;
    }

    api
      .get("/perfil")
      .then((respuesta) => setUsuario(respuesta.data))
      .catch(() => {
        localStorage.removeItem("token");
        setUsuario(null);
      })
      .finally(() => setCargando(false));
  }, []);

  async function iniciarSesion(email, password) {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const respuesta = await api.post("/login", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    localStorage.setItem("token", respuesta.data.access_token);

    const perfil = await api.get("/perfil");
    setUsuario(perfil.data);
  }

  function cerrarSesion() {
    localStorage.removeItem("token");
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, cargando, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}