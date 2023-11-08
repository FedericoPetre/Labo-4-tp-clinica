import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {

  constructor(private router : Router){

  }

  redirigirARegistroPaciente(){
    this.router.navigateByUrl('registro/paciente');
  }

  redirigirARegistroEspecialista(){
    this.router.navigateByUrl('registro/especialista');
  }

}
