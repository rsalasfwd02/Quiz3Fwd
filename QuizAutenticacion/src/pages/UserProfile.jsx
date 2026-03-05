import { useLocation, useNavigate } from "react-router-dom";

function UserProfile() {
    const location = useLocation();
    const navigate = useNavigate();
    const storedUser = localStorage.getItem("user");
    const user = location.state?.user || (storedUser ? JSON.parse(storedUser) : null);

    if (!user) {
        return (
            <div style={{ textAlign: "center", padding: "2rem" }}>
                <p>No has iniciado sesión correctamente.</p>
                <button onClick={() => navigate("/login")} style={{ padding: "0.5rem 1rem", backgroundColor: "#0288d1", color: "white", border: "none", borderRadius: "4px" }}>Ir al Login</button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "500px", margin: "2rem auto", padding: "2rem", border: "1px solid #ddd", borderRadius: "8px", textAlign: "center" }}>
            <h1 style={{ color: "#262980ff" }}>Perfil del Usuario</h1>
            <div style={{ marginTop: "1rem", textAlign: "left" }}>
                <p><strong>Nombre:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Rol:</strong> {user.role}</p>
            </div>
            <button
                onClick={() => navigate("/")}
                style={{ marginTop: "2rem", padding: "0.8rem 1.5rem", backgroundColor: "#666", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
                Cerrar Sesión
            </button>
        </div>
    );
}

export default UserProfile;

