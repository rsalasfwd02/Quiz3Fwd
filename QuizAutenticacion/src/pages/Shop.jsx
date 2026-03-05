import { useEffect, useState } from "react";
import api from "../services/api";

function Shop() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [cart, setCart] = useState([]);
    const [notification, setNotification] = useState("");
    const [showCart, setShowCart] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const data = await api.get("products");
            setProducts(data);
        } catch (err) {
            setError("No se pudo cargar los productos. Verifica que el servidor esté activo.");
        } finally {
            setIsLoading(false);
        }
    };

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
            }
            return [...prev, { ...product, qty: 1 }];
        });
        setNotification(`"${product.name}" agregado al carrito`);
        setTimeout(() => setNotification(""), 2000);
    };

    const decreaseQty = (id) => {
        setCart(prev => {
            const item = prev.find(i => i.id === id);
            if (item.qty === 1) return prev.filter(i => i.id !== id);
            return prev.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i);
        });
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(i => i.id !== id));
    };

    const clearCart = () => {
        setCart([]);
    };

    const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
    const totalPrice = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

    return (
        <div style={{ padding: "2rem", maxWidth: "1100px", margin: "0 auto", position: "relative" }}>
            <h1 style={{ color: "#0288d1", textAlign: "center", marginBottom: "0.5rem" }}>
                🛒 Tienda
            </h1>
            <p style={{ textAlign: "center", color: "#555", marginBottom: "2rem" }}>
                Explora nuestros productos disponibles
            </p>

            {/* Toast notification */}
            {notification && (
                <div style={{
                    position: "fixed", top: "80px", right: "1.5rem",
                    backgroundColor: "#0288d1", color: "white",
                    padding: "0.8rem 1.4rem", borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    zIndex: 3000, fontSize: "0.95rem", fontWeight: "500",
                    animation: "fadeIn 0.2s ease"
                }}>
                    ✓ {notification}
                </div>
            )}

            {/* Floating cart button */}
            <button
                onClick={() => setShowCart(!showCart)}
                style={{
                    position: "fixed", bottom: "2rem", right: "2rem",
                    backgroundColor: "#0288d1", color: "white",
                    border: "none", borderRadius: "50px",
                    padding: "0.9rem 1.4rem", cursor: "pointer",
                    fontSize: "1rem", fontWeight: "700",
                    boxShadow: "0 4px 15px rgba(2,136,209,0.4)",
                    zIndex: 2000, display: "flex", alignItems: "center", gap: "0.5rem",
                    transition: "transform 0.2s, background-color 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >
                🛒 Carrito
                {totalItems > 0 && (
                    <span style={{
                        backgroundColor: "#ff5722", color: "white",
                        borderRadius: "50%", width: "22px", height: "22px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.75rem", fontWeight: "800"
                    }}>
                        {totalItems}
                    </span>
                )}
            </button>

            {/* Cart side panel */}
            {showCart && (
                <>
                    {/* Backdrop */}
                    <div
                        onClick={() => setShowCart(false)}
                        style={{
                            position: "fixed", inset: 0,
                            backgroundColor: "rgba(0,0,0,0.35)",
                            zIndex: 2500
                        }}
                    />
                    {/* Panel */}
                    <div style={{
                        position: "fixed", top: 0, right: 0,
                        width: "340px", height: "100vh",
                        backgroundColor: "white", color: "#333",
                        boxShadow: "-4px 0 20px rgba(0,0,0,0.15)",
                        zIndex: 2600, display: "flex", flexDirection: "column",
                        overflowY: "auto"
                    }}>
                        {/* Panel header */}
                        <div style={{
                            backgroundColor: "#0288d1", color: "white",
                            padding: "1.2rem 1.5rem",
                            display: "flex", justifyContent: "space-between", alignItems: "center"
                        }}>
                            <h2 style={{ margin: 0, fontSize: "1.2rem" }}>🛒 Mi Carrito</h2>
                            <button
                                onClick={() => setShowCart(false)}
                                style={{
                                    background: "none", border: "none",
                                    color: "white", fontSize: "1.5rem",
                                    cursor: "pointer", lineHeight: 1
                                }}
                            >✕</button>
                        </div>

                        {/* Cart items */}
                        <div style={{ flex: 1, padding: "1rem" }}>
                            {cart.length === 0 ? (
                                <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#888" }}>
                                    <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🛒</div>
                                    <p>Tu carrito está vacío</p>
                                </div>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                                    {cart.map(item => (
                                        <div key={item.id} style={{
                                            border: "1px solid #e0e0e0", borderRadius: "10px",
                                            padding: "0.9rem 1rem", backgroundColor: "#f9f9f9"
                                        }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                                <div>
                                                    <p style={{ margin: 0, fontWeight: "600", fontSize: "0.95rem" }}>{item.name}</p>
                                                    <p style={{ margin: "0.2rem 0 0", color: "#0288d1", fontWeight: "700" }}>
                                                        ₡{(item.price * item.qty).toLocaleString()}
                                                    </p>
                                                </div>
                                                {/* Remove completely */}
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    style={{
                                                        background: "none", border: "none",
                                                        color: "#d32f2f", cursor: "pointer",
                                                        fontSize: "1.1rem", padding: "0"
                                                    }}
                                                    title="Eliminar producto"
                                                >🗑️</button>
                                            </div>
                                            {/* Quantity controls */}
                                            <div style={{
                                                display: "flex", alignItems: "center",
                                                gap: "0.6rem", marginTop: "0.7rem"
                                            }}>
                                                <button
                                                    onClick={() => decreaseQty(item.id)}
                                                    style={{
                                                        width: "30px", height: "30px",
                                                        borderRadius: "50%", border: "1px solid #0288d1",
                                                        backgroundColor: "white", color: "#0288d1",
                                                        fontWeight: "700", cursor: "pointer",
                                                        fontSize: "1rem", display: "flex",
                                                        alignItems: "center", justifyContent: "center"
                                                    }}
                                                >−</button>
                                                <span style={{ fontWeight: "600", minWidth: "20px", textAlign: "center" }}>
                                                    {item.qty}
                                                </span>
                                                <button
                                                    onClick={() => addToCart(item)}
                                                    style={{
                                                        width: "30px", height: "30px",
                                                        borderRadius: "50%", border: "none",
                                                        backgroundColor: "#0288d1", color: "white",
                                                        fontWeight: "700", cursor: "pointer",
                                                        fontSize: "1rem", display: "flex",
                                                        alignItems: "center", justifyContent: "center"
                                                    }}
                                                >+</button>
                                                <span style={{ marginLeft: "auto", fontSize: "0.85rem", color: "#666" }}>
                                                    ₡{item.price.toLocaleString()} c/u
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Cart footer */}
                        {cart.length > 0 && (
                            <div style={{ padding: "1rem 1.2rem", borderTop: "1px solid #e0e0e0" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                                    <span style={{ fontWeight: "600", fontSize: "1rem" }}>Total:</span>
                                    <span style={{ fontWeight: "800", fontSize: "1.2rem", color: "#0288d1" }}>
                                        ₡{totalPrice.toLocaleString()}
                                    </span>
                                </div>
                                <button
                                    onClick={clearCart}
                                    style={{
                                        width: "100%", padding: "0.8rem",
                                        backgroundColor: "#ffebee", color: "#d32f2f",
                                        border: "1px solid #ef9a9a", borderRadius: "8px",
                                        cursor: "pointer", fontWeight: "600", fontSize: "0.95rem",
                                        marginBottom: "0.7rem"
                                    }}
                                >
                                    🗑️ Vaciar carrito
                                </button>
                                <button
                                    style={{
                                        width: "100%", padding: "0.9rem",
                                        backgroundColor: "#0288d1", color: "white",
                                        border: "none", borderRadius: "8px",
                                        cursor: "pointer", fontWeight: "700", fontSize: "1rem"
                                    }}
                                >
                                    ✅ Finalizar compra
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Error state */}
            {error && (
                <div style={{
                    backgroundColor: "#ffebee", color: "#c62828",
                    border: "1px solid #ef9a9a", borderRadius: "8px",
                    padding: "1rem", textAlign: "center", marginBottom: "1.5rem"
                }}>
                    {error}
                </div>
            )}

            {/* Loading state */}
            {isLoading ? (
                <div style={{ textAlign: "center", padding: "3rem", color: "#666" }}>
                    <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⏳</div>
                    Cargando productos...
                </div>
            ) : (
                <>
                    {products.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "3rem", color: "#666" }}>
                            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📦</div>
                            <p>No hay productos disponibles en este momento.</p>
                        </div>
                    ) : (
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                            gap: "1.5rem"
                        }}>
                            {products.map(product => {
                                const inCart = cart.find(i => i.id === product.id);
                                return (
                                    <div key={product.id} style={{
                                        backgroundColor: "white", color: "#333",
                                        border: inCart ? "2px solid #0288d1" : "1px solid #e0e0e0",
                                        borderRadius: "12px", padding: "1.5rem",
                                        textAlign: "center",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                        display: "flex", flexDirection: "column", gap: "0.8rem",
                                        position: "relative"
                                    }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.transform = "translateY(-4px)";
                                            e.currentTarget.style.boxShadow = "0 8px 20px rgba(2,136,209,0.15)";
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.transform = "translateY(0)";
                                            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)";
                                        }}
                                    >
                                        {inCart && (
                                            <span style={{
                                                position: "absolute", top: "10px", right: "10px",
                                                backgroundColor: "#0288d1", color: "white",
                                                borderRadius: "50%", width: "22px", height: "22px",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                fontSize: "0.75rem", fontWeight: "800"
                                            }}>
                                                {inCart.qty}
                                            </span>
                                        )}
                                        <div style={{ fontSize: "3rem" }}>🛍️</div>
                                        <h3 style={{ margin: 0, color: "#0288d1", fontSize: "1.1rem" }}>
                                            {product.name}
                                        </h3>
                                        <p style={{
                                            margin: 0, fontSize: "1.3rem", fontWeight: "700",
                                            color: "#01579b"
                                        }}>
                                            ₡{product.price.toLocaleString()}
                                        </p>
                                        <button
                                            onClick={() => addToCart(product)}
                                            style={{
                                                backgroundColor: "#0288d1", color: "white",
                                                border: "none", borderRadius: "8px",
                                                padding: "0.7rem 1rem", cursor: "pointer",
                                                fontWeight: "600", fontSize: "0.95rem",
                                                transition: "background-color 0.2s"
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#0277bd"}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#0288d1"}
                                        >
                                            + Agregar al carrito
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Shop;
