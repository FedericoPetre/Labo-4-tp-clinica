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

  ngOnInit(){
    this.obserPersonas$ = this.firebase.retornarUsuarioRegistrados().subscribe(datos=>{
      this.cargarUsuario(datos);
    });
  }

  ngOnDestroy(){
    if(this.obserPersonas$){
      this.obserPersonas$.unsubscribe();
    }

    if(this.obserEspecialista$){
      this.obserEspecialista$.unsubscribe();
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
        let objEspecialidad = { nombre: especialidad, horarios: [], duracionCadaTurno:0 };

        this.especialidades.push(objEspecialidad);
      });
    });
  }
}
