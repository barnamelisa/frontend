import React, { useState } from "react";
import { usePrajituraViewModel } from "../viewmodels/usePrajituraViewModel";

export default function PrajituraList() {
    const { prajituri, loading, error, addPrajitura, deletePrajitura } = usePrajituraViewModel();

    const [newPrajitura, setNewPrajitura] = useState({
        numePrajitura: "",
        descriere: "",
        cofetarieId: "",
        pret: "",
        dataProductie: "",
        dataExpirare: "",
        imagine: ""
    });

    const handleAdd = async () => {
        if (!newPrajitura.numePrajitura.trim()) {
            alert("Numele prăjiturii nu poate fi gol!");
            return;
        }

        await addPrajitura({
            nume_prajitura: newPrajitura.numePrajitura,
            descriere: newPrajitura.descriere,
            cofetarie_id: newPrajitura.cofetarieId,
            pret: newPrajitura.pret,
            data_productie: newPrajitura.dataProductie,
            data_expirare: newPrajitura.dataExpirare,
            imagine: newPrajitura.imagine
        });
    };

    if (loading) return <p>Se încarcă prăjiturile...</p>;
    if (error) return <p style={{ color: "red" }}>Eroare: {error}</p>;

    return (
        <div>
            <h2>Prăjituri</h2>
            <table border="1" cellPadding={5}>
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
                    <th>Acțiuni</th>
                </tr>
                </thead>
                <tbody>
                {prajituri.map((p, idx) => (
                    <tr key={`${p.id}-${idx}`}>
                        <td>{p.id}</td>
                        <td>{p.numePrajitura}</td>
                        <td>{p.descriere}</td>
                        <td>{p.cofetarieId}</td>
                        <td>{p.pret} lei</td>
                        <td>{p.dataProductie}</td>
                        <td>{p.dataExpirare}</td>
                        <td>{p.imagine}</td>
                        <td>
                            <button
                                onClick={() => {
                                    if (window.confirm("Ștergi această prăjitură?")) {
                                        deletePrajitura(p.id);
                                    }
                                }}
                            >
                                Șterge
                            </button>
                        </td>
                    </tr>
                ))}
                <tr>
                    <td>+</td>
                    <td>
                        <input
                            value={newPrajitura.numePrajitura}
                            onChange={(e) =>
                                setNewPrajitura({ ...newPrajitura, numePrajitura: e.target.value })
                            }
                        />
                    </td>
                    <td>
                        <input
                            value={newPrajitura.descriere}
                            onChange={(e) =>
                                setNewPrajitura({ ...newPrajitura, descriere: e.target.value })
                            }
                        />
                    </td>
                    <td>
                        <input
                            type="number"
                            value={newPrajitura.cofetarieId}
                            onChange={(e) =>
                                setNewPrajitura({ ...newPrajitura, cofetarieId: Number(e.target.value) })
                            }
                        />
                    </td>
                    <td>
                        <input
                            type="number"
                            value={newPrajitura.pret}
                            onChange={(e) =>
                                setNewPrajitura({ ...newPrajitura, pret: Number(e.target.value) })
                            }
                        />
                    </td>
                    <td>
                        <input
                            type="date"
                            value={newPrajitura.dataProductie}
                            onChange={(e) =>
                                setNewPrajitura({ ...newPrajitura, dataProductie: e.target.value })
                            }
                        />
                    </td>
                    <td>
                        <input
                            type="date"
                            value={newPrajitura.dataExpirare}
                            onChange={(e) =>
                                setNewPrajitura({ ...newPrajitura, dataExpirare: e.target.value })
                            }
                        />
                    </td>
                    <td>
                        <input
                            value={newPrajitura.imagine}
                            onChange={(e) =>
                                setNewPrajitura({ ...newPrajitura, imagine: e.target.value })
                            }
                        />
                    </td>
                    <td>
                        <button onClick={handleAdd}>Adaugă</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}
