import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Crear contexto
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Almacena datos del usuario
  const [token, setToken] = useState(localStorage.getItem("token") || ""); // Token de autenticación
  const [businessName, setBusinessName] = useState(""); // Nombre del negocio
  const [loading, setLoading] = useState(true); // Indicador de carga global

  // Función para iniciar sesión
  const login = async (credentials) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/",
        credentials
      );
      const { access } = response.data;

      // Guardar token en localStorage y estado
      localStorage.setItem("token", access);
      setToken(access);

      // Obtener usuario y configuración del negocio
      await fetchInitialData(access);

      return { success: true };
    } catch (error) {
      console.error("Error en login:", error.response?.data?.detail || error.message);

      let errorMessage = error.response?.data?.detail;
      if (errorMessage === "No active account found with the given credentials") {
        errorMessage = "No se encuentra el usuario registrado.";
      } else {
        errorMessage = "Error desconocido en el servidor.";
      }

      return { success: false, message: errorMessage };
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken("");
    setBusinessName("");
  };

  // Obtener detalles del usuario
  const fetchUser = async (currentToken) => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/auth/user/", {
        headers: { Authorization: `Bearer ${currentToken || token}` },
      });
      setUser(response.data);
      return true;
    } catch (error) {
      console.error("Error al obtener usuario:", error.message);
      logout(); // Cerrar sesión si falla
      return false;
    }
  };

  // Obtener configuración del negocio
  const fetchBusinessConfig = async (currentToken) => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/configuracion/", {
        headers: { Authorization: `Bearer ${currentToken || token}` },
      });
      setBusinessName(response.data.nombre_negocio);
      return true;
    } catch (error) {
      console.error("Error al obtener configuración del negocio:", error.message);
      return false;
    }
  };

  // Actualizar nombre del negocio desde Configuraciones
  const updateBusinessName = async (newName) => {
    try {
      const response = await axios.patch(
        "http://127.0.0.1:8000/api/configuracion/",
        { nombre_negocio: newName }, // Solo actualiza el nombre
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setBusinessName(newName); // Actualiza el nombre globalmente
      return true;
    } catch (error) {
      console.error("Error al actualizar nombre del negocio:", error.message);
      return false;
    }
  };

  // Cargar usuario y configuración inicial
  const fetchInitialData = async (currentToken) => {
    const userSuccess = await fetchUser(currentToken);
    const businessSuccess = await fetchBusinessConfig(currentToken);
    if (!userSuccess || !businessSuccess) {
      logout(); // Si algo falla, se cierra sesión
    }
  };

  // Efecto inicial: cargar datos si hay un token almacenado
  useEffect(() => {
    const initialize = async () => {
      if (token) {
        await fetchInitialData(token);
      }
      setLoading(false);
    };
    initialize();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading,
        businessName, // Proveer el nombre del negocio
        updateBusinessName, // Proveer función para actualizar
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
