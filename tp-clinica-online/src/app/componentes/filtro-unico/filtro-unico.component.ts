import { Component, Output, EventEmitter} from '@angular/core';
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

  obser$ : any;

  turnosFiltrados : any[] = [];
  @Output() eventItemMisTurnos = new EventEmitter<any>();

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
  }

  ngOnDestroy(){
    if(this.obser$){
      this.obser$.unsubscribe();
    }
  }

  constructor(private firebase : FirebaseService, private turnos1 : TurnosService){

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
          comentarioCancelacion : dato.comentarioCancelacion
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
  }

  buscarTurnosConEseFiltro(){
    
    this.turnosFiltrados = [];
    this.misTurnos.forEach((turno:any)=>{
      if(turno.especialidad == this.especialidadOEspecialista|| turno.especialista == this.especialidadOEspecialista){
        this.turnosFiltrados.push(turno);
      }
    });

    this.turnosFiltrados = this.turnosFiltrados.sort(this.turnos1.compararDiaDelTurno);
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
