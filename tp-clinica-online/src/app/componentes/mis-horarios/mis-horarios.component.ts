// mis-horarios.component.ts

import { Component, Input } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { NotificacionService } from 'src/app/servicios/notificacion.service';
import { TurnosService } from 'src/app/servicios/turnos.service';

@Component({
  selector: 'app-mis-horarios',
  templateUrl: './mis-horarios.component.html',
  styleUrls: ['./mis-horarios.component.css']
})
export class MisHorariosComponent {
  @Input() especialidades: any[] = [
    { nombre: 'pediatria', horarios: [], duracionCadaTurno:0 },
    { nombre: 'neonatología', horarios: [], duracionCadaTurno:0 }
    // Agrega más especialidades según sea necesario
  ];

  miEspecialidad: any = this.especialidades[0];

  diasDeLaSemana: string[] = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  duracionCadaTurno: number = 0;
  
  constructor(private toast : NotificacionService, private firebase : FirebaseService, private turnos: TurnosService){

  }

  ngOnInit(){
    this.mostrarEspecialidad(this.especialidades[0]);
  }

  mostrarEspecialidad(especialidad: any) {
    this.miEspecialidad = especialidad;
  }

  seleccionarDia(dia: string) {
    const index = this.miEspecialidad.horarios.indexOf(dia);

    if (index === -1) {
      this.miEspecialidad.horarios.push(dia);

    } else {
      this.miEspecialidad.horarios.splice(index, 1);
    }
  }

  esDiaSeleccionado(dia: string): boolean {
    return this.miEspecialidad.horarios.includes(dia);
  }

  esDiaEnOtraEspecialidad(dia: string): boolean {
    return this.especialidades.some(especialidad =>
      especialidad.horarios.includes(dia) && especialidad !== this.miEspecialidad
    );
  }

  agregarDuracion() {
    if (this.duracionCadaTurno >= 0 && Number.isInteger(this.duracionCadaTurno)) {
      // Validar que la duración sea un número entero mayor o igual a 0
      this.especialidades.forEach(especialidad => {
        especialidad.duracionCadaTurno = this.duracionCadaTurno;
      });
      // Puedes hacer algo más con la duración si es necesario
    } else {
      // Mostrar mensaje de error o realizar otra acción en caso de invalidez
      this.toast.mostrarError("Turnos","La duración de cada turno debe ser un número entero mayor o igual a 0");
    }
  }

  guardarHorarios(){
    const especialistaIngresado = this.firebase.objUsuarioLogueado;

    let agendaTurnos : any[] = [];

    this.especialidades.forEach(especialidadItem=>{
      
      especialidadItem.horarios.forEach((element : string) => {
        let dia = this.turnos.retornarValorDia(element);
        let turnosAgenda = this.turnos.retornarCalendarizacionTurnos(this.duracionCadaTurno, dia, especialidadItem.nombre, especialistaIngresado);
        agendaTurnos.push(turnosAgenda);
      });
    })

    this.firebase.guardarTodosLosTurnos(agendaTurnos);

    //acá hay que guardar el especialista (nombre o dni), las especialidades, y los turnos
    //Quedaría Especialista, especialidad, horarios

    /*

    */
  }

}
