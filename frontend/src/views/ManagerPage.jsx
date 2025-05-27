import React, {useEffect, useState} from "react";
import { usePrajituraViewModel } from "../viewmodels/usePrajituraViewModel";
import { saveAs } from "file-saver";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

function toCSV(data) {
    if (!data.length) return "";
    const headers = Object.keys(data[0]);
    const rows = data.map((row) =>
        headers.map((h) => `"${row[h]}"`).join(",")
    );
    return [headers.join(","), ...rows].join("\n");
}
function toXML(data) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?><prajituri>';
    data.forEach((p) => {
        xml += "<prajitura>";
        Object.entries(p).forEach(([key, val]) => {
            xml += `<${key}>${val}</${key}>`;
        });
        xml += "</prajitura>";
    });
    xml += "</prajituri>";
    return xml;
}

function toDOC(data) {
    let html = "<html><body><table border='1'><tr>";
    Object.keys(data[0]).forEach((key) => {
        html += `<th>${key}</th>`;
    });
    html += "</tr>";
    data.forEach((row) => {
        html += "<tr>";
        Object.values(row).forEach((val) => {
            html += `<td>${val}</td>`;
        });
        html += "</tr>";
    });
    html += "</table></body></html>";
    return new Blob([html], { type: "application/msword" });
}

export default function ManagerPage() {
    const { prajituri, loading, error, addPrajitura, deletePrajitura } = usePrajituraViewModel();

    const [searchTerm, setSearchTerm] = useState("");
    const [showNeexpirate, setShowNeexpirate] = useState(false);
    const [showExpired, setShowExpired] = useState(false);
    const [filteredPrajituri, setFilteredPrajituri] = useState([]);

    const [newPrajitura, setNewPrajitura] = useState({
        numePrajitura: "",
        descriere: "",
        cofetarieId: "",
        pret: "",
        dataProductie: "",
        dataExpirare: "",
        imagine: ""
    });

    useEffect(() => {
        let list = prajituri;
        const azi = new Date();

        if (showExpired) {
            list = list.filter(
                (p) => p.dataExpirare && new Date(p.dataExpirare) < azi
            );
        } else if (showNeexpirate) {
            list = list.filter(
                (p) => p.dataExpirare && new Date(p.dataExpirare) >= azi
            );
        }

        if (searchTerm.trim() !== "") {
            list = list.filter((p) =>
                p.numePrajitura?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredPrajituri(list);
    }, [prajituri, searchTerm, showNeexpirate, showExpired]);

    // Export general
    const exportData = (format) => {
        if (filteredPrajituri.length === 0) {
            alert("Nu există date de exportat!");
            return;
        }

        if (format === "csv") {
            const csv = toCSV(filteredPrajituri);
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            saveAs(blob, "prajituri.csv");
        } else if (format === "json") {
            const json = JSON.stringify(filteredPrajituri, null, 2);
            const blob = new Blob([json], { type: "application/json" });
            saveAs(blob, "prajituri.json");
        } else if (format === "xml") {
            const xml = toXML(filteredPrajituri);
            const blob = new Blob([xml], { type: "text/xml" });
            saveAs(blob, "prajituri.xml");
        } else if (format === "doc") {
            const docBlob = toDOC(filteredPrajituri);
            saveAs(docBlob, "prajituri.doc");
        }
    };

    // Export prajituri expirate
    const exportExpiredToWord = () => {
        const azi = new Date();
        const expired = prajituri.filter(
            (p) => p.dataExpirare && new Date(p.dataExpirare) < azi
        );
        if (expired.length === 0) {
            alert("Nu există prăjituri expirate nevândute.");
            return;
        }
        const docBlob = toDOC(expired);
        saveAs(docBlob, "prajituri_expirate.doc");
    };

    // --- Statistici (ex: număr prăjituri per cofetărie) ---
    const stats = prajituri.reduce((acc, p) => {
        acc[p.cofetarieId] = (acc[p.cofetarieId] || 0) + 1;
        return acc;
    }, {});

    const statsData = Object.entries(stats).map(([cofetarieId, count]) => ({
        cofetarieId,
        count,
    }));

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

            {/* FILTRARE */}
            <input
                type="text"
                placeholder="Caută prăjitură după nume"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: "10px", padding: "5px" }}
            />
            <button onClick={() => setShowNeexpirate(!showNeexpirate)}>
                {showNeexpirate ? "Arată toate prăjiturile" : "Arată doar prăjiturile neexpirate"}
            </button>
            <button onClick={() => setShowExpired(!showExpired)} style={{ marginLeft: "10px" }}>
                {showExpired ? "Arată toate prăjiturile" : "Arată doar prăjiturile expirate"}
            </button>

            {/* EXPORT */}
            <div style={{ marginTop: "10px" }}>
                <button onClick={() => exportData("csv")}>Export CSV</button>
                <button onClick={() => exportData("json")}>Export JSON</button>
                <button onClick={() => exportData("xml")}>Export XML</button>
                <button onClick={() => exportData("doc")}>Export DOC</button>
                <button onClick={exportExpiredToWord} style={{ marginLeft: "20px" }}>
                    Export prăjituri expirate în Word
                </button>
            </div>

            {/* TABEL prajituri filtrate */}
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
                    <th>Acțiuni</th>
                </tr>
                </thead>
                <tbody>
                {filteredPrajituri.map((p, idx) => (
                    <tr key={`${p.id}-${idx}`}>
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
                            value={newPrajitura.cofetarieId}
                            onChange={(e) =>
                                setNewPrajitura({ ...newPrajitura, cofetarieId: e.target.value })
                            }
                        />
                    </td>
                    <td>
                        <input
                            type="number"
                            value={newPrajitura.pret}
                            onChange={(e) =>
                                setNewPrajitura({ ...newPrajitura, pret: e.target.value })
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
                            type="text"
                            placeholder="URL imagine"
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

            {/* Grafic simplu */}
            <div style={{ width: "100%", height: 300, marginTop: "20px" }}>
                <h3>Statistici prăjituri pe cofetărie</h3>
                <ResponsiveContainer>
                    <BarChart data={statsData}>
                        <XAxis dataKey="cofetarieId" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
