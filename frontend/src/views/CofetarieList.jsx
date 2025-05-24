import React, { useState } from "react";
import { useCofetarieViewModel } from "../viewmodels/useCofetarieViewModel";

export default function CofetarieList() {
    const {
        cofetarii,
        loading,
        error,
        addCofetarie,
        updateCofetarie,
        deleteCofetarie,
    } = useCofetarieViewModel();

    const [newAddress, setNewAddress] = useState("");
    const [editId, setEditId] = useState(null);
    const [editAddress, setEditAddress] = useState("");

    if (loading) return <p>Se încarcă...</p>;
    if (error) return <p style={{ color: "red" }}>Eroare: {error}</p>;

    const startEdit = (id, address) => {
        setEditId(id);
        setEditAddress(address);
    };

    const cancelEdit = () => {
        setEditId(null);
        setEditAddress("");
    };

    const saveEdit = async (id) => {
        if (!editAddress.trim()) {
            alert("Adresa nu poate fi goală!");
            return;
        }
        await updateCofetarie(id, editAddress);
        cancelEdit();
    };

    const handleAdd = async () => {
        if (!newAddress.trim()) {
            alert("Adresa nu poate fi goală!");
            return;
        }
        console.log("Handle Add:", newAddress);
        await addCofetarie(newAddress);
        setNewAddress("");
    };

    return (
        <div>
            <h2>Cofetării</h2>
            <table border="1" cellPadding={5} cellSpacing={0}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Adresă Cofetărie</th>
                    <th>Acțiuni</th>
                </tr>
                </thead>
                <tbody>
                {cofetarii.map((c) => {
                    console.log("Rendering row:", c);
                    return (
                        <tr key={c.id}>
                            <td>{c.id}</td>
                            <td>
                                {editId === c.id ? (
                                    <input
                                        value={editAddress}
                                        onChange={(e) => setEditAddress(e.target.value)}
                                    />
                                ) : (
                                    c.address
                                )}
                            </td>
                            <td>
                                {editId === c.id ? (
                                    <>
                                        <button onClick={() => saveEdit(c.id)}>Salvează</button>
                                        <button onClick={cancelEdit}>Anulează</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => startEdit(c.id, c.address)}>Editează</button>
                                        <button onClick={async () => {
                                            if (window.confirm("Ștergi această cofetărie?")) {
                                                await deleteCofetarie(c.id);
                                            }
                                        }}>
                                            Șterge
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    );
                })}
                <tr>
                    <td>+</td>
                    <td>
                        <input
                            value={newAddress}
                            placeholder="Adaugă adresă nouă"
                            onChange={(e) => setNewAddress(e.target.value)}
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
