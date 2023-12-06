import { Component, OnInit, ElementRef, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, BarElement, BarController, CategoryScale, Decimation, Filler, Legend, Title, Tooltip, LinearScale, registerables } from 'chart.js';
@Component({
  selector: 'app-grafico-turnos-solicitados-por-medico',
  templateUrl: './grafico-turnos-solicitados-por-medico.component.html',
  styleUrls: ['./grafico-turnos-solicitados-por-medico.component.css']
})
export class GraficoTurnosSolicitadosPorMedicoComponent {
  @Input() turnosPorEspecialistaLapsoDeTiempo :any[] = [];

  @ViewChild('graficoTurnosSolicitados') private chartRef?: ElementRef;
  private chart: any;
 
 
  cantidadTurnos :number[] = [];
  especialistas :string[] = [];
 
  constructor(){
   Chart.register(BarElement, BarController, CategoryScale, Decimation, Filler, Legend, Title, Tooltip, LinearScale);
   Chart.register(...registerables);
  }
 
  ngOnInit() {
 }
 
 ngOnChanges(changes: SimpleChanges) {
   if (changes['turnosPorEspecialistaLapsoDeTiempo']) {
     this.cargarEspecialistasYCantidades();
   }
 }
 
 createBarChart() {
 
   if (this.chart) {
     this.chart.destroy();
   }
 
   let colores :string [] = ["#1a2b3c", "#4f5a6d", "#8c93a1", "#b7c0d2", "#e3e8f1", "#f5a623", "#fc6e51", "#18bc9c", "#2ecc71", "#3498db", "#9b59b6", "#e74c3c", "#f39c12", "#2c3e50", "#c0392b", "#27ae60", "#2980b9", "#8e44ad", "#d35400", "#16a085"];
 
   const ctx = (<any>document.getElementById('graficoTurnosSolicitados')).getContext('2d');
 
   this.chart = new Chart(ctx, {
     type: 'bar',
     data: {
       labels: this.especialistas,
       datasets: [{
         label:'Turnos solicitados dentro de los 10 días',
         data: this.cantidadTurnos,
         backgroundColor: colores,
         borderColor:colores,
         borderWidth: 1
       }]
     },
     options: {
       responsive: true,
       maintainAspectRatio: false
     }
   });
 
 }
 
 cargarEspecialistasYCantidades(){
   let cantidades :number[] = [];
   let especialistas : string[] = [];
   this.turnosPorEspecialistaLapsoDeTiempo.forEach((turno:any)=>{
     especialistas.push(turno.especialista);
     cantidades.push(turno.cantidadTurnos);
   });
 
 
   this.cantidadTurnos = cantidades;
   this.especialistas = especialistas;
 
   this.createBarChart();
 }
 
}
