import React, { useContext, useState } from "react";
import { Form, Input, Button, Card, message, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext); // Acceder a la función login del contexto
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(""); // Estado para manejar errores

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
      <Card title="Iniciar Sesión" style={{ width: 400 }}>
        {/* Mostrar alerta si hay un error */}
        {errorMessage && <Alert type="error" message={errorMessage} style={{ marginBottom: "15px" }} />}
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
