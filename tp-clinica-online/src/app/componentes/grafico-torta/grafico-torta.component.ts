import { Component, OnInit, ElementRef, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, BarElement, BarController, CategoryScale, Decimation, Filler, Legend, Title, Tooltip, LinearScale, registerables } from 'chart.js';
@Component({
  selector: 'app-grafico-torta',
  templateUrl: './grafico-torta.component.html',
  styleUrls: ['./grafico-torta.component.css']
})
export class GraficoTortaComponent {
 @Input() turnosPorEspecialidad :any[] = [];

 @ViewChild('pieChart') private chartRef?: ElementRef;
 private chart: any;


 cantidadTurnos :number[] = [];
 especialidades :string[] = [];

 constructor(){
  Chart.register(BarElement, BarController, CategoryScale, Decimation, Filler, Legend, Title, Tooltip, LinearScale);
  Chart.register(...registerables);
 }

 ngOnInit() {
}

ngOnChanges(changes: SimpleChanges) {
  if (changes['turnosPorEspecialidad']) {
    this.cargarEspecialidadesYCantidades();
  }
}

createPieChart() {

  if (this.chart) {
    this.chart.destroy();
  }

  let colores :string [] = [
    '#FF5733', '#33FF57', '#5733FF', '#FFD700', '#4CAF50',
    '#9C27B0', '#FF9800', '#2196F3', '#E91E63', '#00BCD4',
    '#FFC107', '#3F51B5', '#8BC34A', '#FF5722', '#607D8B'
  ];

  const ctx = (<any>document.getElementById('graficoTorta')).getContext('2d');

  this.chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: this.especialidades,
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

cargarEspecialidadesYCantidades(){
  let cantidades :number[] = [];
  let especialidades : string[] = [];
  this.turnosPorEspecialidad.forEach((turno:any)=>{
    especialidades.push(turno.especialidad);
    cantidades.push(turno.cantidadTurnos);
  });

  this.cantidadTurnos = cantidades;
  this.especialidades = especialidades;

  this.createPieChart();
}


}
