import React, { useContext } from "react";
import { Layout, Menu, Button } from "antd";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { LogoutOutlined } from "@ant-design/icons";

const { Header } = Layout;

const Navbar = () => {
  const { logout } = useContext(AuthContext);
  const location = useLocation();

  // Menú de navegación
  const items = [
    { key: "/", label: <Link to="/">Home</Link> },
    { key: "/usuarios", label: <Link to="/usuarios">Usuarios</Link> },
    { key: "/configuraciones", label: <Link to="/configuraciones">Configuraciones</Link> },
  ];

  return (
    <Header style={{ display: "flex", alignItems: "center", padding: "0 20px" }}>
      {/* Menú de navegación */}
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={items}
        style={{ flex: 1, minWidth: 0 }} // Asegura el ajuste responsive
      />
      {/* Botón de logout con ícono */}
      <Button
        type="primary"
        icon={<LogoutOutlined />}
        onClick={logout}
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      />
    </Header>
  );
};

export default Navbar;
