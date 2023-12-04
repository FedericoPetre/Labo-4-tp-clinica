import { Component, Input } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { NotificacionService } from 'src/app/servicios/notificacion.service';

@Component({
  selector: 'app-tabla-turnos-especialista',
  templateUrl: './tabla-turnos-especialista.component.html',
  styleUrls: ['./tabla-turnos-especialista.component.css']
})
export class TablaTurnosEspecialistaComponent {
  @Input() misTurnosEspecialista : any[] = [];

  historiasClinicas : any[] = [];
  obserHistoriasClinicas$ : any;

  ngOnInit(){
    console.log(this.misTurnosEspecialista);
    this.obserHistoriasClinicas$ = this.firebase.traerTodasLasHistoriasClinicas().subscribe((datos=>{
      this.cargarHistoriasClinicas(datos);
    }));
  }

  ngOnDestroy(){
    if(this.obserHistoriasClinicas$){
      this.obserHistoriasClinicas$.unsubscribe();
    }
  }

  constructor(private notificaciones: NotificacionService, private firebase : FirebaseService){}

  async verResenia(resenia:string){
    let respuesta = await this.notificaciones.mostrarMensajeSwal('',resenia);
  }

  async rechazarTurno(turno:any){
    let respuesta = await this.notificaciones.mostrarConfirmacion("Rechazar Turno", "¿Estás seguro de rechazar el turno?");

    if (respuesta.isConfirmed) {
      // Lógica cuando el usuario hace clic en "Sí"
      let comentarioCancelacion : string | null = await this.notificaciones.mostrarConfirmacionConTexto("Rechazar Turno", '¿Por qué está rechazando el turno?');
      
      if(comentarioCancelacion == null){
        comentarioCancelacion = "";
      }

      let respuesta1 : string = "";
      this.firebase.rechazarTurnoPaciente(turno.especialidad, turno.especialista, turno.paciente, comentarioCancelacion, turno.diaDelTurno).then((respuesta:string)=>{
        respuesta1 = respuesta;

        if(respuesta1 != "Se ha rechazado el turno"){
          this.notificaciones.mostrarError("Error", respuesta1);
        }else{
          this.notificaciones.mostrarExito("Éxito",respuesta1);
        }       
      });

    } else if (respuesta.isDismissed) {
      // Lógica cuando el usuario hace clic en "No"

    }
  }

  async aceptarTurno(turno:any){
    let respuesta = await this.notificaciones.mostrarConfirmacion("Aceptar Turno", "¿Estás seguro de aceptar el turno?");

    if (respuesta.isConfirmed) {
      // Lógica cuando el usuario hace clic en "Sí"
  
      let respuesta1 : string = "";
      this.firebase.aceptarTurnoPaciente(turno.especialidad, turno.especialista, turno.paciente, turno.diaDelTurno).then((respuesta:string)=>{
        respuesta1 = respuesta;

        if(respuesta1 != "Se ha aceptado el turno"){
          this.notificaciones.mostrarError("Error", respuesta1);
        }else{
          this.notificaciones.mostrarExito("Éxito",respuesta1);
        }       
      });

    } else if (respuesta.isDismissed) {
      // Lógica cuando el usuario hace clic en "No"

    }
  }

  async finalizarTurno(turno:any){
    let respuesta = await this.notificaciones.mostrarConfirmacion("Finalizar Turno", "¿Estás seguro de finalizar el turno?");

    if (respuesta.isConfirmed) {
      // Lógica cuando el usuario hace clic en "Sí"

      let resenia : string | null = await this.notificaciones.mostrarConfirmacionConTexto("Agrega Reseña", '¿Que indicaciones debe seguir el paciente?');
      
      let historiaClinica = await this.notificaciones.mostrarFormularioHistoriaClinica(turno.paciente);

      let objHistoriaClinica = {
        altura:historiaClinica?.altura,
        peso:historiaClinica?.peso,
        presion:historiaClinica?.presion,
        temperatura:historiaClinica?.temperatura,
        detalles:historiaClinica?.detalles,
        mailPaciente:turno.mailPaciente
      };

      if(resenia == null){
        resenia= "";
      }
  
      let respuesta1 : string = "";
      this.firebase.finalizarTurnoPaciente(turno.especialidad, turno.especialista, turno.paciente, resenia, turno.diaDelTurno).then(async (respuesta:string)=>{
        respuesta1 = respuesta;

        let historia = this.encontrarHistoriaPorMailPaciente(objHistoriaClinica.mailPaciente);
        if(historia != null){
          await this.firebase.modificarHistoriaClinica(objHistoriaClinica.mailPaciente, objHistoriaClinica);
        }else{
          await this.firebase.guardarHistoriaClinica(turno.paciente, objHistoriaClinica);
        }
        if(respuesta1 != "Se ha finalizado el turno"){
          this.notificaciones.mostrarError("Error", respuesta1);
        }else{
          this.notificaciones.mostrarExito("Éxito",respuesta1);
        }       
      });

    } else if (respuesta.isDismissed) {
      // Lógica cuando el usuario hace clic en "No"

    }
  }

  cargarHistoriasClinicas(arrayAux :any[]){
    let historiasClinicas : any[] = [];

    if(arrayAux.length > 0){
      arrayAux.forEach((historia:any)=>{
        let hClinica = {
          altura:historia.altura+" cm",
          paciente:historia.paciente,
          peso:historia.peso+" kg",
          presion:historia.presion+" mmHg",
          temperatura:historia.temperatura+" °C",
          detalle:historia.detalles,
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

  async descargarHistoriaClinica(usuario:any){
    let historiaClinica = this.encontrarHistoriaPorMailPaciente(usuario.email);
    let mensaje : string = `Altura: ${historiaClinica.altura},Peso: ${historiaClinica.peso},Presion: ${historiaClinica.presion},Temperatura: ${historiaClinica.temperatura},Detalles: ${historiaClinica.detalle}`;
    
  }


  private encontrarHistoriaPorMailPaciente(mailPaciente:string){
    let historia : any = null;
    for(let i=0; i<this.historiasClinicas.length; i++){
      if(this.historiasClinicas[i].mailPaciente == mailPaciente){
        historia = this.historiasClinicas[i];
        break;
      }
    }

    return historia;
  }
  

}
