import { Component, OnInit, ElementRef, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, BarElement, BarController, CategoryScale, Decimation, Filler, Legend, Title, Tooltip, LinearScale, registerables } from 'chart.js';
@Component({
  selector: 'app-grafico-barras',
  templateUrl: './grafico-barras.component.html',
  styleUrls: ['./grafico-barras.component.css']
})
export class GraficoBarrasComponent {
  @Input() turnosPorDiaDeLaSemana :any[] = [];

 @ViewChild('graficoBarra') private chartRef?: ElementRef;
 private chart: any;


 cantidadTurnos :number[] = [];
 diasDeLaSemana :string[] = [];

 constructor(){
  Chart.register(BarElement, BarController, CategoryScale, Decimation, Filler, Legend, Title, Tooltip, LinearScale);
  Chart.register(...registerables);
 }

 ngOnInit() {
}

ngOnChanges(changes: SimpleChanges) {
  if (changes['turnosPorDiaDeLaSemana']) {
    this.cargarDiasDeLaSemanaYCantidades();
  }
}

createBarChart() {

  if (this.chart) {
    this.chart.destroy();
  }

  let colores :string [] = [
    '#9C27B0', '#FF9800', '#2196F3', '#E91E63', '#00BCD4',
    '#FF5733', '#33FF57', '#5733FF', '#FFD700', '#4CAF50',
    '#FFC107', '#3F51B5', '#8BC34A', '#FF5722', '#607D8B'
  ];

  const ctx = (<any>document.getElementById('graficoBarra')).getContext('2d');

  this.chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: this.diasDeLaSemana,
      datasets: [{
        label:'Turnos por dia de la semana',
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

cargarDiasDeLaSemanaYCantidades(){
  let cantidades :number[] = [];
  let diasDeLaSemana : string[] = [];

const ordenDias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

this.turnosPorDiaDeLaSemana.sort((a, b) => {
  const indiceA = ordenDias.indexOf(a.dia);
  const indiceB = ordenDias.indexOf(b.dia);
  
  return indiceA - indiceB;
});

  this.turnosPorDiaDeLaSemana.forEach((turno:any)=>{
    diasDeLaSemana.push(turno.dia);
    cantidades.push(turno.cantidadTurnos);
  });


  this.cantidadTurnos = cantidades;
  this.diasDeLaSemana = diasDeLaSemana;

  this.createBarChart();
}


}
