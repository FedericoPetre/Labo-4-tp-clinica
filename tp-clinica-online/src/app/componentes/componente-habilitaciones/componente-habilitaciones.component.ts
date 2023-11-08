import { Component, AfterViewInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-componente-habilitaciones',
  templateUrl: './componente-habilitaciones.component.html',
  styleUrls: ['./componente-habilitaciones.component.css']
})
export class ComponenteHabilitacionesComponent implements AfterViewInit {
  obserPersonas$ : any;
  arrayPersonasRegistradas : any;

  especialistasSubscription?: Subscription;

  estadoHabilitado: { [email: string]: boolean } = {};

  ngAfterViewInit(){
    this.obserPersonas$ = this.firebase.retornarUsuarioRegistrados().subscribe((datos)=>{
      this.cargarUsuariosAutorizados(datos);
    });
  }

  ngOnDestroy(){
    if(this.obserPersonas$){
      this.obserPersonas$.unsubscribe();
    }

    if (this.especialistasSubscription) {
      this.especialistasSubscription.unsubscribe();
    }
  }

  constructor(private firebase : FirebaseService){

  }

  cargarUsuariosAutorizados(arrayAux : any[]){
    let arrayNuevo : any[] = [];

    for(let i=0; i<arrayAux.length; i++){

      let objPersona = {
        tipoUsuario: arrayAux[i].tipoUsuario,
        flagEstaHabilitado:arrayAux[i].estaHabilitado,
        nombre:arrayAux[i].nombre,
        email:arrayAux[i].email,
        fotos:arrayAux[i].fotos
      };
  
      arrayNuevo.push(objPersona);
     
    }
    arrayNuevo.sort((a, b) => {
      if (a.tipoUsuario === 'paciente' && b.tipoUsuario === 'especialista') {
          return -1; // 'paciente' antes de 'especialista'
      }
      if (a.tipoUsuario === 'especialista' && b.tipoUsuario === 'paciente') {
          return 1; // 'especialista' después de 'paciente'
      }
      return 0; // No cambian de posición
  });

    this.arrayPersonasRegistradas = arrayNuevo;
  }

  async actualizarHabilitacion(email:string, nuevoEstado : string){
    await this.firebase.actualizarHabilitacionEspecialista(email, nuevoEstado);
  }

}
