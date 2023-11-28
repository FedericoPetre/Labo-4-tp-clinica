import { Component } from '@angular/core';

@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.css']
})
export class MisTurnosComponent {

  misTurnos : any[] = [];

  cargarMisTurnos(turnos : any[]){
    this.misTurnos = turnos;
  }
}
