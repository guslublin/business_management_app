import React, { useContext, useState } from "react";
import { Layout, Menu, Button, Typography, Drawer, Divider } from "antd";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { LogoutOutlined, MenuOutlined } from "@ant-design/icons";

const { Header } = Layout;
const { Title, Text } = Typography;

const Navbar = () => {
  const { logout, user, businessName } = useContext(AuthContext);
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Menú base
  const items = [
    { key: "/", label: <Link to="/">Home</Link> },
  ];

  if (user?.rol === "admin") {
    items.push(
      { key: "/usuarios", label: <Link to="/usuarios">Usuarios</Link> },
      { key: "/configuraciones", label: <Link to="/configuraciones">Configuraciones</Link> }
    );
  }

  // Función para cerrar el Drawer automáticamente
  const handleMenuClick = () => {
    setDrawerOpen(false);
  };

  return (
    <>
      {/* Header principal */}
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
        }}
      >
        {/* Nombre del negocio */}
        <Title level={4} style={{ color: "#fff", margin: 0, marginRight: "10px" }}>
          {businessName || "Mi Negocio"}
        </Title>

        {/* Botón hamburguesa para dispositivos móviles */}
        <Button
          type="text"
          icon={<MenuOutlined style={{ color: "#fff", fontSize: "20px" }} />}
          onClick={() => setDrawerOpen(true)}
          className="menu-button"
          style={{ display: "none" }}
        />

        {/* Menú de navegación */}
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={items}
          style={{ flex: 1, minWidth: 0 }}
          className="menu-desktop"
        />

        {/* Botón de logout y email solo en vista de escritorio */}
        <div className="user-info">
          <Text style={{ color: "#fff", marginRight: "20px" }}>
            {user?.email}
          </Text>
          <Button
            type="primary"
            icon={<LogoutOutlined />}
            onClick={logout}
          />
        </div>
      </Header>

      {/* Drawer para vista móvil */}
      <Drawer
        title={businessName || "Mi Negocio"}
        placement="right"
        closable={true}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen} // Usar 'open' en lugar de 'visible'
      >
        {/* Opciones del menú */}
        <Menu
          mode="vertical"
          selectedKeys={[location.pathname]}
          items={[
            { key: "/", label: <Link to="/" onClick={handleMenuClick}>Home</Link> },
            ...(user?.rol === "admin"
              ? [
                  {
                    key: "/usuarios",
                    label: <Link to="/usuarios" onClick={handleMenuClick}>Usuarios</Link>,
                  },
                  {
                    key: "/configuraciones",
                    label: <Link to="/configuraciones" onClick={handleMenuClick}>Configuraciones</Link>,
                  },
                ]
              : []),
          ]}
        />

        {/* Divider y opciones del usuario */}
        <Divider />
        <div style={{ textAlign: "center" }}>
          <Text strong>{user?.email}</Text>
          <br />
          <Button
            type="primary"
            icon={<LogoutOutlined />}
            onClick={() => {
              logout();
              handleMenuClick();
            }}
            style={{ marginTop: "10px" }}
          >
            Cerrar Sesión
          </Button>
        </div>
      </Drawer>

      {/* Estilos responsivos */}
      <style>
        {`
          @media (max-width: 768px) {
            .menu-desktop {
              display: none;
            }
            .menu-button {
              display: inline-block !important;
            }
            .user-info {
              display: none;
            }
          }
        `}
      </style>
    </>
  );
};

export default Navbar;
