export class Persona {
    nombre : string;
    apellido : string;
    edad : number;
    dni : number;
    email : string;
    clave : string;

    constructor(nombre : string, apellido : string, edad : number, dni : number, email : string, clave : string){
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
        this.dni = dni;
        this.email = email;
        this.clave = clave;
    }
}
