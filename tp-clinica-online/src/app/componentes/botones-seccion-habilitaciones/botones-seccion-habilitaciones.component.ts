import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-botones-seccion-habilitaciones',
  templateUrl: './botones-seccion-habilitaciones.component.html',
  styleUrls: ['./botones-seccion-habilitaciones.component.css']
})
export class BotonesSeccionHabilitacionesComponent {
  constructor(private router : Router){}


  redirigirARegistroPaciente(){
    this.router.navigateByUrl('registro/paciente');
  }

  redirigirARegistroEspecialista(){
    this.router.navigateByUrl('registro/especialista');
  }

  redirigirARegistroAdministrador(){
    this.router.navigateByUrl('registro/admin');
  }
}
