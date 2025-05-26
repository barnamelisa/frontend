import { useEffect, useState } from "react";

export function useAdminPageViewModel() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterRol, setFilterRol] = useState("ALL");

    const BASE_URL = "http://localhost:8085/user/user";

    const fetchUsers = () => {
        setLoading(true);
        const token = localStorage.getItem("token");

        fetch("http://localhost:8085/user/user", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Eroare la preluarea utilizatorilor");
                return res.json();
            })
            .then((data) => {
                setUsers(data);
                setError(null);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    };


    useEffect(() => {
        fetchUsers();
    }, []);

    const addUser = async (user) => {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8085/user/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(user),
        });
        if (!res.ok) throw new Error("Eroare la adăugare user");
        fetchUsers();
    };


    const updateUser = async (user) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:8085/user/user/${user.id_user}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(user),
        });
        if (!res.ok) throw new Error("Eroare la actualizare user");
        alert(`Utilizatorul ${user.email} a fost notificat (simulare)!`);
        fetchUsers();
    };



    const deleteUser = async (id) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:8085/user/user/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!res.ok) throw new Error("Eroare la ștergere user");
        fetchUsers();
    };



    const exportToCSV = () => {
        const header = "ID,Nume,Prenume,Email,Telefon,Rol\n";
        const rows = users
            .map((u) =>
                [u.id_user, u.nume_user, u.prenume_user, u.email, u.nr_telefon, u.rol?.nume_rol].join(",")
            )
            .join("\n");
        const blob = new Blob([header + rows], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "users.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    const filteredUsers =
        filterRol === "ALL"
            ? users
            : users.filter((u) => u.rol?.nume_rol?.toLowerCase() === filterRol.toLowerCase());

    return {
        users: filteredUsers,
        loading,
        error,
        addUser,
        updateUser,
        deleteUser,
        exportToCSV,
        filterRol,
        setFilterRol,
    };
}
