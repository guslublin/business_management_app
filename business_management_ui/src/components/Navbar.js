import React, { useContext } from "react";
import { Layout, Menu, Button, Typography } from "antd";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { LogoutOutlined } from "@ant-design/icons";

const { Header } = Layout;
const { Title, Text } = Typography;

const Navbar = () => {
  const { logout, user, businessName } = useContext(AuthContext); // Se accede al nombre del negocio y usuario desde el contexto
  const location = useLocation();

  // Menú base (opción "Home")
  const items = [
    { key: "/", label: <Link to="/">Home</Link> },
  ];

  // Agregar opciones para admin
  if (user?.rol === "admin") {
    items.push(
      { key: "/usuarios", label: <Link to="/usuarios">Usuarios</Link> },
      { key: "/configuraciones", label: <Link to="/configuraciones">Configuraciones</Link> }
    );
  }

  return (
    <Header style={{ display: "flex", alignItems: "center", padding: "0 20px" }}>
      {/* Nombre del negocio */}
      <div style={{ marginRight: "20px" }}>
        <Title level={4} style={{ color: "#fff", margin: 0 }}>
          {businessName || "Mi Negocio"} {/* Mostrar nombre del negocio dinámico */}
        </Title>
      </div>

      {/* Menú de navegación */}
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={items}
        style={{ flex: 1, minWidth: 0 }} // Ajuste responsive
      />

      {/* Email del usuario */}
      <div style={{ marginRight: "20px", display: "flex", alignItems: "center" }}>
        <Text style={{ color: "#fff" }}>{user?.email}</Text>
      </div>

      {/* Botón de logout con ícono */}
      <Button
        type="primary"
        icon={<LogoutOutlined />}
        onClick={logout}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
    </Header>
  );
};

export default Navbar;
