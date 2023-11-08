import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-botones-registro',
  templateUrl: './botones-registro.component.html',
  styleUrls: ['./botones-registro.component.css']
})
export class BotonesRegistroComponent {
  constructor(private router : Router){}


  redirigirARegistroPaciente(){
    this.router.navigateByUrl('registro/paciente');
  }

  redirigirARegistroEspecialista(){
    this.router.navigateByUrl('registro/especialista');
  }
}
