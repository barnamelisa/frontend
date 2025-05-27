import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAdminPageViewModel } from "../viewmodels/adminPageViewModel";

export default function AdminPage({ user, onLogout }) {
    const { t, i18n } = useTranslation();

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

    const [newUser, setNewUser] = useState({
        nume_user: "",
        prenume_user: "",
        email: "",
        parola: "",
        nr_telefon: "",
        rol: { id_rol: 2, nume_rol: "user" },
    });

    const [editStates, setEditStates] = useState({});

    const handleEditChange = (id, field, value) => {
        setEditStates((prev) => ({
            ...prev,
            [id]: { ...prev[id], [field]: value },
        }));
    };

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

    const handleEditClick = (user) => {
        setEditStates((prev) => ({
            ...prev,
            [user.id_user]: { ...user },
        }));
    };

    const handleAddUser = async () => {
        if (!newUser.email || !newUser.parola) {
            alert(t("admin.required_fields"));
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

    if (loading) return <p>{t("admin.loading")}</p>;
    if (error) return <p style={{ color: "red" }}>{t("admin.error", { error })}</p>;

    return (
        <div>
            <div style={{ marginBottom: 12 }}>
                <button onClick={() => i18n.changeLanguage("ro")}>🇷🇴</button>
                <button onClick={() => i18n.changeLanguage("en")}>🇬🇧</button>
                <button onClick={() => i18n.changeLanguage("fr")}>🇫🇷</button>
            </div>

            <button onClick={onLogout} style={{ marginBottom: "20px" }}>
                {t("logout")}
            </button>

            <h2>{t("admin.title")}</h2>

            <div style={{ marginBottom: 12 }}>
                <label>
                    {t("admin.filter_role")}
                    <select value={filterRol} onChange={(e) => setFilterRol(e.target.value)}>
                        <option value="ALL">{t("admin.all")}</option>
                        <option value="admin">{t("admin.admin")}</option>
                        <option value="user">{t("admin.user")}</option>
                    </select>
                </label>
                <button onClick={exportToCSV} style={{ marginLeft: 12 }}>
                    {t("admin.export")}
                </button>
            </div>

            <table border="1" cellPadding={5} style={{ borderCollapse: "collapse" }}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>{t("admin.form.name")}</th>
                    <th>{t("admin.form.surname")}</th>
                    <th>{t("admin.form.email")}</th>
                    <th>{t("admin.form.password")}</th>
                    <th>{t("admin.form.phone")}</th>
                    <th>{t("admin.form.role")}</th>
                    <th>{t("admin.actions")}</th>
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
                                            const rolId = rolName === "admin" ? 1 : 2;
                                            handleEditChange(u.id_user, "rol", {
                                                id_rol: rolId,
                                                nume_rol: rolName,
                                            });
                                        }}
                                    >
                                        <option value="admin">{t("admin.admin")}</option>
                                        <option value="user">{t("admin.user")}</option>
                                    </select>
                                ) : (
                                    u.rol?.nume_rol
                                )}
                            </td>
                            <td>
                                {isEditing ? (
                                    <>
                                        <button onClick={() => handleSave(u.id_user)}>{t("admin.save")}</button>
                                        <button
                                            onClick={() =>
                                                setEditStates((prev) => {
                                                    const copy = { ...prev };
                                                    delete copy[u.id_user];
                                                    return copy;
                                                })
                                            }
                                        >
                                            {t("admin.cancel")}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleEditClick(u)}>{t("admin.edit")}</button>
                                        <button
                                            onClick={() => {
                                                if (
                                                    window.confirm(
                                                        t("admin.confirm_delete", {
                                                            name: u.nume_user,
                                                            surname: u.prenume_user,
                                                        })
                                                    )
                                                ) {
                                                    deleteUser(u.id_user);
                                                }
                                            }}
                                        >
                                            {t("admin.delete")}
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
                            value={newUser.nume_user}
                            onChange={(e) =>
                                setNewUser({ ...newUser, nume_user: e.target.value })
                            }
                            placeholder={t("admin.form.name")}
                        />
                    </td>
                    <td>
                        <input
                            value={newUser.prenume_user}
                            onChange={(e) =>
                                setNewUser({ ...newUser, prenume_user: e.target.value })
                            }
                            placeholder={t("admin.form.surname")}
                        />
                    </td>
                    <td>
                        <input
                            type="email"
                            value={newUser.email}
                            onChange={(e) =>
                                setNewUser({ ...newUser, email: e.target.value })
                            }
                            placeholder={t("admin.form.email")}
                        />
                    </td>
                    <td>
                        <input
                            type="password"
                            value={newUser.parola}
                            onChange={(e) =>
                                setNewUser({ ...newUser, parola: e.target.value })
                            }
                            placeholder={t("admin.form.password")}
                        />
                    </td>
                    <td>
                        <input
                            value={newUser.nr_telefon}
                            onChange={(e) =>
                                setNewUser({ ...newUser, nr_telefon: e.target.value })
                            }
                            placeholder={t("admin.form.phone")}
                        />
                    </td>
                    <td>
                        <select
                            value={newUser.rol.nume_rol}
                            onChange={(e) => {
                                const rolName = e.target.value;
                                const rolId = rolName === "admin" ? 1 : 2;
                                setNewUser({
                                    ...newUser,
                                    rol: { id_rol: rolId, nume_rol: rolName },
                                });
                            }}
                        >
                            <option value="user">{t("admin.user")}</option>
                            <option value="admin">{t("admin.admin")}</option>
                        </select>
                    </td>
                    <td>
                        <button onClick={handleAddUser}>{t("admin.add_user")}</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}
