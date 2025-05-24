import { useEffect, useState } from "react";
import { Cofetarie } from "../models/Cofetarie";

export function useCofetarieViewModel() {

    console.log("ViewModel loaded");

    const [cofetarii, setCofetarii] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCofetarii = () => {
        setLoading(true);
        fetch("http://localhost:8085/cofetarie", {
            method: "GET",
            credentials: "include"
        })
            .then(res => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then(data => {
                console.log("Fetched cofetarii:", data);
                setCofetarii(data.map(c => new Cofetarie(c)));
                setLoading(false);
                setError(null);
            })
            .catch(err => {
                console.error("Fetch error:", err);
                setError(err.message);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchCofetarii();
    }, []);

    async function addCofetarie(address) {
        try {
            console.log("Sending new address:", address);
            const response = await fetch("http://localhost:8085/cofetarie", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ address }),
                credentials: "include"
            });

            console.log("POST status:", response.status);

            if (!response.ok) throw new Error("Add failed");

            const newCofetarie = await response.json();
            console.log("Added cofetarie response:", newCofetarie);

            fetchCofetarii(); // refetch after add
        } catch (err) {
            console.error("Error in addCofetarie:", err);
        }
    }

    async function updateCofetarie(id, address) {
        try {
            console.log("Updating cofetarie:", id, address);
            const response = await fetch(`http://localhost:8085/cofetarie/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ address }),
                credentials: "include"
            });
            if (!response.ok) throw new Error("Update failed");
            fetchCofetarii();
        } catch (err) {
            console.error("Error in updateCofetarie:", err);
        }
    }

    async function deleteCofetarie(id) {
        try {
            console.log("Deleting cofetarie with id:", id);
            const response = await fetch(`http://localhost:8085/cofetarie/${id}`, {
                method: "DELETE",
                credentials: "include"
            });
            if (!response.ok) throw new Error("Delete failed");
            fetchCofetarii();
        } catch (err) {
            console.error("Error in deleteCofetarie:", err);
        }
    }

    return {
        cofetarii,
        loading,
        error,
        addCofetarie,
        updateCofetarie,
        deleteCofetarie,
    };
}
