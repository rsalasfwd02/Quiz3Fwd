import { useEffect, useState } from "react";
import api from "../services/api";

/* ─── palette ─── */
const C = {
    primary: "#331f7b",
    accent: "#0288d1",
    danger: "#d32f2f",
    success: "#2e7d32",
    warning: "#f57c00",
    bg: "#f4f6fb",
    card: "#ffffff",
    border: "#e0e4ef",
    text: "#1a1a2e",
    muted: "#6b7280",
};

const inputStyle = {
    padding: "0.65rem 0.9rem",
    borderRadius: "8px",
    border: `1.5px solid ${C.border}`,
    backgroundColor: "white",
    color: C.text,
    fontSize: "0.95rem",
    width: "100%",
    boxSizing: "border-box" as const,
    outline: "none",
    transition: "border-color 0.2s",
};

const btnBase = {
    padding: "0.6rem 1.1rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.88rem",
    transition: "opacity 0.15s, transform 0.1s",
};

/* ─── helpers ─── */
const roleBadge = (role) => ({
    display: "inline-block",
    padding: "0.25rem 0.75rem",
    borderRadius: "999px",
    fontSize: "0.78rem",
    fontWeight: "700",
    letterSpacing: "0.04em",
    backgroundColor: role === "admin" ? "#ede7f6" : "#e1f5fe",
    color: role === "admin" ? "#4527a0" : "#0277bd",
});

function AdminDashboard() {
    /* ── shared ── */
    const [activeTab, setActiveTab] = useState("products");
    const [message, setMessage] = useState({ text: "", type: "" });
    const [isLoading, setIsLoading] = useState(false);

    /* ── products ── */
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({ name: "", price: "" });

    /* ── users ── */
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "cliente" });
    const [showUserModal, setShowUserModal] = useState(false);

    useEffect(() => {
        fetchProducts();
        fetchUsers();
    }, []);

    /* ─────────────── shared ─────────────── */
    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: "", type: "" }), 3500);
    };

    /* ─────────────── products ─────────────── */
    const fetchProducts = async () => {
        setIsLoading(true);
        try { setProducts(await api.get("products")); }
        catch { showMessage("Error al cargar productos", "error"); }
        finally { setIsLoading(false); }
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        if (!newProduct.name || !newProduct.price) return;
        setIsLoading(true);
        try {
            await api.post("products", { ...newProduct, price: Number(newProduct.price) });
            showMessage("✅ Producto creado exitosamente", "success");
            setNewProduct({ name: "", price: "" });
            fetchProducts();
        } catch { showMessage("Error al crear producto", "error"); }
        finally { setIsLoading(false); }
    };

    const saveProductEdit = async (e) => {
        e.preventDefault();
        try {
            await api.put("products", editingProduct.id, { ...editingProduct, price: Number(editingProduct.price) });
            setEditingProduct(null);
            showMessage("✅ Producto actualizado", "success");
            fetchProducts();
        } catch { showMessage("Error al actualizar", "error"); }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
        try {
            await api.delete("products", id);
            showMessage("Producto eliminado", "success");
            fetchProducts();
        } catch { showMessage("Error al eliminar", "error"); }
    };

    /* ─────────────── users ─────────────── */
    const fetchUsers = async () => {
        try { setUsers(await api.get("users")); }
        catch { showMessage("Error al cargar usuarios", "error"); }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        if (!newUser.name || !newUser.email || !newUser.password) return;
        setIsLoading(true);
        try {
            await api.post("users", newUser);
            showMessage("✅ Usuario creado exitosamente", "success");
            setNewUser({ name: "", email: "", password: "", role: "cliente" });
            setShowUserModal(false);
            fetchUsers();
        } catch { showMessage("Error al crear usuario", "error"); }
        finally { setIsLoading(false); }
    };

    const openEditUser = (user) => {
        setEditingUser({ ...user });
        setShowUserModal(true);
    };

    const saveUserEdit = async (e) => {
        e.preventDefault();
        try {
            await api.put("users", editingUser.id, editingUser);
            setEditingUser(null);
            setShowUserModal(false);
            showMessage("✅ Usuario actualizado", "success");
            fetchUsers();
        } catch { showMessage("Error al actualizar usuario", "error"); }
    };

    const deleteUser = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
        try {
            await api.delete("users", id);
            showMessage("Usuario eliminado", "success");
            fetchUsers();
        } catch { showMessage("Error al eliminar usuario", "error"); }
    };

    const closeUserModal = () => {
        setShowUserModal(false);
        setEditingUser(null);
        setNewUser({ name: "", email: "", password: "", role: "cliente" });
    };

    /* ─────────────── render ─────────────── */
    const tabStyle = (tab) => ({
        padding: "0.7rem 2rem",
        border: "none",
        borderBottom: activeTab === tab ? `3px solid ${C.primary}` : "3px solid transparent",
        background: "none",
        cursor: "pointer",
        fontWeight: activeTab === tab ? "700" : "500",
        color: activeTab === tab ? C.primary : C.muted,
        fontSize: "0.97rem",
        transition: "color 0.2s, border-color 0.2s",
    });

    return (
        <div style={{ padding: "2rem", maxWidth: "1100px", margin: "0 auto", fontFamily: "'Inter', sans-serif" }}>

            {/* ── Header ── */}
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <h2 style={{ color: C.primary, margin: 0, fontSize: "1.8rem", fontWeight: "800" }}>
                    🛠️ Dashboard de Administrador
                </h2>
                <p style={{ color: C.muted, marginTop: "0.4rem" }}>Gestión completa de productos y usuarios</p>
            </div>

            {/* ── Toast ── */}
            {message.text && (
                <div style={{
                    padding: "0.9rem 1.4rem",
                    marginBottom: "1.5rem",
                    borderRadius: "10px",
                    backgroundColor: message.type === "success" ? "#e8f5e9" : "#ffebee",
                    color: message.type === "success" ? C.success : C.danger,
                    border: `1px solid ${message.type === "success" ? "#a5d6a7" : "#ef9a9a"}`,
                    textAlign: "center",
                    fontWeight: "600",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                }}>
                    {message.text}
                </div>
            )}

            {/* ── Tabs ── */}
            <div style={{
                display: "flex",
                borderBottom: `2px solid ${C.border}`,
                marginBottom: "2rem",
                backgroundColor: C.card,
                borderRadius: "12px 12px 0 0",
                padding: "0 1rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
            }}>
                <button id="tab-products" style={tabStyle("products")} onClick={() => setActiveTab("products")}>
                    🛒 Productos
                </button>
                <button id="tab-users" style={tabStyle("users")} onClick={() => setActiveTab("users")}>
                    👤 Usuarios
                </button>
            </div>

            {/* ══════════════ PRODUCTS TAB ══════════════ */}
            {activeTab === "products" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "start" }}>

                    {/* Form */}
                    <div style={{ padding: "1.8rem", border: `1px solid ${C.border}`, borderRadius: "14px", backgroundColor: C.card, boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
                        <h3 style={{ marginTop: 0, color: C.primary, fontSize: "1.1rem" }}>
                            {editingProduct ? "✏️ Editar Producto" : "➕ Nuevo Producto"}
                        </h3>
                        <form onSubmit={editingProduct ? saveProductEdit : handleCreateSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: C.muted }}>Nombre del Producto</label>
                                <input
                                    name="name"
                                    value={editingProduct ? editingProduct.name : newProduct.name}
                                    onChange={(e) => editingProduct
                                        ? setEditingProduct({ ...editingProduct, name: e.target.value })
                                        : setNewProduct({ ...newProduct, name: e.target.value })}
                                    required
                                    placeholder="Ej. Arroz Premium"
                                    style={inputStyle}
                                />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: C.muted }}>Precio (₡)</label>
                                <input
                                    name="price"
                                    type="number"
                                    value={editingProduct ? editingProduct.price : newProduct.price}
                                    onChange={(e) => editingProduct
                                        ? setEditingProduct({ ...editingProduct, price: e.target.value })
                                        : setNewProduct({ ...newProduct, price: e.target.value })}
                                    required
                                    placeholder="0"
                                    style={inputStyle}
                                />
                            </div>
                            <div style={{ display: "flex", gap: "0.6rem" }}>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    style={{ ...btnBase, flex: 2, backgroundColor: C.accent, color: "white" }}
                                >
                                    {isLoading ? "Procesando..." : (editingProduct ? "Guardar Cambios" : "Agregar Producto")}
                                </button>
                                {editingProduct && (
                                    <button
                                        type="button"
                                        onClick={() => setEditingProduct(null)}
                                        style={{ ...btnBase, flex: 1, backgroundColor: "#e0e4ef", color: C.text }}
                                    >
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* List */}
                    <div style={{ maxHeight: "72vh", overflowY: "auto", paddingRight: "0.3rem" }}>
                        <h3 style={{ marginTop: 0, color: C.text }}>Lista de Productos</h3>
                        {isLoading && products.length === 0
                            ? <p style={{ color: C.muted }}>Cargando...</p>
                            : products.length === 0
                                ? <p style={{ color: C.muted }}>No hay productos.</p>
                                : products.map(p => (
                                    <div key={p.id} style={{
                                        padding: "1rem 1.2rem",
                                        border: `1px solid ${C.border}`,
                                        borderRadius: "12px",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        backgroundColor: C.card,
                                        marginBottom: "0.8rem",
                                        boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                                    }}>
                                        <div>
                                            <p style={{ fontWeight: "700", fontSize: "1rem", margin: 0, color: C.text }}>{p.name}</p>
                                            <p style={{ color: C.muted, margin: "0.2rem 0 0", fontSize: "0.9rem" }}>₡{p.price.toLocaleString()}</p>
                                        </div>
                                        <div style={{ display: "flex", gap: "0.5rem" }}>
                                            <button onClick={() => setEditingProduct({ ...p })} style={{ ...btnBase, backgroundColor: C.accent, color: "white" }}>Editar</button>
                                            <button onClick={() => deleteProduct(p.id)} style={{ ...btnBase, backgroundColor: C.danger, color: "white" }}>Eliminar</button>
                                        </div>
                                    </div>
                                ))
                        }
                    </div>
                </div>
            )}

            {/* ══════════════ USERS TAB ══════════════ */}
            {activeTab === "users" && (
                <div>
                    {/* Toolbar */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
                        <h3 style={{ margin: 0, color: C.text }}>Usuarios registrados ({users.length})</h3>
                        <button
                            id="btn-new-user"
                            onClick={() => { setEditingUser(null); setShowUserModal(true); }}
                            style={{ ...btnBase, backgroundColor: C.primary, color: "white", padding: "0.65rem 1.4rem" }}
                        >
                            ➕ Nuevo Usuario
                        </button>
                    </div>

                    {/* Table */}
                    {users.length === 0 ? (
                        <p style={{ color: C.muted }}>No hay usuarios registrados.</p>
                    ) : (
                        <div style={{ overflowX: "auto", borderRadius: "14px", boxShadow: "0 4px 16px rgba(0,0,0,0.07)" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: C.card }}>
                                <thead>
                                    <tr style={{ backgroundColor: C.primary, color: "white" }}>
                                        <th style={{ padding: "0.9rem 1rem", textAlign: "left", fontWeight: "600" }}>ID</th>
                                        <th style={{ padding: "0.9rem 1rem", textAlign: "left", fontWeight: "600" }}>Nombre</th>
                                        <th style={{ padding: "0.9rem 1rem", textAlign: "left", fontWeight: "600" }}>Correo</th>
                                        <th style={{ padding: "0.9rem 1rem", textAlign: "left", fontWeight: "600" }}>Rol</th>
                                        <th style={{ padding: "0.9rem 1rem", textAlign: "center", fontWeight: "600" }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u, idx) => (
                                        <tr key={u.id} style={{
                                            backgroundColor: idx % 2 === 0 ? "#f8f9fc" : "white",
                                            borderBottom: `1px solid ${C.border}`,
                                        }}>
                                            <td style={{ padding: "0.85rem 1rem", fontSize: "0.82rem", color: C.muted }}>{u.id}</td>
                                            <td style={{ padding: "0.85rem 1rem", fontWeight: "600", color: C.text }}>{u.name}</td>
                                            <td style={{ padding: "0.85rem 1rem", color: C.muted }}>{u.email}</td>
                                            <td style={{ padding: "0.85rem 1rem" }}>
                                                <span style={roleBadge(u.role)}>{u.role}</span>
                                            </td>
                                            <td style={{ padding: "0.85rem 1rem", textAlign: "center" }}>
                                                <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                                                    <button
                                                        onClick={() => openEditUser(u)}
                                                        style={{ ...btnBase, backgroundColor: C.accent, color: "white" }}
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => deleteUser(u.id)}
                                                        style={{ ...btnBase, backgroundColor: C.danger, color: "white" }}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* ══════════════ USER MODAL ══════════════ */}
            {showUserModal && (
                <div style={{
                    position: "fixed", inset: 0,
                    backgroundColor: "rgba(0,0,0,0.45)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    zIndex: 1000,
                    backdropFilter: "blur(4px)",
                }}>
                    <div style={{
                        backgroundColor: C.card,
                        borderRadius: "16px",
                        padding: "2rem",
                        width: "100%",
                        maxWidth: "440px",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                        position: "relative",
                    }}>
                        <h3 style={{ marginTop: 0, color: C.primary, fontSize: "1.2rem" }}>
                            {editingUser ? "✏️ Editar Usuario" : "➕ Crear Usuario"}
                        </h3>

                        <form onSubmit={editingUser ? saveUserEdit : handleCreateUser} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

                            {/* Name */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: C.muted }}>Nombre completo</label>
                                <input
                                    id="user-name"
                                    value={editingUser ? editingUser.name : newUser.name}
                                    onChange={(e) => editingUser
                                        ? setEditingUser({ ...editingUser, name: e.target.value })
                                        : setNewUser({ ...newUser, name: e.target.value })}
                                    required
                                    placeholder="Ana García"
                                    style={inputStyle}
                                />
                            </div>

                            {/* Email */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: C.muted }}>Correo electrónico</label>
                                <input
                                    id="user-email"
                                    type="email"
                                    value={editingUser ? editingUser.email : newUser.email}
                                    onChange={(e) => editingUser
                                        ? setEditingUser({ ...editingUser, email: e.target.value })
                                        : setNewUser({ ...newUser, email: e.target.value })}
                                    required
                                    placeholder="correo@ejemplo.com"
                                    style={inputStyle}
                                />
                            </div>

                            {/* Password */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: C.muted }}>
                                    Contraseña {editingUser && <span style={{ fontWeight: "400", color: "#aaa" }}>(dejar vacío para no cambiar)</span>}
                                </label>
                                <input
                                    id="user-password"
                                    type="password"
                                    value={editingUser ? (editingUser.password || "") : newUser.password}
                                    onChange={(e) => editingUser
                                        ? setEditingUser({ ...editingUser, password: e.target.value })
                                        : setNewUser({ ...newUser, password: e.target.value })}
                                    required={!editingUser}
                                    placeholder="••••••••"
                                    style={inputStyle}
                                />
                            </div>

                            {/* Role */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: C.muted }}>Rol</label>
                                <select
                                    id="user-role"
                                    value={editingUser ? editingUser.role : newUser.role}
                                    onChange={(e) => editingUser
                                        ? setEditingUser({ ...editingUser, role: e.target.value })
                                        : setNewUser({ ...newUser, role: e.target.value })}
                                    style={{ ...inputStyle }}
                                >
                                    <option value="cliente">Cliente</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            {/* Buttons */}
                            <div style={{ display: "flex", gap: "0.7rem", marginTop: "0.5rem" }}>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    style={{ ...btnBase, flex: 2, backgroundColor: C.primary, color: "white", padding: "0.75rem" }}
                                >
                                    {isLoading ? "Guardando..." : (editingUser ? "Guardar Cambios" : "Crear Usuario")}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeUserModal}
                                    style={{ ...btnBase, flex: 1, backgroundColor: "#e0e4ef", color: C.text, padding: "0.75rem" }}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
