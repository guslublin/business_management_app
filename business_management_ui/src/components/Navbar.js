import React, { useContext } from "react";
import { Layout, Menu, Button } from "antd";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { LogoutOutlined } from "@ant-design/icons";

const { Header } = Layout;

const Navbar = () => {
  const { logout, user } = useContext(AuthContext); // Accede al usuario y logout desde el contexto
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
      {/* Menú de navegación */}
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={items}
        style={{ flex: 1, minWidth: 0 }} // Ajuste responsive
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
