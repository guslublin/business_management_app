import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [productos, setProductos] = useState([]); // Lista de productos
  const [nombre, setNombre] = useState(""); // Estado para el nombre del producto
  const [precio, setPrecio] = useState(""); // Estado para el precio del producto
  const [stock, setStock] = useState(""); // Estado para el stock del producto

  // Obtener productos desde la API al cargar el componente
  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = () => {
    axios
      .get("http://127.0.0.1:8000/api/productos/")
      .then((response) => {
        setProductos(response.data);
      })
      .catch((error) => console.error("Error al obtener productos:", error));
  };

  // Agregar un nuevo producto
  const agregarProducto = () => {
    const nuevoProducto = {
      nombre,
      precio,
      stock,
    };

    axios
      .post("http://127.0.0.1:8000/api/productos/", nuevoProducto)
      .then((response) => {
        setProductos([...productos, response.data]); // Actualiza la lista
        limpiarFormulario();
      })
      .catch((error) => console.error("Error al agregar producto:", error));
  };

  // Eliminar un producto
  const eliminarProducto = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/api/productos/${id}/`)
      .then(() => {
        setProductos(productos.filter((producto) => producto.id !== id)); // Filtra y actualiza la lista
      })
      .catch((error) => console.error("Error al eliminar producto:", error));
  };

  // Limpiar el formulario después de agregar
  const limpiarFormulario = () => {
    setNombre("");
    setPrecio("");
    setStock("");
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Gestión de Productos</h1>

        {/* Formulario para agregar producto */}
        <div>
          <h2>Agregar Producto</h2>
          <input
            type="text"
            placeholder="Nombre del producto"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            type="number"
            placeholder="Precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
          <button onClick={agregarProducto}>Agregar</button>
        </div>

        {/* Listado de productos */}
        <div>
          <h2>Lista de Productos</h2>
          {productos.length > 0 ? (
            <ul>
              {productos.map((producto) => (
                <li key={producto.id}>
                  {producto.nombre} - ${producto.precio} - Stock:{" "}
                  {producto.stock}
                  {" "}
                  <button
                    onClick={() => eliminarProducto(producto.id)}
                    style={{
                      marginLeft: "10px",
                      color: "red",
                      cursor: "pointer",
                      border: "none",
                      background: "transparent",
                      fontSize: "1.2rem",
                    }}
                  >
                    x
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay productos disponibles.</p>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
