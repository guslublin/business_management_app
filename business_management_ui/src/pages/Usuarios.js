import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Select, message, Switch } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Obtener listado de usuarios
  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/api/usuarios/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(response.data);
    } catch (error) {
      message.error("Error al obtener usuarios.");
      console.error("Error fetching users:", error.response || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal para crear usuario
  const openCreateModal = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  // Abrir modal para editar usuario
  const openEditModal = (record) => {
    setEditingUser(record);
    form.setFieldsValue({
      email: record.email,
      rol: record.rol,
      is_active: record.is_active,
    });
    setModalVisible(true);
  };

  // Guardar usuario (crear o actualizar)
  const saveUsuario = async (values) => {
    if (values.password && values.password !== values.confirmPassword) {
      message.error("Las contraseñas no coinciden.");
      return;
    }

    const data = { ...values };
    if (!values.password) {
      delete data.password; // Si no hay nueva contraseña, no enviarla
    }
    delete data.confirmPassword;

    try {
      if (editingUser) {
        await axios.patch(
          `http://127.0.0.1:8000/api/usuarios/${editingUser.id}/`,
          data,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        message.success("Usuario actualizado correctamente.");
      } else {
        console.log('data', data);
        
        await axios.post(
          "http://127.0.0.1:8000/api/usuarios/crear/",
          data,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        message.success("Usuario creado correctamente.");
      }
      fetchUsuarios();
      setModalVisible(false);
    } catch (error) {
      message.error("Error al guardar usuario.");
      console.error("Error saving user:", error.response || error.message);
    }
  };

  const columns = [
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Rol", dataIndex: "rol", key: "rol" },
    {
      title: "Estado",
      dataIndex: "is_active",
      key: "is_active",
      render: (isActive) => (
        <span style={{ color: isActive ? "green" : "red" }}>
          {isActive ? "Activo" : "Inactivo"}
        </span>
      ),
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => (
        <Button
          icon={<EditOutlined />}
          style={{
            backgroundColor: "#ff4d4f",
            color: "#fff",
            border: "none",
          }}
          onClick={() => openEditModal(record)}
        />
      ),
    },
  ];
  

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Gestión de Usuarios</h1>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ margin: "20px auto", display: "block" }}
        onClick={openCreateModal}
      >
        Crear Usuario
      </Button>
      <Table
        columns={columns}
        dataSource={usuarios}
        loading={loading}
        rowKey="id"
      />

      {/* Modal para Crear/Editar Usuario */}
      <Modal
        open={modalVisible}
        title={editingUser ? "Editar Usuario" : "Crear Usuario"}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={saveUsuario}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email", message: "Email requerido" }]}
          >
            <Input disabled={!!editingUser} />
          </Form.Item>
          <Form.Item
            label="Contraseña"
            name="password"
            rules={
              !editingUser
                ? [{ required: true, message: "Contraseña requerida" }]
                : []
            }
          >
            <Input.Password placeholder="Nueva contraseña" />
          </Form.Item>
          <Form.Item
            label="Confirmar Contraseña"
            name="confirmPassword"
            rules={
              !editingUser
                ? [{ required: true, message: "Confirma tu contraseña" }]
                : []
            }
          >
            <Input.Password placeholder="Confirmar contraseña" />
          </Form.Item>
          <Form.Item
            label="Rol"
            name="rol"
            rules={[{ required: true, message: "Rol requerido" }]}
          >
            <Select placeholder="Selecciona un rol">
              <Option value="admin">Administrador</Option>
              <Option value="supervisor">Supervisor</Option>
              <Option value="user">Usuario</Option>
            </Select>
          </Form.Item>
          {editingUser && (
            <Form.Item label="Activo" name="is_active" valuePropName="checked">
              <Switch checkedChildren="Activo" unCheckedChildren="Inactivo" />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Usuarios;
