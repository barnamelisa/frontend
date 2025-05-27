import React, { useState } from "react";
import LoginForm from "./views/LoginForm";
import AdminPage from "./views/AdminPage";
import ClientPage from "./views/ClientPage"; // Componenta client
import ManagerPage from "./views/ManagerPage";
import AngajatPage from "./views/AngajatPage";

export default function App() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [view, setView] = useState("login"); // login, admin, client

    async function handleLogin(email, parola) {
        try {
            const res = await fetch("http://localhost:8085/user/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, parola }),
            });
            if (!res.ok) throw new Error("Autentificare eșuată");

            const { token } = await res.json();
            localStorage.setItem("token", token);

            const profilRes = await fetch("http://localhost:8085/user/user/profil", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!profilRes.ok) throw new Error("Eroare la preluare profil");

            const userData = await profilRes.json();

            // Permitem acces pentru ADMINISTRATOR și MANAGER
            if (userData.rol?.nume_rol === "ADMINISTRATOR") {
                setUser(userData);
                setError(null);
                setView("admin");
            } else if (userData.rol?.nume_rol === "MANAGER") {
                setUser(userData);
                setError(null);
                setView("manager");  // Trebuie să adaugi și componenta ManagerPage în App pentru acest view
            } else if (userData.rol?.nume_rol === "ANGAJAT") {
                setUser(userData);
                setError(null);
                setView("angajat");  // Nou view pentru angajat
            } else {
                setError("Nu ai drepturi de administrator sau manager");
            }
        } catch (err) {
            setError(err.message);
        }
    }

    function handleLogout() {
        localStorage.removeItem("token");
        setUser(null);
        setView("login");
    }

    if (view === "admin" && user) {
        return <AdminPage user={user} onLogout={handleLogout} />;
    }

    if (view === "client") {
        return <ClientPage onBack={() => setView("login")} />;
    }

    if (view === "manager" && user) {
        return <ManagerPage user={user} onLogout={handleLogout} />;
    }

    if (view === "angajat" && user) {
        return <AngajatPage user={user} onLogout={handleLogout} />;
    }


    return (
        <LoginForm
            onLogin={handleLogin}
            error={error}
            onClientClick={() => setView("client")}
        />
    );
}
