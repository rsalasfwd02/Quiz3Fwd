import { Link } from "react-router-dom";

function Home() {
    return (
        <div style={{ textAlign: "center", padding: "2rem" }}>
            <header style={{ backgroundColor: "#331f7bff", color: "white", padding: "3rem", borderRadius: "8px" }}>
                <h1>Supermercado FWD</h1>
                <p>Calidad y frescura al mejor precio</p>
            </header>

            <section style={{ marginTop: "2rem" }}>
                <h2>Lo que ofrecemos</h2>
                <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginTop: "1rem" }}>
                    <div style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "8px", width: "200px" }}>
                        <h3>Frutas y Verduras</h3>
                        <p>Siempre frescas del campo.</p>
                    </div>
                    <div style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "8px", width: "200px" }}>
                        <h3>Productos</h3>
                        <p>Todo lo que necesitas para tu hogar.</p>
                    </div>
                    <div style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "8px", width: "200px" }}>
                        <h3>Carniceria</h3>
                        <p>Cortes de la mejor calidad.</p>
                    </div>
                </div>
            </section>

            <div style={{ marginTop: "3rem" }}>
                <Link to="/shop" style={{ backgroundColor: "#0288d1", color: "white", padding: "1rem 2rem", textDecoration: "none", borderRadius: "8px", fontSize: "1.2rem", fontWeight: "600" }}>
                    ¡Empieza a comprar ahora!
                </Link>
            </div>
        </div>
    );
}

export default Home;
