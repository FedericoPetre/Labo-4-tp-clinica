import { Component, Output, EventEmitter, Input} from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { TurnosService } from 'src/app/servicios/turnos.service';

@Component({
  selector: 'app-filtro-unico',
  templateUrl: './filtro-unico.component.html',
  styleUrls: ['./filtro-unico.component.css']
})
export class FiltroUnicoComponent {
  especialidadOEspecialista : string = "";
  tipoUsuario : string = "";
  misTurnos : any[] = [];
  especialistas : any[] = [];
  especialidades : any[] = [];
  pacientes : any[] = [];

  obser$ : any;

  turnosFiltrados : any[] = [];
  @Output() eventItemMisTurnos = new EventEmitter<any>();
  @Input() flagHayCambios : boolean = false;

  ngOnInit(){
    this.tipoUsuario = this.firebase.tipoUsuario;
    /*
    this.tipoUsuario = "paciente";
    this.firebase.email = "breffoiddewetu-7402@yopmail.com";
*/
    if(this.tipoUsuario == "paciente"){
      this.obser$ = this.firebase.traerTurnosDelPaciente(this.firebase.email).subscribe(datos=>{
        this.cargarEspecialistasYEspecialidades(datos);
      });
    }

    if(this.tipoUsuario == "especialista"){
      this.obser$ = this.firebase.traerTurnosDelEspecialista(this.firebase.nombreUsuario).subscribe(datos=>{
        this.cargarPacientesYEspecialidades(datos);
      });
    }

    if(this.tipoUsuario =="admin"){
      this.obser$ = this.firebase.traerTodosLosTurnosRegistrados().subscribe(datos=>{
        this.cargarEspecialistasYEspecialidades(datos);
      });
    }
  }

  ngOnDestroy(){
    if(this.obser$){
      this.obser$.unsubscribe();
    }
  }

  constructor(private firebase : FirebaseService, private turnos1 : TurnosService){

  }

  cargarTodosLosTurnos(arrayDatos : any[]){
    let arrayAux : any[] = [];
    let arrayEspecialistas : any[] = [];
    let arrayEspecialidades : any[] = [];

    if(arrayDatos.length > 0){

      arrayDatos.forEach((dato:any)=>{
        let objTurno = {
          diaDelTurno : dato.diaTurno,
          especialidad : dato.especialidad,
          estado : dato.estadoTurno,
          especialista: dato.nombreEspecialista,
          fueRealizado: dato.fueRealizado,
          resenia: dato.resenia,
          calificacionAtencion: dato.calificacionAtencion,
          comentarioCancelacion : dato.comentarioCancelacion,
          paciente: dato.paciente
        };

        arrayAux.push(objTurno);

        if(!arrayEspecialistas.includes(objTurno.especialista)){
          arrayEspecialistas.push(objTurno.especialista);
        }

        if(!arrayEspecialidades.includes(objTurno.especialidad)){
          arrayEspecialidades.push(objTurno.especialidad);
        }
      });
    }
    this.misTurnos = arrayAux;
    this.especialidades = arrayEspecialidades;
    this.especialistas = arrayEspecialistas;
    
    this.buscarTurnosConEseFiltro();
  }

  cargarEspecialistasYEspecialidades(arrayDatos : any[]){
    let arrayAux : any[] = [];
    let arrayEspecialistas : any[] = [];
    let arrayEspecialidades : any[] = [];

    if(arrayDatos.length > 0){

      arrayDatos.forEach((dato:any)=>{
        let objTurno = {
          diaDelTurno : dato.diaTurno,
          especialidad : dato.especialidad,
          estado : dato.estadoTurno,
          especialista: dato.nombreEspecialista,
          fueRealizado: dato.fueRealizado,
          resenia: dato.resenia,
          calificacionAtencion: dato.calificacionAtencion,
          comentarioCancelacion : dato.comentarioCancelacion,
          paciente: dato.paciente
        };

        arrayAux.push(objTurno);

        if(!arrayEspecialistas.includes(objTurno.especialista)){
          arrayEspecialistas.push(objTurno.especialista);
        }

        if(!arrayEspecialidades.includes(objTurno.especialidad)){
          arrayEspecialidades.push(objTurno.especialidad);
        }
      });
    }
    this.misTurnos = arrayAux;
    this.especialidades = arrayEspecialidades;
    this.especialistas = arrayEspecialistas;
    
    this.buscarTurnosConEseFiltro();
  }

  cargarPacientesYEspecialidades(arrayDatos : any[]){
    let arrayAux : any[] = [];
    let arrayPacientes : any[] = [];
    let arrayEspecialidades : any[] = [];

    if(arrayDatos.length > 0){

      arrayDatos.forEach((dato:any)=>{
        let objTurno = {
          diaDelTurno : dato.diaTurno,
          especialidad : dato.especialidad,
          estado : dato.estadoTurno,
          especialista: dato.nombreEspecialista,
          fueRealizado: dato.fueRealizado,
          resenia: dato.resenia,
          calificacionAtencion: dato.calificacionAtencion,
          comentarioCancelacion : dato.comentarioCancelacion,
          paciente: dato.paciente,
          mailPaciente:dato.mailPaciente
        };

        arrayAux.push(objTurno);

        if(!arrayPacientes.includes(objTurno.paciente)){
          arrayPacientes.push(objTurno.paciente);
        }

        if(!arrayEspecialidades.includes(objTurno.especialidad)){
          arrayEspecialidades.push(objTurno.especialidad);
        }
      });
    }
    this.misTurnos = arrayAux;
    this.especialidades = arrayEspecialidades;
    this.pacientes = arrayPacientes;

    this.buscarTurnosConEseFiltro();
  }

  buscarTurnosConEseFiltro(){
    this.turnosFiltrados = [];
    if(this.tipoUsuario == "paciente"){
      this.misTurnos.forEach((turno:any)=>{
        if(turno.especialidad.toLowerCase().includes(this.especialidadOEspecialista.toLowerCase()) || turno.especialista.toLowerCase().includes(this.especialidadOEspecialista.toLowerCase())){
          this.turnosFiltrados.push(turno);
        }
      });
    }
    else if(this.tipoUsuario == "especialista"){
      this.misTurnos.forEach((turno:any)=>{
        if(turno.especialidad.toLowerCase().includes(this.especialidadOEspecialista.toLowerCase()) || turno.paciente.toLowerCase().includes(this.especialidadOEspecialista.toLowerCase())){
          this.turnosFiltrados.push(turno);
        }
      });
    }else{
      this.misTurnos.forEach((turno:any)=>{
        if(turno.especialidad.toLowerCase().includes(this.especialidadOEspecialista.toLowerCase()) || turno.especialista.toLowerCase().includes(this.especialidadOEspecialista.toLowerCase())){
          this.turnosFiltrados.push(turno);
        }
      });
    }

    this.turnosFiltrados = this.turnosFiltrados.sort(this.turnos1.compararDiaDelTurno);
    console.log(this.turnosFiltrados);
    this.eventItemMisTurnos.emit(this.turnosFiltrados);
  }

  filtrar(item:string){
    this.especialidadOEspecialista = item;
    this.buscarTurnosConEseFiltro();
  }

  limpiarFiltro(){
    this.especialidadOEspecialista = "";
    this.turnosFiltrados = this.misTurnos;
    this.eventItemMisTurnos.emit(this.turnosFiltrados);
  }
}
