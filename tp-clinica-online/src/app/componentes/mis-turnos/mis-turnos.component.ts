import { Component } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.css']
})
export class MisTurnosComponent {

  misTurnos : any[] = [];
  tipoUsuario : string = "";
  flagHayCambio : boolean = false;

  ngOnInit(){
    this.tipoUsuario = this.firebase.tipoUsuario;
  }

  constructor(private firebase : FirebaseService){}

  cargarMisTurnos(turnos : any[]){
    this.misTurnos = turnos;
  }

  avisarCambio(flagHayCambio : any){
    if(flagHayCambio){
      this.flagHayCambio = true;
    }
  }
}
