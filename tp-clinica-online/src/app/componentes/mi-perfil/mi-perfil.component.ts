import { Component, AfterViewInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent {
  obserPersonas$ : any;
  usuarioIngresado : any;
  obserEspecialista$ : any;
  especialistaIngresado : any;
  especialidades : any[] =  [];

  obserPaciente$ :any;
  flagEsPaciente: boolean = false;
  flagEsAdmin : boolean = false;

  ngOnInit(){
    if(this.firebase.tipoUsuario =="especialista"){
    this.obserPersonas$ = this.firebase.retornarUsuarioRegistrados().subscribe(datos=>{
      this.cargarUsuario(datos);
    });
  }

    if(this.firebase.tipoUsuario == 'paciente'){
      this.flagEsPaciente = true;
      this.obserPaciente$ = this.firebase.traerPacientesRegistrados().subscribe(datos=>{
        this.encontrarPaciente(datos);
      });
    }else if(this.firebase.tipoUsuario == 'admin'){
      this.flagEsAdmin = true;
      this.obserPaciente$ = this.firebase.traerAdminsRegistrados().subscribe(datos=>{
        this.encontrarAdmin(datos);
      });
    }

  }

  ngOnDestroy(){
    if(this.obserPersonas$){
      this.obserPersonas$.unsubscribe();
    }

    if(this.obserEspecialista$){
      this.obserEspecialista$.unsubscribe();
    }

    if(this.obserPaciente$){
      this.obserPaciente$.unsubscribe();
    }
  }

  constructor(private firebase : FirebaseService){

  }

  cargarUsuario(arrayAux : any[]){
    let arrayNuevo : any[] = [];

    for(let i=0; i<arrayAux.length; i++){

      if(arrayAux[i].email == this.firebase.email){
        const objPersona = {
          tipoUsuario: arrayAux[i].tipoUsuario,
          flagEstaHabilitado:arrayAux[i].estaHabilitado,
          nombre:arrayAux[i].nombre,
          apellido:arrayAux[i].apellido,
          email:arrayAux[i].email,
          fotos:arrayAux[i].fotos
        };
        arrayNuevo.push(objPersona);
      } 
    }

    this.usuarioIngresado = arrayNuevo[0];
    this.obserEspecialista$ = this.firebase.traerEspecialistaPorEmail(this.firebase.email).subscribe(datos=>{
      this.especialistaIngresado = datos[0];
      this.firebase.objUsuarioLogueado = datos[0];
      let especialidadesArray : string[] = this.especialistaIngresado.especialidad.split(',');
      especialidadesArray.forEach((especialidad:string)=>{
        if(especialidad != ""){
          let objEspecialidad = { nombre: especialidad, horarios: [], duracionCadaTurno:0 };

          this.especialidades.push(objEspecialidad);
        }
      });
    });
  }

  encontrarPaciente(arrayAux : any[]){
    if(arrayAux.length>0){
      arrayAux.forEach((dato:any)=>{
        if(dato.email == this.firebase.email){
          this.usuarioIngresado = dato;
          console.log(JSON.stringify(this.usuarioIngresado));
        }
      });
    }
  }

  encontrarAdmin(arrayAux : any[]){
    this.encontrarPaciente(arrayAux);
  }
}
