import React, { useState } from "react";

export default function LoginForm({ onLogin, error, onClientClick }) {
    const [email, setEmail] = useState("");
    const [parola, setParola] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(email, parola);
    };

    return (
        <div style={{ maxWidth: "400px", margin: "auto" }}>
            <h2>Autentificare</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Parolă:</label>
                    <input
                        type="password"
                        value={parola}
                        onChange={(e) => setParola(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit">Login</button>
            </form>

            {/* Buton simplu pentru Client */}
            <button onClick={onClientClick} style={{ marginTop: "20px" }}>
                Client
            </button>
        </div>
    );
}
