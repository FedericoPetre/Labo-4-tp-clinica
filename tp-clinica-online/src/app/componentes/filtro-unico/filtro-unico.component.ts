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

  historiasClinicas :any[] = [];

  obser$ : any;
  obserHistoriasClinicas$ :any;

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

    if(this.obserHistoriasClinicas$){
      this.obserHistoriasClinicas$.unsubscribe();
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

    this.obserHistoriasClinicas$ = this.firebase.traerTodasLasHistoriasClinicas().subscribe(datos=>{
      this.cargarHistoriasClinicas(datos);
      let arrayAux : any[] = [];
      let arrayEspecialistas : any[] = [];
      let arrayEspecialidades : any[] = [];
  
      if(arrayDatos.length > 0){
  
        arrayDatos.forEach((dato:any)=>{
          let historiaClinica = this.encontrarHistoriaPorMailPaciente(dato.mailPaciente);
          let historiaStr = "";
          let detalleStr = "";

          for (const key in historiaClinica) {
            if (historiaClinica.hasOwnProperty(key)) {
              if(key == 'detalle'){
                for(const key1 in historiaClinica[key]){
                  detalleStr = detalleStr + `${key1}:${historiaClinica[key][key1]}`;
                }
                historiaStr =  historiaStr + `${key}${detalleStr}, `;

              }else{
                historiaStr =  historiaStr + `${key}:${historiaClinica[key]}, `;
              }
            }
          }

          historiaStr = historiaStr.toLowerCase();
  
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
            historiaClinica : historiaStr 
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
    });



  }

  cargarPacientesYEspecialidades(arrayDatos : any[]){

    this.obserHistoriasClinicas$ = this.firebase.traerTodasLasHistoriasClinicas().subscribe(datos=>{
      this.cargarHistoriasClinicas(datos);
      let arrayAux : any[] = [];
      let arrayPacientes : any[] = [];
      let arrayEspecialidades : any[] = [];
      
  
      if(arrayDatos.length > 0){
  
        
        arrayDatos.forEach((dato:any)=>{
          let historiaClinica = this.encontrarHistoriaPorMailPaciente(dato.mailPaciente);
          let historiaStr = "";
          let detalleStr = "";

          for (const key in historiaClinica) {
            if (historiaClinica.hasOwnProperty(key)) {
              if(key == 'detalle'){
                for(const key1 in historiaClinica[key]){
                  detalleStr = detalleStr + `${key1}:${historiaClinica[key][key1]}`;
                }
                historiaStr =  historiaStr + `${key}${detalleStr}, `;

              }else{
                historiaStr =  historiaStr + `${key}:${historiaClinica[key]}, `;
              }
            }
          }

          historiaStr = historiaStr.toLowerCase();
  
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
            mailPaciente:dato.mailPaciente,
            historiaClinica : historiaStr
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
    });

  }

  cargarHistoriasClinicas(arrayDatos :any[]){
    let historias :any[] = [];
    if(arrayDatos.length > 0){
      arrayDatos.forEach((historia:any)=>{
        let objHistoriaClinica = {
          altura:historia.altura+" cm",
          paciente:historia.paciente,
          peso:historia.peso+" kg",
          presion:historia.presion+" mmHg",
          temperatura:historia.temperatura+" °C",
          detalle:historia.detalles,
          mailPaciente:historia.mailPaciente
        };

        historias.push(objHistoriaClinica);
      })
    }

    this.historiasClinicas = historias;
  }

  buscarTurnosConEseFiltro(){
    let turnosFiltradosArray : any[] = [];
    if(this.tipoUsuario == "paciente"){
      this.misTurnos.forEach((turno:any)=>{
        if(turno.especialidad.toLowerCase().includes(this.especialidadOEspecialista.toLowerCase()) || turno.especialista.toLowerCase().includes(this.especialidadOEspecialista.toLowerCase()) || turno.historiaClinica.includes(this.especialidadOEspecialista.toLowerCase())){
          turnosFiltradosArray.push(turno);
        }
      });

      this.turnosFiltrados = turnosFiltradosArray.sort(this.turnos1.compararDiaDelTurno);
      console.log(this.turnosFiltrados);
      this.eventItemMisTurnos.emit(this.turnosFiltrados);
    }
    else if(this.tipoUsuario == "especialista"){
      this.misTurnos.forEach((turno:any)=>{

        let flagEsta1 : boolean = turno.historiaClinica.includes(this.especialidadOEspecialista.toLowerCase());

        if(turno.especialidad.toLowerCase().includes(this.especialidadOEspecialista.toLowerCase()) || turno.paciente.toLowerCase().includes(this.especialidadOEspecialista.toLowerCase())|| flagEsta1){
          turnosFiltradosArray.push(turno);
        }
      });
      console.log(turnosFiltradosArray);

      this.turnosFiltrados = turnosFiltradosArray.sort(this.turnos1.compararDiaDelTurno);
      console.log(this.turnosFiltrados);
      this.eventItemMisTurnos.emit(this.turnosFiltrados);


    }else{
      this.misTurnos.forEach((turno:any)=>{
        if(turno.especialidad.toLowerCase().includes(this.especialidadOEspecialista.toLowerCase()) || turno.especialista.toLowerCase().includes(this.especialidadOEspecialista.toLowerCase()|| turno.historiaClinica.includes(this.especialidadOEspecialista.toLowerCase()))){
          turnosFiltradosArray.push(turno);
        }
      });

      this.turnosFiltrados = turnosFiltradosArray.sort(this.turnos1.compararDiaDelTurno);
      console.log(this.turnosFiltrados);
      this.eventItemMisTurnos.emit(this.turnosFiltrados);
    }
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

  private encontrarHistoriaPorMailPaciente(mailPaciente:string){
    let historia : any = "";
    for(let i=0; i<this.historiasClinicas.length; i++){
      if(this.historiasClinicas[i].mailPaciente == mailPaciente){
        historia = this.historiasClinicas[i];
        break;
      }
    }

    return historia;
  }
}
