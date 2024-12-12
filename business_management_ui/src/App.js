import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "antd";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Usuarios from "./pages/Usuarios";
import Configuraciones from "./pages/Configuraciones";

const { Content } = Layout;

function App() {
  const isAuthenticated = false; // Manejo temporal para autenticación

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {isAuthenticated && <Navbar />}
      <Layout>
        <Content style={{ padding: "20px" }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                isAuthenticated ? <Home /> : <Navigate to="/login" replace />
              }
            />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/configuraciones" element={<Configuraciones />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
