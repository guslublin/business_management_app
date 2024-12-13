import React, { useContext } from "react";
import { Layout, Menu, Button } from "antd";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const { Header } = Layout;

const Navbar = () => {
  const { logout } = useContext(AuthContext);

  return (
    <Header style={{ display: "flex", justifyContent: "space-between" }}>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
        <Menu.Item key="1">
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/usuarios">Usuarios</Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/configuraciones">Configuraciones</Link>
        </Menu.Item>
      </Menu>
      <Button type="danger" onClick={logout}>
        Cerrar Sesión
      </Button>
    </Header>
  );
};

export default Navbar;
