// App.js

import React, { useState } from "react";
import LoginForm from "./views/LoginForm";
import AdminPage from "./views/AdminPage";

export default function App() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    async function handleLogin(email, parola) {
        try {
            // 1. Autentificare
            const res = await fetch("http://localhost:8085/user/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, parola }),
            });
            if (!res.ok) throw new Error("Autentificare eșuată");

            const { token } = await res.json();
            localStorage.setItem("token", token);

            // 2. Preluare profil user
            const profilRes = await fetch("http://localhost:8085/user/user/profil", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!profilRes.ok) throw new Error("Eroare la preluare profil");

            const userData = await profilRes.json();

            // 3. Verificare rol și setare user
            if (userData.rol?.nume_rol === "ADMINISTRATOR") {
                setUser(userData);
                setError(null);
            } else {
                setError("Nu ai drepturi de administrator");
            }
        } catch (err) {
            setError(err.message);
        }
    }

    function handleLogout() {
        localStorage.removeItem("token");
        setUser(null);
    }

    if (!user) {
        return <LoginForm onLogin={handleLogin} error={error} />;
    }

    return (
        <div>
            <AdminPage user={user} onLogout={handleLogout} />
        </div>
    );
}
