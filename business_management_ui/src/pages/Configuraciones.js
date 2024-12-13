import React, { useState, useEffect, useContext } from "react";
import { Form, Input, Button, Upload, message, Card } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { AuthContext } from "../AuthContext"; // Importar el AuthContext

const Configuraciones = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { updateBusinessName } = useContext(AuthContext); // Obtener la función para actualizar el nombre global

  useEffect(() => {
    fetchConfiguracion();
  }, []);

  // Obtener la configuración del negocio
  const fetchConfiguracion = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/configuracion/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
  
      const logoUrl = response.data.logo;
  
      // Configurar el formato correcto para Ant Design's Upload
      const fileList = logoUrl
        ? [
            {
              uid: "-1", // Identificador único
              name: "logo", // Nombre del archivo
              status: "done", // Estado como cargado
              url: `http://127.0.0.1:8000${logoUrl}`, // URL completa del logo
            },
          ]
        : [];
  
      form.setFieldsValue({
        nombre_negocio: response.data.nombre_negocio,
        logo: fileList,
      });
    } catch (error) {
      message.error("Error al cargar configuración.");
    } finally {
      setLoading(false);
    }
  };
  

  // Guardar los cambios de configuración
  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append("nombre_negocio", values.nombre_negocio);
    if (values.logo && values.logo[0]?.originFileObj) {
      formData.append("logo", values.logo[0].originFileObj);
    }

    try {
      const response = await axios.patch("http://127.0.0.1:8000/api/configuracion/", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      message.success("Configuración actualizada correctamente.");

      // Actualizar el nombre del negocio en el AuthContext
      if (values.nombre_negocio) {
        updateBusinessName(values.nombre_negocio);
      }
    } catch (error) {
      console.error("Error al guardar configuración:", error);
      message.error("Error al guardar configuración.");
    }
  };

  return (
    <Card title="Configuración del Negocio" loading={loading}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* Nombre del Negocio */}
        <Form.Item
          label="Nombre del Negocio"
          name="nombre_negocio"
          rules={[{ required: true, message: "Por favor ingresa el nombre del negocio" }]}
        >
          <Input />
        </Form.Item>

        {/* Logo del Negocio */}
        <Form.Item
          label="Logo del Negocio"
          name="logo"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
        >
          <Upload beforeUpload={() => false} listType="picture">
            <Button icon={<UploadOutlined />}>Cargar Logo</Button>
          </Upload>
        </Form.Item>

        {/* Botón Guardar */}
        <Button type="primary" htmlType="submit">
          Guardar Configuración
        </Button>
      </Form>
    </Card>
  );
};

export default Configuraciones;
