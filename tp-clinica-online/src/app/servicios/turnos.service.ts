import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {

  constructor() { }


  mostrarDia(){
    const date = new Date();
  
    const dia = date.getDate();
    const mes = date.getMonth() + 1; // Meses en JavaScript son 0-indexados, por eso sumamos 1
    const anio = date.getFullYear();
    const horas = date.getHours();
    const minutos = date.getMinutes();
    const segundos = date.getSeconds();
  
    const formatoFecha = `${dia}/${mes}/${anio} ${horas}:${minutos}:${segundos}`;
    
    alert(formatoFecha);

  }

  mostrarDiasDelMes(minutos: number, numeroDiaDeLaSemana: number) {
    const fechaInicio = new Date();
    fechaInicio.setHours(8, 0, 0, 0); // Establecer la hora a las 08:00:00
  
    const fechasUnicas = new Set<string>(); // para evitar duplicados
  
    const ultimoDiaDelMes = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth() + 1, 0).getDate();
  
    for (let dia = 1; dia <= ultimoDiaDelMes; dia++) {
      let fechaActual = new Date(fechaInicio.getTime()); // Copiar la fecha base
  
      // Ajustar la fecha al día de la semana deseado
      fechaActual.setDate(dia + numeroDiaDeLaSemana - fechaActual.getDay());
  
      // Verificar si la fecha está dentro del mes actual y no ha pasado
      if (
        fechaActual.getMonth() === fechaInicio.getMonth() &&
        fechaActual > fechaInicio &&
        fechaActual.getDay() === numeroDiaDeLaSemana
      ) {
        while (fechaActual.getHours() < 19 && fechaActual.getMinutes() < 60) {
          const diaActual = fechaActual.getDate();
          const mesActual = fechaActual.getMonth() + 1;
          const anioActual = fechaActual.getFullYear();
          const horas = fechaActual.getHours();
          const minutosActual = fechaActual.getMinutes();
          const segundos = fechaActual.getSeconds();
  
          const formatoFecha = `${diaActual}/${mesActual}/${anioActual} ${this.agregarCero(horas)}:${this.agregarCero(minutosActual)}:${this.agregarCero(segundos)}`;
          fechasUnicas.add(formatoFecha);
  
          // Agregar el intervalo de minutos proporcionado
          fechaActual.setMinutes(fechaActual.getMinutes() + minutos);
        }
      }
    }
  
    // Convertir el conjunto a un array y ordenarlo por fecha
    const diasDelMes = Array.from(fechasUnicas).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  
    return diasDelMes;
  }


  retornarCalendarizacionTurnos(minutos: number, numeroDiaDeLaSemana: number, especialidad : string, especialista : any){
    
    let dias = this.mostrarDiasDelMes(minutos, numeroDiaDeLaSemana);
    
    let turnos : any[] = [];

    dias.forEach(dia=>{
      let obj = {
        especialista: especialista.nombre + " "+especialista.apellido,
        especialidad: especialidad,
        estaDisponible: 'true',
        paciente : '',
        estadoTurno:'disponible', //cuando el paciente lo pide, pasará a estado pendiente, y luego el especialista puede aceptar o rechazar el turno
        fecha:dia
      };
      turnos.push(obj)
    });

    return turnos;
  }
  
  
  
   agregarCero(valor:number) {
    return valor < 10 ? `0${valor}` : valor;
  }

  retornarValorDia(dia : string) : number {
    let number = 0;
    switch(dia){
      case "Lunes":
        number = 1;
        break;
      case "Martes":
        number = 2;
        break;
      case "Miércoles":
        number = 3;
        break;
      case "Jueves":
        number = 4;
        break;
      case "Viernes":
        number = 5;
        break;
      case "Sábado":
        number = 6;
        break;
    }
    return number;
  }
  
  
  


}
