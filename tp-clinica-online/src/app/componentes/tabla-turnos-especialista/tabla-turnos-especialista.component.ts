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
        detalles:historiaClinica?.detalles
      };

      if(resenia == null){
        resenia= "";
      }
  
      let respuesta1 : string = "";
      this.firebase.finalizarTurnoPaciente(turno.especialidad, turno.especialista, turno.paciente, resenia, turno.diaDelTurno).then((respuesta:string)=>{
        respuesta1 = respuesta;
        this.firebase.guardarHistoriaClinica(turno.paciente, objHistoriaClinica);
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
}
