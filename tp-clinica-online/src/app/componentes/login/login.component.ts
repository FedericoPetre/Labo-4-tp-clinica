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
  usuariosAccesoRapido : any[] = [];


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
    let arrayTodos : any[] = [];

    for(let i=0; i<arrayAux.length; i++){
      let objPersona = {
        tipoUsuario: arrayAux[i].tipoUsuario,
        flagEstaHabilitado: 'si',
        nombre:arrayAux[i].nombre,
        email:arrayAux[i].email,
        clave:arrayAux[i].clave,
        foto:arrayAux[i].fotos[0]
      };

      arrayTodos.push(objPersona);

    if(arrayAux[i].estaHabilitado == 'si'){
      arrayNuevo.push(objPersona);
    }
     
    }

    this.arrayPersonas = arrayNuevo;
    this.usuariosAccesoRapido = arrayTodos;
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
    this.form.get('email')?.setValue(obj.email);
    this.form.get('clave')?.setValue(obj.clave);
  }

}
