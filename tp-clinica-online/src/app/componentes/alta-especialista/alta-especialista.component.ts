import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { Especialista } from 'src/app/clases/especialista';

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
    if (this.obser$) 
    {
      this.obser$.unsubscribe();
    }
  }


  constructor(private firebase : FirebaseService, private formBuilder : FormBuilder){
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
    const especialista = new Especialista(this.Nombre, this.Apellido, this.Edad, this.Dni, this.Email, this.Clave, this.Especialidad, {foto:''});
    console.log(JSON.stringify(especialista));
    await this.firebase.registrarEspecialista(especialista, this.fotoEspecialista);
    this.limpiarTodo();
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
    this.form.get('especialidad')?.setValue(especialidad);
  }

  cargarEspecialistas(arrayEspecialistas: any[]){
    let arrayEspecialistasAux : any = [];
    
    for(let i=0; i<arrayEspecialistas.length;i++){
      if(!this.determinarSiLaEspecialidadEsta(arrayEspecialistasAux, arrayEspecialistas[i].especialidad)){
        arrayEspecialistasAux.push(
          {especialidad:arrayEspecialistas[i].especialidad}
        );
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

}
