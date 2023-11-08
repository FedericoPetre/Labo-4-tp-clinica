import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { NotificacionService } from 'src/app/servicios/notificacion.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public form : FormGroup;
  obser$ : any;
  arrayPersonas : any;
  usuariosAccesoRapido : any[] = [
    {correo:'breffoiddewetu-7402@yopmail.com', clave:'222222', foto:'https://firebasestorage.googleapis.com/v0/b/tp-clinica-online-3c359.appspot.com/o/Pacientes%2Fbreffoiddewetu-7402%40yopmail.com%2Fpaciente.png?alt=media&token=23bf5cb5-4184-4a88-8930-2580ed3db5a0'},
    {correo:'fede.wonderstudio@gmail.com', clave:'222222', foto:'https://firebasestorage.googleapis.com/v0/b/tp-clinica-online-3c359.appspot.com/o/Especialistas%2Ffede.wonderstudio%40gmail.com%2F0?alt=media&token=ed65c72f-77f7-4171-8c6d-bbce0ca6ee6b'},
    {correo:'federicopetremovil@gmail.com', clave:'222222', foto:'https://firebasestorage.googleapis.com/v0/b/tp-clinica-online-3c359.appspot.com/o/Admins%2Ffedericopetremovil%40gmail.com%2F0?alt=media&token=a060ada9-555c-40a2-afcb-e42418f6bc15'},
   ];


  public get Email(){
    return this.form.get('email')?.value;
  }

  public get Clave(){
    return this.form.get('clave')?.value;
  }

  ngOnInit(){
    this.obser$ = this.firebase.retornarUsuarioRegistrados().subscribe((datos)=>{
      this.cargarUsuariosAutorizados(datos);
    });
  }

  ngOnDestroy(){
    if(this.obser$){
      this.obser$.unsubscribe();
    }
  }

  constructor(private firebase : FirebaseService, private formBuilder : FormBuilder, private notificacion : NotificacionService){
    this.form = formBuilder.group({
      email:['',[Validators.required]],
      clave:['',[Validators.required]],
    });
  }

  async ingresar(){
    if(this.determinarSiSeEncuentraEnAutorizados(this.Email)){
      await this.firebase.ingresar(this.Email, this.Clave);
    }
    else{
      this.notificacion.mostrarError("Inicio Sesión","No estás autorizado para ingresar al sistema");
    }

  }

  cargarUsuariosAutorizados(arrayAux : any[]){
    let arrayNuevo : any[] = [];

    for(let i=0; i<arrayAux.length; i++){

    if(arrayAux[i].estaHabilitado == 'si'){
    
      let objPersona = {
        tipoUsuario: arrayAux[i].tipoUsuario,
        flagEstaHabilitado: 'si',
        nombre:arrayAux[i].nombre,
        email:arrayAux[i].email
      };
  
      arrayNuevo.push(objPersona);
    }
     
    }

    this.arrayPersonas = arrayNuevo;
  }

  determinarSiSeEncuentraEnAutorizados(email:string){
    let flagEstaAutorizado : boolean = false;

    for(let i=0; i<this.arrayPersonas.length; i++){
      if(this.arrayPersonas[i].email == email){
        flagEstaAutorizado = true;
        this.firebase.tipoUsuario = this.arrayPersonas[i].tipoUsuario;
        break;
      }
    }
    return flagEstaAutorizado;
  }

  escribirCorreoYClave(obj : any){
    this.form.get('email')?.setValue(obj.correo);
    this.form.get('clave')?.setValue(obj.clave);
  }

}
