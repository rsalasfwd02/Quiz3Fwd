import { Link } from "react-router-dom";
import { useState } from "react";

function Navbar({ user, onLogout }: { user: any, onLogout: () => void }) {
    const [hoveredLink, setHoveredLink] = useState(null);

    const navStyle = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.75rem 2rem",
        backgroundColor: "#0288d1",
        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
        width: "100%",
        boxSizing: "border-box" as const,
        position: "sticky" as const,
        top: 0,
        zIndex: 1000,
        color: "white"
    };

    const logoStyle = {
        fontSize: "1.5rem",
        fontWeight: "bold",
        textDecoration: "none",
        color: "white",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem"
    };

    const navLinksStyle = {
        display: "flex",
        gap: "1.2rem",
        listStyle: "none",
        margin: 0,
        padding: 0,
        alignItems: "center"
    };

    const getLinkStyle = (linkId) => ({
        textDecoration: "none",
        color: "white",
        fontSize: "0.95rem",
        fontWeight: "500",
        transition: "all 0.3s ease",
        opacity: hoveredLink === linkId ? 1 : 0.85,
        transform: hoveredLink === linkId ? "translateY(-1px)" : "none",
        borderBottom: hoveredLink === linkId ? "2px solid white" : "2px solid transparent",
        paddingBottom: "2px"
    });

    const buttonStyle = (linkId) => ({
        ...getLinkStyle(linkId),
        background: "none",
        border: "none",
        cursor: "pointer",
        fontFamily: "inherit",
        padding: 0
    });

    return (
        <nav style={navStyle}>
            <Link to="/" style={logoStyle}>
                <span style={{ fontSize: "1.8rem" }}>🛒</span>
                <span>Supermercado FWD</span>
            </Link>

            <ul style={navLinksStyle}>
                <li>
                    <Link
                        to="/"
                        style={getLinkStyle('home')}
                        onMouseEnter={() => setHoveredLink('home')}
                        onMouseLeave={() => setHoveredLink(null)}
                    >
                        Inicio
                    </Link>
                </li>
                {!user ? (
                    <li>
                        <Link
                            to="/login"
                            style={getLinkStyle('login')}
                            onMouseEnter={() => setHoveredLink('login')}
                            onMouseLeave={() => setHoveredLink(null)}
                        >
                            Acceso
                        </Link>
                    </li>
                ) : (
                    <>
                        {user.role === "cliente" && (
                            <li>
                                <Link
                                    to="/shop"
                                    style={getLinkStyle('shop')}
                                    onMouseEnter={() => setHoveredLink('shop')}
                                    onMouseLeave={() => setHoveredLink(null)}
                                >
                                    Comprar
                                </Link>
                            </li>
                        )}
                        {user.role === "admin" && (
                            <li>
                                <Link
                                    to="/admin"
                                    style={getLinkStyle('admin')}
                                    onMouseEnter={() => setHoveredLink('admin')}
                                    onMouseLeave={() => setHoveredLink(null)}
                                >
                                    Admin
                                </Link>
                            </li>
                        )}
                        <li>
                            <Link
                                to="/user"
                                style={getLinkStyle('profile')}
                                onMouseEnter={() => setHoveredLink('profile')}
                                onMouseLeave={() => setHoveredLink(null)}
                            >
                                Mi Perfil
                            </Link>
                        </li>
                        <li>
                            <button
                                onClick={onLogout}
                                style={buttonStyle('logout')}
                                onMouseEnter={() => setHoveredLink('logout')}
                                onMouseLeave={() => setHoveredLink(null)}
                            >
                                Cerrar Sesión
                            </button>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;
