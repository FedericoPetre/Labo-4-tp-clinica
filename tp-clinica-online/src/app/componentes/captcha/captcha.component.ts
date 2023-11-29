import { Component, Output, EventEmitter } from '@angular/core';
import { NotificacionService } from 'src/app/servicios/notificacion.service';

@Component({
  selector: 'app-captcha',
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.css']
})
export class CaptchaComponent {
  captcha : string = "";
  captchaIngresado:string = "";
  flagMuestraBoton : boolean = true;

  caracteresPermitidos : string = "";

  @Output() eventCaptchaEmiter = new EventEmitter<boolean>();

  ngOnInit(){
    this.generarNuevoCaptcha();
  }

  constructor(private notificaciones : NotificacionService){}

  generarNuevoCaptcha(){
    let captchaGenerado : string = "";
    this.caracteresPermitidos = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    captchaGenerado = this.caracteresPermitidos[Math.floor(Math.random() * this.caracteresPermitidos.length )];
    for(let i=0; i<6; i++){
      captchaGenerado = captchaGenerado + this.caracteresPermitidos[Math.floor(Math.random() * this.caracteresPermitidos.length )];
    }
    this.captcha = captchaGenerado;
  }

  checkearCaptcha(){
    let flagVerificoCaptcha : boolean = false;
    let captchaDelUsuario = this.captchaIngresado;
    if(this.captcha == captchaDelUsuario){
      flagVerificoCaptcha = true;
      this.notificaciones.mostrarExito("Captcha","Captcha correcto");
      this.flagMuestraBoton = false;
    }else{
      flagVerificoCaptcha = false;
      this.notificaciones.mostrarError("Captcha","Captcha incorrecto");
      this.captchaIngresado="";
    }

    this.eventCaptchaEmiter.emit(flagVerificoCaptcha);
  }
}
