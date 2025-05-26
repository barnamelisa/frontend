export class User {
    constructor(data) {
        this.id = data.id_user;
        this.nume = data.nume_user;
        this.prenume = data.prenume_user;
        this.email = data.email;
        this.parola = data.parola;
        this.nrTelefon = data.nr_telefon;

        this.rol = data.rol
            ? {
                id: data.rol.id_rol,
                nume: data.rol.nume_rol
            }
            : null;
    }
}
