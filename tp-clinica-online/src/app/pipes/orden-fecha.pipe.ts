import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ordenFecha'
})
export class OrdenFechaPipe implements PipeTransform {

  transform(array: any[]): any[] {
    if (!array || array.length === 0) {
      return array;
    }

    // Ordenar el array por la propiedad 'fecha'
    array.sort((a, b) => {
      const fechaA = new Date(a.fecha);
      const fechaB = new Date(b.fecha);

      return fechaA.getTime() - fechaB.getTime();
    });

    return array;
  }
}

