import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { Paciente } from 'src/app/clases/paciente';

@Component({
  selector: 'app-alta-paciente',
  templateUrl: './alta-paciente.component.html',
  styleUrls: ['./alta-paciente.component.css']
})
export class AltaPacienteComponent 
{
  fotosPaciente : any[] = [];
  public form : FormGroup;
  botonesObraSocial : any[] = [];
  imagenPerfil1 : any = "../../../assets/img/silueta.png";
  imagenPerfil2 : any = "../../../assets/img/silueta.png";
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

  public get ObraSocial(){
    return this.form.get('obraSocial')?.value;
  }

  public get Email(){
    return this.form.get('email')?.value;
  }

  public get Clave(){
    return this.form.get('clave')?.value;
  }


  ngOnInit(){
    this.obser$ = this.firebase.traerPacientesRegistrados().subscribe(pacientes=>{
      this.cargarPacientes(pacientes);
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
      obraSocial:['',[Validators.required]],
      email:['',[Validators.required]],
      clave:['',[Validators.required]],
      fotos:['',[Validators.required]]
    });
  }

  async registrarPaciente(){
    if(this.fotosPaciente.length == 2){ //si son dos fotos se puede registrar
      //los datos del paciente tomados del formulario van en el constructor de Paciente
      const paciente = new Paciente(this.Nombre, this.Apellido, this.Edad, this.Dni, this.Email, this.Clave, this.ObraSocial, [{foto:''}]);
      await this.firebase.registrarPaciente(paciente, this.fotosPaciente);
      this.limpiarTodo();
    }
    else{ //si no son dos fotos (son más o son menos) entonces no se registra hasta que sean dos fotos solamente
      // avisar que no son la cantidad de fotos requeridas
    }

  }

  actualizarFotosPaciente(event : any){
    let fotos : FileList = event.target.files;
    this.fotosPaciente = [];
    let cantidadFotos = fotos.length;

    if(cantidadFotos == 2){
      for(let i=0; i<cantidadFotos; i++){
        let reader : FileReader = new FileReader();
        reader.readAsDataURL(fotos[i]);
        reader.onloadend = () => {
          this.fotosPaciente.push(reader.result);
          if(i==1){
            this.imagenPerfil1 = this.fotosPaciente[0];
            this.imagenPerfil2 = this.fotosPaciente[1];
          }
        }
      }
    }else{
      //se avisa que no pueden ser más de 2 fotos:
      let fotosReales = cantidadFotos++;
      alert("Has seleccionado "+fotosReales+" fotos! Seleccione 2 fotos solamente!");
    }




    console.log(this.fotosPaciente);    
  }

  cargarObraSocial(obraSocial : string){
    this.form.get('obraSocial')?.setValue(obraSocial);
  }

  limpiarTodo(){
    this.form.setValue({
      nombre:'',
      apellido:'',
      edad:'',
      dni:'',
      obraSocial:'',
      email:'',
      clave:'',
      fotos:''
    });
    this.imagenPerfil1 = "../../../assets/img/silueta.png";
    this.imagenPerfil2 = "../../../assets/img/silueta.png";
  }

  cargarPacientes(arrayPacientes: any[]){
    let arrayPacientesAux : any = [];
    
    for(let i=0; i<arrayPacientes.length;i++){
      if(!this.determinarSiLaEspecialidadEsta(arrayPacientesAux, arrayPacientes[i].obraSocial)){
        arrayPacientesAux.push(
          {obraSocial:arrayPacientes[i].obraSocial}
        );
      }
    }

    this.botonesObraSocial = arrayPacientesAux;
    
  }


  determinarSiLaEspecialidadEsta(arrayPacientesAux : any[], obraSocial : string){
    let flagLaObraSocialExiste : boolean = false;

    for(let i=0; i<arrayPacientesAux.length; i++){
      if(arrayPacientesAux[i].obraSocial == obraSocial){
        flagLaObraSocialExiste = true;
        break;
      }
    }
    return flagLaObraSocialExiste;
  }

}
