import { Persona } from "./persona";

export class Paciente extends Persona {
    obraSocial : string;
    imagenesPerfil : any[];

    constructor(nombre : string, apellido : string, edad : number, dni : number, email : string, clave : string, obraSocial :string, imagenesPerfil : any[]){
        super(nombre, apellido, edad, dni, email, clave);
        this.obraSocial = obraSocial;
        this.imagenesPerfil = imagenesPerfil;
    }
}
