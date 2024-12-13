import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Crear contexto
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  // Función para iniciar sesión
  const login = async (credentials) => {
    try {
      // Enviar las credenciales al backend
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/",
        credentials
      );
      const { access } = response.data;

      // Guardar token en localStorage
      localStorage.setItem("token", access);
      setToken(access);

      // Obtener los detalles del usuario
      const userFetchSuccess = await fetchUser(access);
      if (userFetchSuccess) {
        return { success: true }; // Login y fetchUser exitosos
      } else {
        throw new Error("No se pudieron obtener los detalles del usuario.");
      }
    } catch (error) {
      console.error("Error en login:", error.response?.data?.detail);

      let errorMessage = error.response?.data?.detail;

      if(errorMessage="No active account found with the given credentials"){
        errorMessage = "No se encuentra el usuario registrado"
      } else {
        errorMessage = "Error desconocido en el servidor"
      }

      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken("");
  };

  // Obtener detalles del usuario con el token
  const fetchUser = async (currentToken) => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/auth/user/", {
        headers: { Authorization: `Bearer ${currentToken || token}` },
      });
      setUser(response.data); // Actualizar el estado del usuario
      return true; // Éxito
    } catch (error) {
      console.error("Error al obtener usuario:", error.response?.data || error.message);
      logout(); // Invalidar sesión si hay un problema
      return false; // Fallo
    } finally {
      setLoading(false);
    }
  };

  // Al cargar, intentar obtener el usuario si hay un token
  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
