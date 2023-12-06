import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaPipeFormat'
})
export class FechaPipe implements PipeTransform {

  transform(fecha: string | Date): unknown {
    if (!fecha) {
      return '';
    }

    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    
    const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
    
    const indiceDia = fechaObj.getDay(); // Devuelve un número de 0 (Domingo) a 6 (Sábado)
    const nombreDia = diasSemana[indiceDia];
    const dia = fechaObj.getDate().toString().padStart(2, '0');
    const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
    const anio = fechaObj.getFullYear();

    const horas = fechaObj.getHours().toString().padStart(2, '0');
    const minutos = fechaObj.getMinutes().toString().padStart(2, '0');
    const segundos = fechaObj.getSeconds().toString().padStart(2, '0');

    const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    const nombreMes = meses[parseInt(mes)-1];

    return `Fecha del Informe: ${nombreDia}, ${dia} de ${nombreMes} de ${anio} ${horas}:${minutos}hs`;
  }

}
