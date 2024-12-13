import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Layout, Spin } from "antd";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Usuarios from "./pages/Usuarios";
import Configuraciones from "./pages/Configuraciones";
import { AuthContext, AuthProvider } from "./AuthContext";

const { Content } = Layout;

function AppContent() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {user && <Navbar />}
      <Layout>
        <Content style={{ padding: "20px" }}>
          <Routes>
            {/* Ruta Login */}
            <Route path="/login" element={<Login />} />

            {/* Ruta Home - Accesible para cualquier usuario autenticado */}
            <Route
              path="/"
              element={user ? <Home /> : <Navigate to="/login" replace />}
            />

            {/* Ruta Usuarios - Solo admin */}
            <Route
              path="/usuarios"
              element={
                user?.rol === "admin" ? (
                  <Usuarios />
                ) : user ? (
                  <Navigate to="/" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Ruta Configuraciones - Solo admin */}
            <Route
              path="/configuraciones"
              element={
                user?.rol === "admin" ? (
                  <Configuraciones />
                ) : user ? (
                  <Navigate to="/" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Ruta por defecto si no coincide */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
