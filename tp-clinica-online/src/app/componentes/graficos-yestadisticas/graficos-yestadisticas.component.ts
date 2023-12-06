import { Component } from '@angular/core';
import { ExcelService } from 'src/app/servicios/excel.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { TurnosService } from 'src/app/servicios/turnos.service';

@Component({
  selector: 'app-graficos-yestadisticas',
  templateUrl: './graficos-yestadisticas.component.html',
  styleUrls: ['./graficos-yestadisticas.component.css']
})
export class GraficosYEstadisticasComponent {

  especialistas :string[] = []; //guarda los nombres de los especialistas en formato string (sin repeticiones)
  especialidades : string[] = []; // guarda las especialidades sin repeticiones que se encuentran en los turnos
  turnos :any[] = []; // todos los turnos de la base de datos 
  obserTurnos$ :any; // observable de la colección turnos

  cantidadTurnosPorEspecialidad :any[] = []; // guarda objetos con los atributos especialidad y cantidadTurnos

  diasTurnos :any[] = []; //guarda las fechas de los turnos en formato dia/mes/año (sin repeticiones)

  cantidadTurnosPorDia :any[] = []; //guarda la cantidad de turnos por día con atributos dia y cantidadTurnos

  obserLogs$ :any;
  arrayLogs :any[] = [];

  cantidadTurnosSolicitadosPorMedico :any[] = []; //guarda la cantidad de turnos por especialista con los otributos especialista y cantidadTurnos
  
  cantidadTurnosFinalizadosPorMedico :any[] = []; //guarda la cantidad de turnos por especialista con los otributos especialista y cantidadTurnos

  fechaActual = new Date() // para la fecha

  constructor(private firebase : FirebaseService, private turnosServ : TurnosService, private excel : ExcelService){}

  ngOnInit(){
    this.obserTurnos$ = this.firebase.traerTodosLosTurnosRegistrados().subscribe(datos=>{
      this.cargarTurnos(datos);

      this.obserLogs$ = this.firebase.traerTodosLosLogs().subscribe(datos=>{
        this.cargarLogs(datos);
      });
    }); 


  }

  ngOnDestroy(){
    if(this.obserLogs$){
      this.obserLogs$.unsubscribe();
    }

    if(this.obserTurnos$){
      this.obserTurnos$.unsubscribe();
    }
  }

  cargarTurnos(arrayAux :any[]){
    let turnosArray :any[] = [];
    let especialidadesArray :string[] = [];
    let fechasArray : string[] = [];
    let especialistasStr :string[] = [];

    if(arrayAux.length >0){
      arrayAux.forEach((turno:any)=>{
        turnosArray.push(turno);
        if(!especialidadesArray.includes(turno.especialidad)){
          especialidadesArray.push(turno.especialidad);
        }
        let fechaTurno : string = this.desformatearFecha(turno.diaTurno);
        let diaTurno = this.turnosServ.obtenerNombreDia(fechaTurno);

        if(!fechasArray.includes(diaTurno)){
          fechasArray.push(diaTurno);
        }

        if(!especialistasStr.includes(turno.nombreEspecialista)){
          especialistasStr.push(turno.nombreEspecialista);
        }

      });
    }

    this.turnos = turnosArray;
    this.especialidades = especialidadesArray;
    this.diasTurnos = fechasArray;
    this.especialistas = especialistasStr;

    this.determinarCantidadDeTurnosDeTodosLosDias();
    this.determinarCantidadDeTurnosTodasLasEspecialidades();
    this.determinarLaCantidaDeTurnosSolicitadosDeTodosLosEspecialistas();
    this.determinarLaCantidaDeTurnosFinalizadosDeTodosLosEspecialistas();
  }


  cargarLogs(arrayAux:any[]){
    let logs :any[] = [];

    if(arrayAux.length>0){
      arrayAux.forEach((log:any)=>{
        let fechaDate = new Date(log.fecha.seconds * 1000);
        let fechaFormateada :string = this.turnosServ.obtenerFechaFormateada(fechaDate);
        let objLog = {
          email:log.email,
          usuario:log.usuario,
          fecha :fechaFormateada,
        };

        logs.push(objLog);
      });
    }

    this.arrayLogs = logs;
  }


  private determinarCantidadDeTurnosPorEspecialidad(especialidad : string) :number{
    let cantidadTurnos : number = 0;

    for(let i=0; i<this.turnos.length; i++){
      if(this.turnos[i].especialidad == especialidad){
        cantidadTurnos++;
      }
    }
    return cantidadTurnos;
  }

  determinarCantidadDeTurnosTodasLasEspecialidades(){
    let cantidadTurnosEspecialidades :any[] = [];

    for(let i=0; i<this.especialidades.length; i++){
      let especialidadStr : string = this.especialidades[i];
      let cantidadTurnosNumber : number = this.determinarCantidadDeTurnosPorEspecialidad(especialidadStr);

      let obj = {
        especialidad: especialidadStr,
        cantidadTurnos: cantidadTurnosNumber,
      };

      cantidadTurnosEspecialidades.push(obj);
    }

    this.cantidadTurnosPorEspecialidad = cantidadTurnosEspecialidades;
  }

  mostrarCantidadDeTurnosPorEspecialidad(){
    this.determinarCantidadDeTurnosTodasLasEspecialidades();
    let mensaje : string = "";

    this.cantidadTurnosPorEspecialidad.forEach((objTurno :any)=>{
      mensaje = mensaje + `Especialidad: ${objTurno.especialidad} - Cantidad Turnos: ${objTurno.cantidadTurnos}\n`;
    });
    
    console.log(mensaje);
  }

  private desformatearFecha(fecha : string){
    let partesFecha = fecha.split(/[\s/:\-]+/);

    let fechaFormateada : string = "";

    let dia = partesFecha[0].padStart(2, '0');
    let mes = partesFecha[1].padStart(2, '0'); // ¡Recuerda que los meses empiezan desde 0!
    let anio = partesFecha[2];

    fechaFormateada = `${dia}/${mes}/${anio}`;

    return fechaFormateada;
  }

  mostrarDiasTurnos(){
    let mensaje : string = "";

    this.diasTurnos.forEach((fecha :string)=>{
      mensaje = mensaje + `${fecha}\n`;
    });
    
    console.log(mensaje);
  }

  private determinarCantidadTurnosDeEseDia(diaSemana:string){
    let cantidadTurnos : number = 0;
    this.turnos.forEach((turno:any)=>{
      let fechaDesformateada : string = this.desformatearFecha(turno.diaTurno);
      let diaSemanaTurno : string = this.turnosServ.obtenerNombreDia(fechaDesformateada);

      if(diaSemanaTurno == diaSemana){
        cantidadTurnos++;
      }
    });
    return cantidadTurnos;
  }
  
  determinarCantidadDeTurnosDeTodosLosDias(){
    let cantidadTurnosTodosLosDias :any[] = [];

    this.diasTurnos.forEach((dia:string)=>{
      let diaStr = dia;
      let cantidadTurnosStr = this.determinarCantidadTurnosDeEseDia(dia);

      let objDia = {
        dia:diaStr,
        cantidadTurnos:cantidadTurnosStr,
      };

      cantidadTurnosTodosLosDias.push(objDia);
    });

    this.cantidadTurnosPorDia = cantidadTurnosTodosLosDias;
  }

  private determinarCantidadTurnosSolicitadosDelEspecialista(especialista:string) :number{
    let cantidadTurnos : number = 0;

    this.turnos.forEach((turno:any)=>{
     
      if(turno.nombreEspecialista == especialista && turno.estadoTurno !="finalizado" && this.turnosServ.determinarSiLafechaSeEncuentraEnLosProximos10Dias(turno.diaTurno)){
        cantidadTurnos++;
      }
    });

    return cantidadTurnos;
  }

  determinarLaCantidaDeTurnosSolicitadosDeTodosLosEspecialistas(){
    let cantidadTurnosPorEspecialista :any[] = [];

    this.especialistas.forEach((especialista:string)=>{
      let nombreEspecialista = especialista;
      let cantidadTurnosStr = this.determinarCantidadTurnosSolicitadosDelEspecialista(nombreEspecialista);

      let objEspecialistaCantidad = {
        especialista:nombreEspecialista,
        cantidadTurnos:cantidadTurnosStr,
      };

      cantidadTurnosPorEspecialista.push(objEspecialistaCantidad);
  
    });

    this.cantidadTurnosSolicitadosPorMedico = cantidadTurnosPorEspecialista;
  }

  private determinarCantidadTurnosFinalizadosDelEspecialista(especialista:string) :number{
    let cantidadTurnos : number = 0;

    this.turnos.forEach((turno:any)=>{
      if(turno.nombreEspecialista == especialista && turno.estadoTurno =="finalizado" && this.turnosServ.determinarSiLafechaSeEncuentraEnLosUltimos10Dias(turno.diaTurno)){
        cantidadTurnos++;
      }
    });

    return cantidadTurnos;
  }

  determinarLaCantidaDeTurnosFinalizadosDeTodosLosEspecialistas(){
    let cantidadTurnosPorEspecialista :any[] = [];

    this.especialistas.forEach((especialista:string)=>{
      let nombreEspecialista = especialista;
      let cantidadTurnosStr = this.determinarCantidadTurnosFinalizadosDelEspecialista(nombreEspecialista);

      let objEspecialistaCantidad = {
        especialista:nombreEspecialista,
        cantidadTurnos:cantidadTurnosStr,
      };

      cantidadTurnosPorEspecialista.push(objEspecialistaCantidad);
  
    });

    this.cantidadTurnosFinalizadosPorMedico = cantidadTurnosPorEspecialista;
  }

  mostrarEspecialidadesYTurnos(){
    console.log(this.cantidadTurnosPorDia);
    console.log(this.cantidadTurnosPorEspecialidad);
    console.log(this.arrayLogs);
    console.log(this.cantidadTurnosSolicitadosPorMedico);
    console.log(this.cantidadTurnosFinalizadosPorMedico);
  }

  descargarExcel(datos:any[], tituloArchivo:string){
    this.excel.descargarExcel(datos, tituloArchivo);
  }

}
