import { useEffect, useState } from "react";
import { User } from "../models/User";

export function useUserViewModel() {
    const [useri, setUseri] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rolFiltrat, setRolFiltrat] = useState("");

    const fetchUseri = () => {
        setLoading(true);
        fetch("http://localhost:8085/user", {
            method: "GET",
            credentials: "include"
        })
            .then(res => {
                if (!res.ok) throw new Error("Eroare la fetch utilizatori");
                return res.json();
            })
            .then(data => {
                const mapped = data.map(u => new User(u));
                setUseri(mapped);
                setError(null);
            })
            .catch(err => {
                setError(err.message);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchUseri();
    }, []);

    const addUser = async (user) => {
        try {
            const res = await fetch("http://localhost:8085/user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(user)
            });
            if (!res.ok) throw new Error("Eroare la adăugare utilizator");
            const newUser = await res.json();
            setUseri(prev => [...prev, new User(newUser)]);
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    const deleteUser = async (id) => {
        try {
            const res = await fetch(`http://localhost:8085/user/${id}`, {
                method: "DELETE",
                credentials: "include"
            });
            if (!res.ok) throw new Error("Eroare la ștergere utilizator");
            fetchUseri();
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    const updateUser = async (id, updatedUser) => {
        try {
            const res = await fetch(`http://localhost:8085/user/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(updatedUser)
            });
            if (!res.ok) throw new Error("Eroare la actualizare utilizator");
            fetchUseri();
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    const exportCSV = () => {
        const header = "ID,Nume,Prenume,Email,Telefon,Rol\n";
        const rows = useri.map(u =>
            `${u.id},${u.nume},${u.prenume},${u.email},${u.nrTelefon},${u.rol?.nume || ""}`
        );
        const blob = new Blob([header + rows.join("\n")], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "utilizatori.csv";
        link.click();
    };

    const useriFiltrati = rolFiltrat
        ? useri.filter(u => u.rol?.nume === rolFiltrat)
        : useri;

    return {
        useri: useriFiltrati,
        loading,
        error,
        addUser,
        deleteUser,
        updateUser,
        exportCSV,
        setRolFiltrat,
        rolFiltrat
    };
}
