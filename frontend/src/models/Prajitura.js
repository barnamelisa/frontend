export class Prajitura {
    constructor(data) {
        this.id = data.prajitura_id;
        this.numePrajitura = data.nume_prajitura;
        this.descriere = data.descriere;
        this.cofetarieId = data.cofetarie_id;
        this.pret = data.pret;
        this.dataProductie = data.data_productie;
        this.dataExpirare = data.data_expirare;
        this.imagine = data.imagine;
    }
}

