import { useEffect, useState } from "react";
import { Prajitura } from "../models/Prajitura";

export function usePrajituraViewModel() {
    const [prajituri, setPrajituri] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPrajituri = () => {
        setLoading(true);
        fetch("http://localhost:8085/prajitura", {
            method: "GET",
            credentials: "include"
        })
            .then(res => {
                if (!res.ok) throw new Error("Eroare la fetch prăjituri");
                return res.json();
            })
            .then(data => {
                const mapped = data.map(p => new Prajitura(p));
                setPrajituri(mapped);
                setError(null);
            })
            .catch(err => {
                setError(err.message);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchPrajituri();
    }, []);

    async function addPrajitura(prajitura) {
        try {
            const res = await fetch("http://localhost:8085/prajitura", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(prajitura),
            });
            if (!res.ok) throw new Error("Eroare la adăugare prăjitură");

            // așteaptă răspunsul cu obiectul nou
            const created = await res.json();
            console.log("Prăjitură adăugată:", created);
            setPrajituri(prev => [...prev, new Prajitura(created)]);


            // Reîncarcă lista din backend
            fetchPrajituri();
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    }

    async function deletePrajitura(id) {
        try {
            const res = await fetch(`http://localhost:8085/prajitura/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!res.ok) throw new Error("Eroare la ștergere");

            fetchPrajituri();
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    }

    return { prajituri, loading, error, addPrajitura, deletePrajitura };
}
