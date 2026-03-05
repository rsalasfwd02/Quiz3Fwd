import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Login state
    const [loginForm, setLoginForm] = useState({ email: "", password: "", role: "cliente" });

    // Register state
    const [registerForm, setRegisterForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "cliente"
    });

    const handleLoginChange = (e) => {
        setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
        setError("");
    };

    const handleRegisterChange = (e) => {
        setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
        setError("");
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            const email = loginForm.email.trim().toLowerCase();
            const password = loginForm.password.trim();

            // We fetch by email only because json-server filtering by password is inconsistent
            const response = await fetch(`http://localhost:3000/users?email=${encodeURIComponent(email)}`);
            if (!response.ok) throw new Error("Error de conexión con el servidor.");

            const users = await response.json();

            // Find user with matching password and role in JS
            const user = users.find(u => u.password === password && u.role === loginForm.role);

            if (user) {
                localStorage.setItem("user", JSON.stringify(user));
                onLogin(user);
                alert(`¡Bienvenido de nuevo, ${user.name}!`);
                if (user.role === "admin") {
                    navigate("/admin");
                } else {
                    navigate("/user", { state: { user } });
                }
            } else {
                setError("Correo o contraseña incorrectos. Por favor, verifica tus datos.");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("No se pudo conectar con el servidor. Verifica que el backend esté encendido.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const userData = {
                ...registerForm,
                name: registerForm.name.trim(),
                email: registerForm.email.trim().toLowerCase(),
                password: registerForm.password.trim()
            };

            if (userData.password.length < 4) {
                throw new Error("La contraseña debe tener al menos 4 caracteres.");
            }

            // Check if user exists
            const checkRes = await fetch(`http://localhost:3000/users?email=${encodeURIComponent(userData.email)}`);
            const existingUsers = await checkRes.json();
            if (existingUsers.length > 0) {
                throw new Error("Este correo ya está registrado.");
            }

            const response = await fetch("http://localhost:3000/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                const newUser = { ...userData, id: (await response.json()).id };
                localStorage.setItem("user", JSON.stringify(newUser));
                onLogin(newUser);
                alert("¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.");
                navigate("/user", { state: { user: newUser } });
            } else {
                throw new Error("Error al registrar el usuario.");
            }
        } catch (err) {
            setError(err.message || "Error al registrar. Inténtalo de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle = {
        padding: "0.8rem",
        borderRadius: "4px",
        border: "1px solid #ccc",
        fontSize: "1rem",
        width: "100%",
        boxSizing: "border-box",
        color: "#333",
        backgroundColor: "white"
    };

    const btnStyle = {
        padding: "1rem",
        backgroundColor: isLoading ? "#aaa" : "#0288d1",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: isLoading ? "not-allowed" : "pointer",
        fontSize: "1rem",
        fontWeight: "bold",
        transition: "background-color 0.3s"
    };

    return (
        <div style={{ maxWidth: "420px", margin: "3rem auto", padding: "2.5rem", border: "1px solid #eee", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", backgroundColor: "white" }}>
            <h2 style={{ textAlign: "center", color: "#0288d1", marginBottom: "1.5rem" }}>
                {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
            </h2>

            {error && (
                <div style={{ padding: "0.8rem", backgroundColor: "#ffebee", color: "#c62828", borderRadius: "4px", marginBottom: "1rem", fontSize: "0.9rem", textAlign: "center", border: "1px solid #ef9a9a" }}>
                    {error}
                </div>
            )}

            {isLogin ? (
                <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                        <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#555" }}>Correo Electrónico</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="ejemplo@correo.com"
                            value={loginForm.email}
                            onChange={handleLoginChange}
                            required
                            disabled={isLoading}
                            style={inputStyle}
                        />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                        <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#555" }}>Contraseña</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={loginForm.password}
                            onChange={handleLoginChange}
                            required
                            disabled={isLoading}
                            style={inputStyle}
                        />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#555" }}>Ingresar como:</label>
                        <select
                            name="role"
                            value={loginForm.role}
                            onChange={handleLoginChange}
                            disabled={isLoading}
                            style={{ ...inputStyle, backgroundColor: "white" }}
                        >
                            <option value="cliente">Cliente</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>
                    <button type="submit" disabled={isLoading} style={btnStyle}>
                        {isLoading ? "Entrando..." : "Entrar"}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleRegisterSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                        <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#555" }}>Nombre Completo</label>
                        <input
                            name="name"
                            placeholder="Tu nombre"
                            value={registerForm.name}
                            onChange={handleRegisterChange}
                            required
                            disabled={isLoading}
                            style={inputStyle}
                        />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                        <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#555" }}>Correo Electrónico</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="tu@correo.com"
                            value={registerForm.email}
                            onChange={handleRegisterChange}
                            required
                            disabled={isLoading}
                            style={inputStyle}
                        />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                        <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#555" }}>Contraseña (mín. 4 caracteres)</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={registerForm.password}
                            onChange={handleRegisterChange}
                            required
                            disabled={isLoading}
                            style={inputStyle}
                        />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#555" }}>Seleccionar Rol:</label>
                        <select
                            name="role"
                            value={registerForm.role}
                            onChange={handleRegisterChange}
                            disabled={isLoading}
                            style={{ ...inputStyle, backgroundColor: "white" }}
                        >
                            <option value="cliente">Cliente</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>
                    <button type="submit" disabled={isLoading} style={{ ...btnStyle, backgroundColor: isLoading ? "#aaa" : "#331f7bff" }}>
                        {isLoading ? "Registrando..." : "Registrarse"}
                    </button>
                </form>
            )}

            <div style={{ textAlign: "center", marginTop: "1.8rem" }}>
                <button
                    onClick={() => {
                        setIsLogin(!isLogin);
                        setError("");
                    }}
                    disabled={isLoading}
                    style={{ background: "none", border: "none", color: "#1976d2", cursor: "pointer", textDecoration: "underline", fontSize: "0.95rem" }}
                >
                    {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia Sesión"}
                </button>
            </div>
        </div>
    );
}

export default Login;
