import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { Especialista } from 'src/app/clases/especialista';
import { NotificacionService } from 'src/app/servicios/notificacion.service';

@Component({
  selector: 'app-alta-especialista',
  templateUrl: './alta-especialista.component.html',
  styleUrls: ['./alta-especialista.component.css']
})
export class AltaEspecialistaComponent {

  fotoEspecialista : any[] = [];
  public form : FormGroup;
  imagenPerfil : any = "../../../assets/img/silueta.png";
  botonesEspecialidad : any[] = [];
  obser$: any;
  flagCaptchaValido : boolean = false;

  public get Nombre(){
    return this.form.get('nombre')?.value;
  }

  public get Apellido(){
    return this.form.get('apellido')?.value;
  }

  public get Edad(){
    return this.form.get('edad')?.value;
  }

  public get Dni(){
    return this.form.get('dni')?.value;
  }

  public get Especialidad(){
    return this.form.get('especialidad')?.value;
  }

  public get Email(){
    return this.form.get('email')?.value;
  }

  public get Clave(){
    return this.form.get('clave')?.value;
  }

  ngOnInit(){
    this.obser$ = this.firebase.traerEspecialistasRegistrados().subscribe(especialistas=>{
      this.cargarEspecialistas(especialistas);
    });
  }

  ngOnDestroy() {
    if (this.obser$) {
      this.obser$.unsubscribe();
    }
  }
  


  constructor(private firebase : FirebaseService, private formBuilder : FormBuilder, private notificaciones : NotificacionService){
    this.form = formBuilder.group({
      nombre:['',[Validators.required]],
      apellido:['',[Validators.required]],
      edad:['',[Validators.min(0), Validators.required]],
      dni:['',[Validators.min(0), Validators.required]],
      especialidad:['',[Validators.required]],
      email:['',[Validators.required]],
      clave:['',[Validators.required]],
      foto:['',[Validators.required]]
    });
  }


  async registrarEspecialista(){
    if(this.flagCaptchaValido){
      this.notificaciones.mostrarSpinner();
      const especialista = new Especialista(this.Nombre, this.Apellido, this.Edad, this.Dni, this.Email, this.Clave, this.Especialidad, {foto:''});
      console.log(JSON.stringify(especialista));
      await this.firebase.registrarEspecialista(especialista, this.fotoEspecialista);
      this.limpiarTodo();
      this.notificaciones.ocultarSpinner();
    }
    else{
      this.notificaciones.mostrarInfo("Captcha","Falta que el captcha ingresado sea el correcto");
    }

  }

  actualizarFotoEspecialista(event : any){
    let fotos : FileList = event.target.files;
    this.fotoEspecialista = [];

    let reader : FileReader = new FileReader();
    reader.readAsDataURL(fotos[0]);
    reader.onloadend = () => {
      this.fotoEspecialista.push(reader.result);
      this.imagenPerfil = this.fotoEspecialista[0];
    }


    console.log(this.fotoEspecialista);    
  }

  cargarEspecialidad(especialidad : string){
    let especialidades: string = this.Especialidad;
    let nuevaEspecialidad = "";

    if(!especialidades.includes(especialidad)){
      if(especialidades.length == 0){
        nuevaEspecialidad = especialidad+",";
      }
      else{
        if(especialidades.lastIndexOf(',') != especialidades.length -1){
          nuevaEspecialidad = especialidades+','+especialidad+',';
        }else{
          nuevaEspecialidad = especialidades +especialidad+",";
        }
      }

      this.form.get('especialidad')?.setValue(nuevaEspecialidad);
    }
  }

  cargarEspecialistas(arrayEspecialistas: any[]){
    let arrayEspecialistasAux : string[] = [];
    
    for(let i=0; i<arrayEspecialistas.length;i++){
      if(!this.determinarSiLaEspecialidadEsta(arrayEspecialistasAux, arrayEspecialistas[i].especialidad)){
        let especialidadesDelDoctor : string[] = arrayEspecialistas[i].especialidad.split(',');

        especialidadesDelDoctor.forEach((especialidad:string)=>{
          if(!arrayEspecialistasAux.includes(especialidad) && especialidad != ""){
            arrayEspecialistasAux.push(especialidad);

          }
        });
      }
    }

    this.botonesEspecialidad = arrayEspecialistasAux;
    
  }


  determinarSiLaEspecialidadEsta(arrayEspecialistas : any[], especialidad : string){
    let flagLaEspecialidadExiste : boolean = false;

    for(let i=0; i<arrayEspecialistas.length; i++){
      if(arrayEspecialistas[i].especialidad == especialidad){
        flagLaEspecialidadExiste = true;
        break;
      }
    }
    return flagLaEspecialidadExiste;
  }

  limpiarTodo(){
    this.form.setValue({
      nombre:'',
      apellido:'',
      edad:'',
      dni:'',
      especialidad:'',
      email:'',
      clave:'',
      foto:''
    });
    this.imagenPerfil = "../../../assets/img/silueta.png";
  }

  validarCaptcha(respuestaCaptcha:boolean){
    this.flagCaptchaValido = respuestaCaptcha;
  }

}
