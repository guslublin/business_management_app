import React, { useContext, useState, useEffect } from "react";
import { Form, Input, Button, Card, message, Alert, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import axios from "axios";

const { Title } = Typography;

const Login = () => {
  const { login } = useContext(AuthContext); // Acceder a la función login del contexto
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(""); // Estado para manejar errores
  const [businessConfig, setBusinessConfig] = useState({ nombre_negocio: "", logo: "" });

  // Obtener configuración del negocio (nombre y logo)
  useEffect(() => {
    const fetchBusinessConfig = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/configuracion/publica/");
        setBusinessConfig({
          nombre_negocio: response.data.nombre_negocio,
          logo: response.data.logo ? `http://127.0.0.1:8000${response.data.logo}` : "",
        });
      } catch (error) {
        console.error("Error al cargar la configuración del negocio:", error.message);
      }
    };
    fetchBusinessConfig();
  }, []);

  const onFinish = async (values) => {
    const result = await login(values); // Llamar a la función login del AuthContext
    if (result.success) {
      message.success("Inicio de sesión exitoso");
      navigate("/"); // Redirigir al Home después del login exitoso
    } else {
      setErrorMessage(result.message); // Mostrar mensaje de error del backend
      message.error(result.message); // Mensaje de error con Ant Design
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
      <Card style={{ width: 400, textAlign: "center", paddingTop: "20px" }}>
        {/* Mostrar Logo */}
        {businessConfig.logo && (
          <div style={{ marginBottom: "20px" }}>
            <img
              src={businessConfig.logo}
              alt="Logo del negocio"
              style={{ maxWidth: "300px", height: "auto" }}
            />
          </div>
        )}
        {/* Mostrar Nombre del Negocio */}
        {businessConfig.nombre_negocio && (
          <Title level={3} style={{ marginBottom: "20px" }}>
            {businessConfig.nombre_negocio}
          </Title>
        )}

        {/* Mostrar alerta si hay un error */}
        {errorMessage && <Alert type="error" message={errorMessage} style={{ marginBottom: "15px" }} />}
        
        {/* Formulario de inicio de sesión */}
        <Form name="login" onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Usuario"
            name="username"
            rules={[{ required: true, message: "Por favor ingresa tu usuario" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Contraseña"
            name="password"
            rules={[{ required: true, message: "Por favor ingresa tu contraseña" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Iniciar Sesión
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
