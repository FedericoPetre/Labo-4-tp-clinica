import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tabla-turnos-paciente',
  templateUrl: './tabla-turnos-paciente.component.html',
  styleUrls: ['./tabla-turnos-paciente.component.css']
})
export class TablaTurnosPacienteComponent {
  @Input() misTurnosPaciente : any[] = [];
}
