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
    this.notificacion.mostrarSpinner();
    setTimeout(async()=>{
      if(this.determinarSiSeEncuentraEnAutorizados(this.Email)){
        await this.firebase.ingresar(this.Email, this.Clave);
        this.firebase.guardarLog(this.firebase.objUsuarioLogueado.email, this.firebase.objUsuarioLogueado.nombre+" "+this.firebase.objUsuarioLogueado.apellido);
      }
      else{
        this.notificacion.mostrarError("Inicio Sesión","No estás autorizado para ingresar al sistema");
      }
      this.notificacion.ocultarSpinner();
    },3000);


  }

  cargarUsuariosAutorizados(arrayAux : any[]){
    let arrayNuevo : any[] = [];
    let arrayTodos : any[] = [];

    for(let i=0; i<arrayAux.length; i++){
      let objPersona = {
        tipoUsuario: arrayAux[i].tipoUsuario,
        flagEstaHabilitado: 'si',
        nombre:arrayAux[i].nombre,
        apellido:arrayAux[i].apellido,
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
    let accesosRapido :any[] = [];
    
    arrayTodos.forEach((usuario:any)=>{
      if(usuario.email == "trummofreffiso-6202@yopmail.com" || usuario.email == 'breffoiddewetu-7402@yopmail.com' || usuario.email == "preuwubrocicroi-5676@yopmail.com" || usuario.email == "fede.wonderstudio@gmail.com" || usuario.email == "hetijed362@mainoj.com" || usuario.email == "federicopetremovil@gmail.com"){
        accesosRapido.push(usuario);
      }});
      
    this.usuariosAccesoRapido = accesosRapido;

    this.usuariosAccesoRapido.sort((a, b) => {
      if (a.tipoUsuario === 'paciente' && b.tipoUsuario !== 'paciente') {
          return -1; // 'paciente' antes de cualquier otro tipo
      }
      if (a.tipoUsuario === 'especialista' && b.tipoUsuario === 'admin') {
          return -1; // 'especialista' antes de 'admin'
      }
      if (a.tipoUsuario === 'admin' && b.tipoUsuario !== 'admin') {
          return 1; // 'admin' después de cualquier otro tipo
      }
      return 0; // No cambian de posición
  });
  
  }

  determinarSiSeEncuentraEnAutorizados(email:string){
    let flagEstaAutorizado : boolean = false;

    for(let i=0; i<this.arrayPersonas.length; i++){
      if(this.arrayPersonas[i].email == email){
        flagEstaAutorizado = true;
        this.firebase.tipoUsuario = this.arrayPersonas[i].tipoUsuario;
        this.firebase.objUsuarioLogueado = this.arrayPersonas[i];
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
