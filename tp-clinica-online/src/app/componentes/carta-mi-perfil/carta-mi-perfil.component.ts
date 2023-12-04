import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ExcelService } from 'src/app/servicios/excel.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { NotificacionService } from 'src/app/servicios/notificacion.service';
import { TurnosService } from 'src/app/servicios/turnos.service';

@Component({
  selector: 'app-carta-mi-perfil',
  templateUrl: './carta-mi-perfil.component.html',
  styleUrls: ['./carta-mi-perfil.component.css']
})
export class CartaMiPerfilComponent {
  @Input() nombre: string = '';
  @Input() apellido: string = '';
  @Input() email: string = '';
  @Input() edad: string = '';
  @Input() dni: string = '';
  @Input() imagenes: any[] = [];
  @Input() obraSocial = "";
  @Input() historiaClinica : any;

  @Output() eventEmiterHistoria = new EventEmitter<string>();

  historiasClinicas : any[] = [];

  obserHistoriasClinicas$ : any;
  obserTurnos$ :any;

  misTurnos:any[] = [];
  especialistasQueMeAtendieron :any[] = [];

  constructor(private firebase : FirebaseService, private notificaciones : NotificacionService, private turnos : TurnosService, private excel : ExcelService){}

  ngOnInit(){
    if(this.firebase.tipoUsuario == "paciente"){
      this.obserHistoriasClinicas$ = this.firebase.traerTodasLasHistoriasClinicas().subscribe(datos=>{
        this.cargarHistoriasClinicas(datos);

        setTimeout(() => {
          this.historiaClinica = this.encontrarHistoriaPorMailPaciente(this.firebase.email);
        }, 500);
      });

      this.obserTurnos$ = this.firebase.traerTurnosDelPaciente(this.firebase.email).subscribe(datos=>{
        this.cargarMisTurnos(datos);
      });
    }
  }

  ngOnDestroy(){
    if(this.obserHistoriasClinicas$){
      this.obserHistoriasClinicas$.unsubscribe();
    }

    if(this.obserTurnos$){
      this.obserTurnos$.unsubscribe();
    }
  }

  cargarHistoriasClinicas(arrayAux :any[]){
    let historiasClinicas : any[] = [];

    if(arrayAux.length > 0){
      arrayAux.forEach((historia:any)=>{
        let detalleStr : string = "";
        for (const key in historia.detalles) {
          if (historia.detalles.hasOwnProperty(key)) {
            detalleStr = detalleStr + `${key}:${historia.detalles[key]}, `;
          }
        }

        let hClinica = {
          altura:historia.altura+" cm",
          paciente:historia.paciente,
          peso:historia.peso+" kg",
          presion:historia.presion+" mmHg",
          temperatura:historia.temperatura+" °C",
          detalle:detalleStr,
          mailPaciente:historia.mailPaciente
        };

        historiasClinicas.push(hClinica);

      });
    }

    this.historiasClinicas = historiasClinicas;

  }

  async verHistoriaClinica(email:string){
    let historiaClinica = this.encontrarHistoriaPorMailPaciente(email);

    this.notificaciones.mostrarHistoriaClinica(historiaClinica).then((respuesta:string|null)=>{
      if(respuesta != null){
      }
    });
  }

  async descargarHistoriaClinica(email:string){
    let historiaClinica = this.encontrarHistoriaPorMailPaciente(email);

    let mensaje : string = JSON.stringify(historiaClinica);
    this.eventEmiterHistoria.emit(mensaje);
  }


  private encontrarHistoriaPorMailPaciente(mailPaciente:string){
    let historia : any;
    for(let i=0; i<this.historiasClinicas.length; i++){
      if(this.historiasClinicas[i].mailPaciente == mailPaciente){
        historia = this.historiasClinicas[i];
        break;
      }
    }

    let fecha = new Date();
    let fechaFormateada : string = this.turnos.obtenerFechaFormateada(fecha);


    let historiaClinicaObj1 = {
      fecha: fechaFormateada,
      altura:historia.altura,
      peso:historia.peso,
      presion:historia.presion,
      temperatura:historia.temperatura,
      detalle:historia.detalle
    };
    return historiaClinicaObj1;
  }

  cargarMisTurnos(arrayAux:any[]){
    let misTurnosArray :any[] = [];
    let especialistas :any[] = [];

    if(arrayAux.length >0){
      arrayAux.forEach(turno=>{
        let objTurno = {
          calificacion:turno.calificacionAtencion,
          comentario:turno.comentarioCancelacion,
          diaDelTurno:turno.diaTurno,
          especialidad:turno.especialidad,
          estado:turno.estadoTurno,
          especialista:turno.nombreEspecialista,
          resenia:turno.resenia,
          paciente:turno.paciente
        };

        misTurnosArray.push(objTurno);

        if(!especialistas.includes(objTurno.especialista)){
          especialistas.push(objTurno.especialista);
        }

      });
    }

    this.misTurnos = misTurnosArray;
    this.especialistasQueMeAtendieron = especialistas;
  }

  descargarTurnosConElEspecialista(especialista:string){
    let turnos :any[] = [];

    this.misTurnos.forEach(turno=>{
      if(turno.especialista == especialista){
        turnos.push(turno);
      }
    });

    this.excel.descargarExcel(turnos, "turnosCon"+especialista);
  }
}
