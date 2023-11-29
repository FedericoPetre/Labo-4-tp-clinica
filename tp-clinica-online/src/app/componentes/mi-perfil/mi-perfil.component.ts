import { Component, AfterViewInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { TurnosService } from 'src/app/servicios/turnos.service';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent {
  obserPersonas$ : any;
  usuarioIngresado : any;
  obserEspecialista$ : any;
  especialistaIngresado : any;
  especialidades : any[] =  [];

  obserPaciente$ :any;
  flagEsPaciente: boolean = false;
  flagEsAdmin : boolean = false;
  obserHistoriaClinica$:any;

  historiaClinica : any;
  historiaClinicaObj : any;
  descargaHistoriaClinica : boolean = false;

  ngOnInit(){
    if(this.firebase.tipoUsuario =="especialista"){
    this.obserPersonas$ = this.firebase.retornarUsuarioRegistrados().subscribe(datos=>{
      this.cargarUsuario(datos);
    });
  }

    if(this.firebase.tipoUsuario == 'paciente'){
      this.flagEsPaciente = true;
      this.obserPaciente$ = this.firebase.traerPacientesRegistrados().subscribe(datos=>{
        this.encontrarPaciente(datos);
      });

      this.obserHistoriaClinica$ = this.firebase.traerHistoriaClinicaPaciente(this.firebase.nombreUsuario).subscribe(datos=>{
        this.cargarHistoriaClinica(datos);
      })
    }else if(this.firebase.tipoUsuario == 'admin'){
      this.flagEsAdmin = true;
      this.obserPaciente$ = this.firebase.traerAdminsRegistrados().subscribe(datos=>{
        this.encontrarAdmin(datos);
      });
    }

  }

  ngOnDestroy(){
    if(this.obserPersonas$){
      this.obserPersonas$.unsubscribe();
    }

    if(this.obserEspecialista$){
      this.obserEspecialista$.unsubscribe();
    }

    if(this.obserPaciente$){
      this.obserPaciente$.unsubscribe();
    }

    if(this.obserHistoriaClinica$){
      this.obserHistoriaClinica$.unsubscribe();
    }
  }

  constructor(private firebase : FirebaseService, private turnos : TurnosService){

  }

  cargarUsuario(arrayAux : any[]){
    let arrayNuevo : any[] = [];

    for(let i=0; i<arrayAux.length; i++){

      if(arrayAux[i].email == this.firebase.email){
        const objPersona = {
          tipoUsuario: arrayAux[i].tipoUsuario,
          flagEstaHabilitado:arrayAux[i].estaHabilitado,
          nombre:arrayAux[i].nombre,
          apellido:arrayAux[i].apellido,
          email:arrayAux[i].email,
          fotos:arrayAux[i].fotos
        };
        arrayNuevo.push(objPersona);
      } 
    }

    this.usuarioIngresado = arrayNuevo[0];
    this.obserEspecialista$ = this.firebase.traerEspecialistaPorEmail(this.firebase.email).subscribe(datos=>{
      this.especialistaIngresado = datos[0];
      this.firebase.objUsuarioLogueado = datos[0];
      let especialidadesArray : string[] = this.especialistaIngresado.especialidad.split(',');
      especialidadesArray.forEach((especialidad:string)=>{
        if(especialidad != ""){
          let objEspecialidad = { nombre: especialidad, horarios: [], duracionCadaTurno:0 };

          this.especialidades.push(objEspecialidad);
        }
      });
    });
  }

  encontrarPaciente(arrayAux : any[]){
    if(arrayAux.length>0){
      arrayAux.forEach((dato:any)=>{
        if(dato.email == this.firebase.email){
          this.usuarioIngresado = dato;
          console.log(JSON.stringify(this.usuarioIngresado));
        }
      });
    }
  }

  encontrarAdmin(arrayAux : any[]){
    this.encontrarPaciente(arrayAux);
  }

  cargarHistoriaClinica(arrayDatos : any){
    if(arrayDatos.length > 0){
      for(let i=0; i<arrayDatos.length; i++){
        this.historiaClinica = arrayDatos[i];
        console.log(this.historiaClinica);
        break;
      }
    }
  }

  mostrarHistoriaClinica(historia:string){
    let objHistoria = JSON.parse(historia);
    let fecha = new Date();
    let fechaFormateada : string = this.turnos.obtenerFechaFormateada(fecha);

    let historiaClinicaObj1 = {
      fecha: fechaFormateada,
      altura:objHistoria.altura,
      peso:objHistoria.peso,
      presion:objHistoria.presion,
      temperatura:objHistoria.temperatura,
      detalle:objHistoria.detalle
    };

    this.historiaClinicaObj = historiaClinicaObj1;
    this.descargaHistoriaClinica = true;
  }
}
