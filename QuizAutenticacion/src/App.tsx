import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserProfile from "./pages/UserProfile";
import Shop from "./pages/Shop";

import "./App.css";

function App() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Check localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
    };

    return (
        <>
            <Navbar user={user} onLogout={handleLogout} />
            <div className="main-container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login onLogin={(userData) => setUser(userData)} />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/user" element={<UserProfile />} />
                    <Route path="/shop" element={<Shop />} />
                </Routes>
            </div>
        </>
    );
}

export default App;
