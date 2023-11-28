import { Component, Input } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { NotificacionService } from 'src/app/servicios/notificacion.service';

@Component({
  selector: 'app-tabla-turnos-paciente',
  templateUrl: './tabla-turnos-paciente.component.html',
  styleUrls: ['./tabla-turnos-paciente.component.css']
})
export class TablaTurnosPacienteComponent {
  @Input() misTurnosPaciente : any[] = [];

  constructor(private notificaciones: NotificacionService, private firebase : FirebaseService){}

  async cancelarTurno(turno:any){
    let respuesta = await this.notificaciones.mostrarConfirmacion("Cancelar Turno", "¿Estás seguro de cancelar el turno?");

    if (respuesta.isConfirmed) {
      // Lógica cuando el usuario hace clic en "Sí"
      let comentarioCancelacion : string | null = await this.notificaciones.mostrarConfirmacionConTexto("Cancelar Turno", '¿Por qué está cancelando el turno?');
      
      if(comentarioCancelacion == null){
        comentarioCancelacion = "";
      }

      let respuesta1 : string = "";
      this.firebase.cancelarTurnoPaciente(turno.especialidad, turno.especialista, turno.paciente, comentarioCancelacion).then((respuesta:string)=>{
        respuesta1 = respuesta;

        if(respuesta1 != "Se han cancelado el turno"){
          this.notificaciones.mostrarError("Error", respuesta1);
        }else{
          this.notificaciones.mostrarExito("Éxito",respuesta1);
          
        }       
      });

    } else if (respuesta.isDismissed) {
      // Lógica cuando el usuario hace clic en "No"

    }
  }

  async verResenia(resenia:string){
    let respuesta = await this.notificaciones.mostrarMensajeSwal('',resenia);
  }

  async calificarTurno(turno:any){
    let calificacion : string | null = await this.notificaciones.mostrarConfirmacionConTexto("Calificar Atención", '¿Qué te pareció el servicio?');

    if(calificacion == null){
      calificacion = "";
    }
    let respuesta1 : string = '';

    this.firebase.agregarCalificacionServicio(turno.especialidad, turno.especialista, turno.paciente, calificacion).then((respuesta:string)=>{
      respuesta1 = respuesta;

      if(respuesta1 != "Se ha calificado el turno"){
        this.notificaciones.mostrarError("Error", respuesta1);
      }else{
        this.notificaciones.mostrarExito("Éxito",respuesta1);
      }       
    });
     
  }
}
