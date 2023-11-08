import { Persona } from "./persona";
export class Especialista extends Persona {
    especialidad : string;
    imagenPerfil : any;

    
    constructor(nombre : string, apellido : string, edad : number, dni : number, email : string, clave : string, especialidad :string, imagenPerfil : any){
        super(nombre, apellido, edad, dni, email, clave);
        this.especialidad = especialidad;
        this.imagenPerfil = imagenPerfil;
    }
}
