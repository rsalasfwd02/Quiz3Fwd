import { useEffect, useState } from "react";
import api from "../services/api";

function AdminDashboard() {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [clients, setClients] = useState([]);

    // New Product state
    const [newProduct, setNewProduct] = useState({ name: "", price: "" });

    useEffect(() => {
        fetchProducts();
        fetchClients();
    }, []);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const data = await api.get("products");
            setProducts(data);
        } catch (error) {
            showMessage("Error al cargar productos", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchClients = async () => {
        try {
            const data = await api.get("users");
            setClients(data.filter(u => u.role === "cliente"));
        } catch (error) {
            console.error("Error cargando clientes:", error);
        }
    };

    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    };

    const handleCreateChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        if (!newProduct.name || !newProduct.price) return;

        setIsLoading(true);
        try {
            const productToCreate = {
                ...newProduct,
                price: Number(newProduct.price)
            };
            await api.post("products", productToCreate);
            showMessage("Producto creado exitosamente", "success");
            setNewProduct({ name: "", price: "" });
            fetchProducts();
        } catch (error) {
            showMessage("Error al crear producto", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;

        try {
            await api.delete("products", id);
            showMessage("Producto eliminado", "success");
            fetchProducts();
        } catch (error) {
            showMessage("Error al eliminar", "error");
        }
    };

    const startEdit = (product) => {
        setEditingProduct({ ...product });
    };

    const handleEditChange = (e) => {
        setEditingProduct({ ...editingProduct, [e.target.name]: e.target.value });
    };

    const saveEdit = async (e) => {
        e.preventDefault();
        try {
            const productToUpdate = {
                ...editingProduct,
                price: Number(editingProduct.price)
            };
            // Using PUT for complete update as per existing logic, could use PATCH too
            await api.put("products", editingProduct.id, productToUpdate);
            setEditingProduct(null);
            showMessage("Producto actualizado", "success");
            fetchProducts();
        } catch (error) {
            showMessage("Error al actualizar", "error");
        }
    };

    return (
        <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
            <h2 style={{ color: "#331f7bff", marginBottom: "2rem", textAlign: "center" }}>Dashboard de Administrador</h2>

            {message.text && (
                <div style={{
                    padding: "1rem",
                    marginBottom: "1rem",
                    borderRadius: "4px",
                    backgroundColor: message.type === "success" ? "#e1f5fe" : "#ffebee",
                    color: message.type === "success" ? "#0288d1" : "#c62828",
                    textAlign: "center",
                    border: `1px solid ${message.type === "success" ? "#a5d6a7" : "#ef9a9a"}`
                }}>
                    {message.text}
                </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "start" }}>
                {/* Form Section */}
                <div style={{ padding: "1.5rem", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9", color: "#333" }}>
                    <h3 style={{ marginTop: 0 }}>{editingProduct ? "Editar Producto" : "Nuevo Producto"}</h3>
                    <form onSubmit={editingProduct ? saveEdit : handleCreateSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                            <label style={{ fontSize: "0.9rem", fontWeight: "600" }}>Nombre del Producto</label>
                            <input
                                name="name"
                                value={editingProduct ? editingProduct.name : newProduct.name}
                                onChange={editingProduct ? handleEditChange : handleCreateChange}
                                required
                                placeholder="Ej. Arroz Premium"
                                style={{ padding: "0.7rem", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: "white", color: "#333" }}
                            />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                            <label style={{ fontSize: "0.9rem", fontWeight: "600" }}>Precio (₡)</label>
                            <input
                                name="price"
                                type="number"
                                value={editingProduct ? editingProduct.price : newProduct.price}
                                onChange={editingProduct ? handleEditChange : handleCreateChange}
                                required
                                placeholder="0000"
                                style={{ padding: "0.7rem", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: "white", color: "#333" }}
                            />
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button
                                type="submit"
                                disabled={isLoading}
                                style={{
                                    flex: 2,
                                    padding: "0.8rem",
                                    backgroundColor: editingProduct ? "#0288d1" : "#0288d1",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontWeight: "bold"
                                }}
                            >
                                {isLoading ? "Procesando..." : (editingProduct ? "Guardar Cambios" : "Agregar Producto")}
                            </button>
                            {editingProduct && (
                                <button
                                    type="button"
                                    onClick={() => setEditingProduct(null)}
                                    style={{
                                        flex: 1,
                                        padding: "0.8rem",
                                        backgroundColor: "#757575",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer"
                                    }}
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* List Section */}
                <div style={{ maxHeight: "70vh", overflowY: "auto", paddingRight: "0.5rem" }}>
                    <h3 style={{ marginTop: 0 }}>Lista de Productos</h3>
                    {isLoading && products.length === 0 ? (
                        <p>Cargando productos...</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {products.length === 0 ? <p>No hay productos disponibles.</p> : products.map(product => (
                                <div key={product.id} style={{
                                    padding: "1rem",
                                    border: "1px solid #eee",
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    backgroundColor: "white",
                                    color: "#333"
                                }}>
                                    <div>
                                        <p style={{ fontWeight: "bold", fontSize: "1.1rem", margin: 0 }}>{product.name}</p>
                                        <p style={{ color: "#666", margin: "0.2rem 0 0 0" }}>Precio: ₡{product.price}</p>
                                    </div>
                                    <div style={{ display: "flex", gap: "0.5rem" }}>
                                        <button
                                            onClick={() => startEdit(product)}
                                            style={{ padding: "0.5rem 0.8rem", backgroundColor: "#0288d1", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => deleteProduct(product.id)}
                                            style={{ padding: "0.5rem 0.8rem", backgroundColor: "#d32f2f", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Clients section */}
            <div style={{ marginTop: "3rem" }}>
                <h3 style={{ color: "#0288d1", borderBottom: "2px solid #e1f5fe", paddingBottom: "0.5rem" }}>
                    👥 Clientes Registrados
                </h3>
                {clients.length === 0 ? (
                    <p style={{ color: "#666" }}>No hay clientes registrados.</p>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{
                            width: "100%", borderCollapse: "collapse",
                            backgroundColor: "white", color: "#333",
                            borderRadius: "8px", overflow: "hidden",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.07)"
                        }}>
                            <thead>
                                <tr style={{ backgroundColor: "#0288d1", color: "white" }}>
                                    <th style={{ padding: "0.9rem 1rem", textAlign: "left" }}>ID</th>
                                    <th style={{ padding: "0.9rem 1rem", textAlign: "left" }}>Nombre</th>
                                    <th style={{ padding: "0.9rem 1rem", textAlign: "left" }}>Correo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clients.map((client, index) => (
                                    <tr key={client.id} style={{
                                        backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white",
                                        borderBottom: "1px solid #eee"
                                    }}>
                                        <td style={{ padding: "0.8rem 1rem", fontSize: "0.85rem", color: "#888" }}>{client.id}</td>
                                        <td style={{ padding: "0.8rem 1rem", fontWeight: "600" }}>{client.name}</td>
                                        <td style={{ padding: "0.8rem 1rem" }}>{client.email}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;
