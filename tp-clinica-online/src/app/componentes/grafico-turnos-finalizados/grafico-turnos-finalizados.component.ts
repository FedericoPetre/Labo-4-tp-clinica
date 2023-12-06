import { Component, OnInit, ElementRef, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, BarElement, BarController, CategoryScale, Decimation, Filler, Legend, Title, Tooltip, LinearScale, registerables } from 'chart.js';
@Component({
  selector: 'app-grafico-turnos-finalizados',
  templateUrl: './grafico-turnos-finalizados.component.html',
  styleUrls: ['./grafico-turnos-finalizados.component.css']
})
export class GraficoTurnosFinalizadosComponent {
  @Input() turnosFinalizadosEspecialistas :any[] = [];

  @ViewChild('graficoTurnosFinalizados') private chartRef?: ElementRef;
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
   if (changes['turnosFinalizadosEspecialistas']) {
     this.cargarEspecialistasYCantidades();
   }
 }
 
 createDoughnut() {
 
   if (this.chart) {
     this.chart.destroy();
   }
 
   let colores :string [] = ["#18bc9c", "#3498db","#2ecc71", "#9b59b6", "#e74c3c", "#f39c12", "#2c3e50", "#c0392b", "#27ae60", "#2980b9", "#8e44ad", "#d35400", "#16a085"];
 
   const ctx = (<any>document.getElementById('graficoTurnosFinalizados')).getContext('2d');
 
   this.chart = new Chart(ctx, {
     type: 'doughnut',
     data: {
       labels: this.especialistas,
       datasets: [{
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
   this.turnosFinalizadosEspecialistas.forEach((turno:any)=>{
     especialistas.push(turno.especialista);
     cantidades.push(turno.cantidadTurnos);
   });
 
 
   this.cantidadTurnos = cantidades;
   this.especialistas = especialistas;
 
   this.createDoughnut();
 }

}
