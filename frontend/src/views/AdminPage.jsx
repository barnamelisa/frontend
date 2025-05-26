import React, { useState } from "react";
import { useAdminPageViewModel } from "../viewmodels/adminPageViewModel";

export default function AdminPage() {
    const {
        users,
        loading,
        error,
        addUser,
        updateUser,
        deleteUser,
        exportToCSV,
        filterRol,
        setFilterRol,
    } = useAdminPageViewModel();

    // stare pentru user nou
    const [newUser, setNewUser] = useState({
        nume_user: "",
        prenume_user: "",
        email: "",
        parola: "",
        nr_telefon: "",
        rol: { id_rol: 2, nume_rol: "user" }, // default rol user, poți ajusta
    });

    // state pentru editare inline: obiect cu id_user ca și cheie
    const [editStates, setEditStates] = useState({});

    // update local edit state când user editează
    const handleEditChange = (id, field, value) => {
        setEditStates((prev) => ({
            ...prev,
            [id]: { ...prev[id], [field]: value },
        }));
    };

    // salvează modificări editate
    const handleSave = (id) => {
        const userToUpdate = editStates[id];
        if (!userToUpdate) return;
        updateUser(userToUpdate);
        setEditStates((prev) => {
            const copy = { ...prev };
            delete copy[id];
            return copy;
        });
    };

    // setează edit state când se apasă edit
    const handleEditClick = (user) => {
        setEditStates((prev) => ({
            ...prev,
            [user.id_user]: { ...user },
        }));
    };

    // formular adăugare user simplificat
    const handleAddUser = async () => {
        if (!newUser.email || !newUser.parola) {
            alert("Email și parola sunt obligatorii");
            return;
        }
        await addUser(newUser);
        setNewUser({
            nume_user: "",
            prenume_user: "",
            email: "",
            parola: "",
            nr_telefon: "",
            rol: { id_rol: 2, nume_rol: "user" },
        });
    };

    if (loading) return <p>Se încarcă utilizatorii...</p>;
    if (error) return <p style={{ color: "red" }}>Eroare: {error}</p>;

    return (
        <div>
            <h2>Administrare Utilizatori</h2>

            <div style={{ marginBottom: 12 }}>
                <label>
                    Filtrează după rol:{" "}
                    <select
                        value={filterRol}
                        onChange={(e) => setFilterRol(e.target.value)}
                    >
                        <option value="ALL">Toți</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                </label>
                <button onClick={exportToCSV} style={{ marginLeft: 12 }}>
                    Export CSV
                </button>
            </div>

            <table border="1" cellPadding={5} style={{ borderCollapse: "collapse" }}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Nume</th>
                    <th>Prenume</th>
                    <th>Email</th>
                    <th>Parola</th>
                    <th>Telefon</th>
                    <th>Rol</th>
                    <th>Acțiuni</th>
                </tr>
                </thead>
                <tbody>
                {users.map((u) => {
                    const isEditing = !!editStates[u.id_user];
                    const userData = isEditing ? editStates[u.id_user] : u;

                    return (
                        <tr key={u.id_user}>
                            <td>{u.id_user}</td>
                            <td>
                                {isEditing ? (
                                    <input
                                        value={userData.nume_user}
                                        onChange={(e) =>
                                            handleEditChange(u.id_user, "nume_user", e.target.value)
                                        }
                                    />
                                ) : (
                                    u.nume_user
                                )}
                            </td>
                            <td>
                                {isEditing ? (
                                    <input
                                        value={userData.prenume_user}
                                        onChange={(e) =>
                                            handleEditChange(u.id_user, "prenume_user", e.target.value)
                                        }
                                    />
                                ) : (
                                    u.prenume_user
                                )}
                            </td>
                            <td>
                                {isEditing ? (
                                    <input
                                        value={userData.email}
                                        onChange={(e) =>
                                            handleEditChange(u.id_user, "email", e.target.value)
                                        }
                                    />
                                ) : (
                                    u.email
                                )}
                            </td>
                            <td>
                                {isEditing ? (
                                    <input
                                        type="password"
                                        value={userData.parola}
                                        onChange={(e) =>
                                            handleEditChange(u.id_user, "parola", e.target.value)
                                        }
                                    />
                                ) : (
                                    "******"
                                )}
                            </td>
                            <td>
                                {isEditing ? (
                                    <input
                                        value={userData.nr_telefon}
                                        onChange={(e) =>
                                            handleEditChange(u.id_user, "nr_telefon", e.target.value)
                                        }
                                    />
                                ) : (
                                    u.nr_telefon
                                )}
                            </td>
                            <td>
                                {isEditing ? (
                                    <select
                                        value={userData.rol?.nume_rol || "user"}
                                        onChange={(e) => {
                                            const rolName = e.target.value;
                                            // Setăm id_rol în funcție de rol (hardcoded)
                                            const rolId = rolName === "admin" ? 1 : 2;
                                            handleEditChange(u.id_user, "rol", {
                                                id_rol: rolId,
                                                nume_rol: rolName,
                                            });
                                        }}
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="user">User</option>
                                    </select>
                                ) : (
                                    u.rol?.nume_rol
                                )}
                            </td>
                            <td>
                                {isEditing ? (
                                    <>
                                        <button onClick={() => handleSave(u.id_user)}>Salvează</button>
                                        <button
                                            onClick={() =>
                                                setEditStates((prev) => {
                                                    const copy = { ...prev };
                                                    delete copy[u.id_user];
                                                    return copy;
                                                })
                                            }
                                        >
                                            Anulează
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleEditClick(u)}>Editează</button>
                                        <button
                                            onClick={() => {
                                                if (
                                                    window.confirm(
                                                        `Ștergi utilizatorul ${u.nume_user} ${u.prenume_user}?`
                                                    )
                                                ) {
                                                    deleteUser(u.id_user);
                                                }
                                            }}
                                        >
                                            Șterge
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    );
                })}

                {/* Form adăugare user nou */}
                <tr>
                    <td>+</td>
                    <td>
                        <input
                            value={newUser.nume_user}
                            onChange={(e) =>
                                setNewUser({ ...newUser, nume_user: e.target.value })
                            }
                            placeholder="Nume"
                        />
                    </td>
                    <td>
                        <input
                            value={newUser.prenume_user}
                            onChange={(e) =>
                                setNewUser({ ...newUser, prenume_user: e.target.value })
                            }
                            placeholder="Prenume"
                        />
                    </td>
                    <td>
                        <input
                            value={newUser.email}
                            onChange={(e) =>
                                setNewUser({ ...newUser, email: e.target.value })
                            }
                            placeholder="Email"
                            type="email"
                        />
                    </td>
                    <td>
                        <input
                            value={newUser.parola}
                            onChange={(e) =>
                                setNewUser({ ...newUser, parola: e.target.value })
                            }
                            placeholder="Parolă"
                            type="password"
                        />
                    </td>
                    <td>
                        <input
                            value={newUser.nr_telefon}
                            onChange={(e) =>
                                setNewUser({ ...newUser, nr_telefon: e.target.value })
                            }
                            placeholder="Telefon"
                        />
                    </td>
                    <td>
                        <select
                            value={newUser.rol?.nume_rol}
                            onChange={(e) => {
                                const rolName = e.target.value;
                                const rolId = rolName === "admin" ? 1 : 2;
                                setNewUser({ ...newUser, rol: { id_rol: rolId, nume_rol: rolName } });
                            }}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </td>
                    <td>
                        <button onClick={handleAddUser}>Adaugă</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}
