import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'recortarArray'
})
export class RecortarArrayPipe implements PipeTransform {
  
  transform(array: any[]): any[] {
    if (!Array.isArray(array)) {
      return array;
    }

    const longitudMaxima = 10;
    const inicio = Math.max(0, array.length - longitudMaxima);

    return array.slice(inicio);
  }

}
