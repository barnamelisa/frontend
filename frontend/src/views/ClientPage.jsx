import React, { useState, useEffect } from "react";
import { usePrajituraViewModel } from "../viewmodels/usePrajituraViewModel";
import { useTranslation } from "react-i18next";

export default function ClientPage({ onBack }) {
    const { prajituri, loading, error } = usePrajituraViewModel();

    const [filteredPrajituri, setFilteredPrajituri] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showNeexpirate, setShowNeexpirate] = useState(false);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        let list = prajituri;

        if (showNeexpirate) {
            const azi = new Date();
            list = list.filter((p) => {
                if (!p.dataExpirare) return false;
                const expDate = new Date(p.dataExpirare);
                return expDate >= azi;
            });
        }

        if (searchTerm.trim() !== "") {
            list = list.filter((p) =>
                p.numePrajitura?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredPrajituri(list);
    }, [prajituri, searchTerm, showNeexpirate]);

    if (loading) return <p>Se încarcă prăjiturile...</p>;
    if (error) return <p style={{ color: "red" }}>Eroare: {error}</p>;

    return (
        <div>
            <h2>Prăjituri</h2>

            <div style={{ marginBottom: "10px" }}>
                <button onClick={() => i18n.changeLanguage("ro")}>Română</button>
                <button onClick={() => i18n.changeLanguage("en")}>English</button>
                <button onClick={() => i18n.changeLanguage("fr")}>Français</button>
            </div>
            <input
                type="text"
                placeholder="Caută prăjitură după nume"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: "10px", padding: "5px" }}
            />

            <button
                onClick={() => setShowNeexpirate(!showNeexpirate)}
                style={{ marginLeft: "10px" }}
            >
                {showNeexpirate ? "Arată toate prăjiturile" : "Arată doar prăjiturile neexpirate"}
            </button>

            {filteredPrajituri.length === 0 && <p>Nu s-au găsit prăjituri.</p>}

            <table border="1" cellPadding={5} style={{ marginTop: "10px", width: "100%" }}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Nume</th>
                    <th>Descriere</th>
                    <th>Cofetărie</th>
                    <th>Preț</th>
                    <th>Produs</th>
                    <th>Expirare</th>
                    <th>Imagine</th>
                </tr>
                </thead>
                <tbody>
                {filteredPrajituri.map((p) => (
                    <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.numePrajitura}</td>
                        <td>{p.descriere}</td>
                        <td>{p.cofetarieId}</td>
                        <td>{p.pret} lei</td>
                        <td>{p.dataProductie}</td>
                        <td>{p.dataExpirare}</td>
                        <td>
                            {p.imagine ? (
                                <img src={p.imagine} alt={p.numePrajitura} style={{ width: "100px" }} />
                            ) : (
                                "Fără imagine"
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <button onClick={onBack} style={{ marginTop: "20px" }}>
                Înapoi
            </button>
        </div>
    );
}
