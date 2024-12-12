import React from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";

const { Header } = Layout;

const Navbar = () => {
  return (
    <Header>
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
    </Header>
  );
};

export default Navbar;
