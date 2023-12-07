import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NotificacionService } from 'src/app/servicios/notificacion.service';

@Component({
  selector: 'app-botones-registro',
  templateUrl: './botones-registro.component.html',
  styleUrls: ['./botones-registro.component.css']
})
export class BotonesRegistroComponent {
  constructor(private router : Router, private notificaciones : NotificacionService){}


  redirigirARegistroPaciente(){
    this.notificaciones.mostrarSpinner();

    setTimeout(()=>{
      this.notificaciones.ocultarSpinner();
      this.router.navigateByUrl('registro/paciente');
    },1500);
  }

  redirigirARegistroEspecialista(){

    this.notificaciones.mostrarSpinner();

    setTimeout(()=>{
      this.notificaciones.ocultarSpinner();
      this.router.navigateByUrl('registro/especialista');
    },1500);
    
  }
}
