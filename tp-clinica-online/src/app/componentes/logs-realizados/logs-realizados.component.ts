import { Component, OnInit, ElementRef, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-logs-realizados',
  templateUrl: './logs-realizados.component.html',
  styleUrls: ['./logs-realizados.component.css']
})
export class LogsRealizadosComponent {

  @Input() logsUsuarios :any[] = [];

  arrayLogs :any[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['logsUsuarios']) {
      this.cargarLogsUsuarios();
    }
  }

  cargarLogsUsuarios(){
    this.arrayLogs = this.logsUsuarios;
  }

}
