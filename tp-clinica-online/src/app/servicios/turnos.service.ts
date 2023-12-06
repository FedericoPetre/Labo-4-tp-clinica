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
  
    // Obtener la fecha actual para comparaciones
    const fechaActual = new Date(fechaInicio.getTime());
  
    // Iterar sobre las próximas 4 semanas
    for (let semana = 0; semana < 4; semana++) {
      // Ajustar la fecha al día de la semana deseado
      fechaActual.setDate(fechaActual.getDate() + numeroDiaDeLaSemana - fechaActual.getDay());
  
      // Iterar sobre los días de la semana
      for (let dia = 0; dia < 7; dia++) {
        // Verificar si la fecha está dentro del rango deseado y no ha pasado
        if (fechaActual > fechaInicio) {
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
  
        // Pasar al siguiente día
        fechaActual.setDate(fechaActual.getDate() + 1);
      }
    }
  
    // Convertir el conjunto a un array y ordenarlo por fecha
    const diasDelMes = Array.from(fechasUnicas).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  
    return diasDelMes;
  }
  


  retornarCalendarizacionTurnos(minutos: number, numeroDiaDeLaSemana: number){
    
    let dias = this.mostrarDiasDelMes(minutos, numeroDiaDeLaSemana);
    console.log(dias);
    let turnos : any[] = [];

    dias.forEach(dia=>{
      let obj = {
        estaDisponible: 'true',
        paciente : '',
        estadoTurno:'disponible', //cuando el paciente lo pide, pasará a estado pendiente, y luego el especialista puede aceptar o rechazar el turno
        fecha:dia
      };

      if(!turnos.includes(obj)){
        turnos.push(obj)
      }
    });
    return turnos;
  }

  compararFechas = (obj1: Date, obj2: Date): number => {
    const fechaA = new Date(obj1);
    const fechaB = new Date(obj2);
  
    if (fechaA < fechaB) {
      return -1;
    } else if (fechaA > fechaB) {
      return 1;
    } else {
      return 0;
    }
  }

  obtenerFechaFormateada(fecha : Date): string {
    const dia = this.agregarCero(fecha.getDate());
    const mes = this.agregarCero(fecha.getMonth() + 1);
    const anio = fecha.getFullYear();
    const hora = this.agregarCero(fecha.getHours());
    const minutos = this.agregarCero(fecha.getMinutes());
    const segundos = this.agregarCero(fecha.getSeconds());

    return `${dia}/${mes}/${anio} ${hora}:${minutos}:${segundos}`;
  }
  
  
  
   agregarCero(valor:number) {
    return valor < 10 ? `0${valor}` : valor;
  }

  retornarValorDia(dia : string) : number {
    let number = 0;
    switch(dia){
      case "Lunes":
        number = 0;
        break;
      case "Martes":
        number = 1;
        break;
      case "Miércoles":
        number = 2;
        break;
      case "Jueves":
        number = 3;
        break;
      case "Viernes":
        number = 4;
        break;
      case "Sábado":
        number = 5;
        break;
    }
    return number;
  }
  

  retornarDia(dia : number) : string {
   let diasDeLaSemana: string[] = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

   return diasDeLaSemana[dia];
  }

  retornarDias(dias:number[]) : string[]{
    let diasDeLaSemana : string[] = [];

    dias.forEach((dia:number)=>{
      diasDeLaSemana.push(this.retornarDia(dia));
    })

    return diasDeLaSemana;
  }

  retornarCantidadDias(mes:number){
    let cantidadDias : number = -1;

    switch(mes){
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
      case 12:
        cantidadDias = 31;
        break;
      case 2:
        cantidadDias = 28;
        break;
      case 4:
      case 6:
      case 9:
      case 11:
        cantidadDias = 30;
        break;
    }

    return cantidadDias;
  }

  /**
   * 
   * @param diaSemana 0:Lunes, 1:Martes, 2:Mie, 3:Jue, 4:Vie, 5:Sa, 6:Dom
   * @param mes 
   * @returns 
   */
  obtenerDiasDelMesPorDiaSemana(diaSemana: number, mes: number): number[] {
    let diasDelMes: number[] = [];
    
    //dia Semana: 0 Lunes, 1 Martes, 2 Miercoles, 3 Jueves, 4 Viernes, 5 Sábado
    const primerDia = new Date();
    const diaActual = primerDia.getDate();

    if(mes == 11){
      switch(diaSemana){
        case 0:
          diasDelMes = [27];
          break;
        case 1:
          diasDelMes = [28];
          break;
        case 2:
          diasDelMes = [29];
          break;
        case 3:
          diasDelMes = [30];
          break;
      }
    }else if(mes == 12){
      switch(diaSemana){
        case 0:
          diasDelMes = [4,11,18,25];
          break;
        case 1:
          diasDelMes = [5,12,19,26];
          break;
        case 2:
          diasDelMes = [6,13,20,27];
          break;
        case 3:
          diasDelMes = [7,14,21,28];
          break;
        case 4:
          diasDelMes = [1,8,15,22,29];
          break;
        case 5:
          diasDelMes = [2,9,16,23,30];
          break;
      }
    }




  
    // Obtener el día de la semana del primer día de
    return diasDelMes;
}

  obtenerHorasConDiferencia(minutos: number) {
    const horaInicio = new Date();
    horaInicio.setHours(8, 0, 0, 0); // Establecer la hora a las 08:00:00
  
    const horaFin = new Date();
    horaFin.setHours(19, 0, 0, 0); // Establecer la hora a las 19:00:00
  
    const horas = [];
  
    let horaActual = new Date(horaInicio.getTime());
  
    while (horaActual <= horaFin) {
      horas.push(new Date(horaActual)); // Almacenar la fecha actual, no solo las horas
  
      // Agregar el intervalo de minutos proporcionado
      horaActual.setMinutes(horaActual.getMinutes() + minutos);
    }
  
    return horas;
  }
  
  
  obtenerFormatoHora(fecha: Date): Date {
    const horas = fecha.getHours();
    const minutos = fecha.getMinutes();
    const segundos = fecha.getSeconds();
  
    const nuevaFecha = new Date(fecha);
    nuevaFecha.setHours(horas, minutos, segundos);
  
    return nuevaFecha;
  }
  

  devolverCalendarizacion(diaSemana: number, mes: number, minutos: number) {
    let turnos: Date[] = [];
    let diasDelMes: number[] = [];
    let calendario: Date[] = [];
  
    let horariosTurnos: Date[] = this.obtenerHorasConDiferencia(minutos);
    this.obtenerDiasDelMesPorDiaSemana(diaSemana, mes).forEach((dia: number) => {
      horariosTurnos.forEach((horario: Date) => {
        let horarioDate = new Date(2023, mes - 1, dia, horario.getHours(), horario.getMinutes(), horario.getSeconds());
        if (!calendario.some(date => date.getTime() === horarioDate.getTime())) {
          calendario.push(horarioDate);
        }
      });
    });
  
    return calendario.sort(this.compararFechas);
  }
  
  devolverCalendarizacionTodosLosDias(diasSemanas:any[], minutos:number){
    let calendarioCompleto : any[] = [];
    diasSemanas.forEach((dia:any)=>{
      this.retornarDiasDeLaQuincenaElegido(dia, minutos).forEach((horario:any)=>{
        if(!calendarioCompleto.includes(horario)){
          calendarioCompleto.push(horario);
        }
      });
    });
    calendarioCompleto.sort(this.compararFechas);

    let calendarioFormateado : any[] = [];

    calendarioCompleto.forEach((horario:Date)=>{
      let fechaFormateada : string = horario.getDate()+"/"+(horario.getMonth()+1)+"/"+horario.getFullYear()+" "+this.agregarCero(horario.getHours())+":"+this.agregarCero(horario.getMinutes())+":"+this.agregarCero(horario.getSeconds());
      calendarioFormateado.push(fechaFormateada);
    });

    return calendarioFormateado;
  }



  retornarSiguientesQuinceDias(): Date[] {
    const listaFechas: Date[] = [];
    const hoy = new Date();

    for (let i = 0; i < 15; i++) {
      const fecha = new Date();
      fecha.setDate(hoy.getDate() + i);
      listaFechas.push(fecha);
    }

    return listaFechas;
  }

  retornarDiasDeLaQuincenaElegido(diaDeLaSemana:number, minutos : number){
    let diasDeLaSemana : Date[] = [];
    let siguientesQuinceDias : Date[] = this.retornarSiguientesQuinceDias();
    let horariosTurnos: Date[] = this.obtenerHorasConDiferencia(minutos);

    let diaSemanaCorregido : number = diaDeLaSemana + 1;

    siguientesQuinceDias.forEach((dia:Date)=>{
      if(dia.getDay() == diaSemanaCorregido){
        horariosTurnos.forEach((horario:Date)=>{
          let horarioDate = new Date(2023, dia.getMonth(), dia.getDate(), horario.getHours(), horario.getMinutes(), horario.getSeconds());
          if (!diasDeLaSemana.some(date => date.getTime() === horarioDate.getTime())) {
            diasDeLaSemana.push(horarioDate);
          }
  
        });        
      }
    });

    return diasDeLaSemana;

  }

  


  compararDiaDelTurno = (obj1: any, obj2: any): number => {
    const fechaA = new Date(obj1.diaDelTurno.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3'));
    const fechaB = new Date(obj2.diaDelTurno.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3'));
  
    if (fechaA < fechaB) {
      return -1;
    } else if (fechaA > fechaB) {
      return 1;
    } else {
      return 0;
    }
  }

  private convertirAFecha(fechaString :string) {
    // Dividir la cadena y convertir a fecha
    const partesFecha = fechaString.split('/');
    const dia = parseInt(partesFecha[0], 10);
    const mes = parseInt(partesFecha[1], 10) - 1; 
    const anio = parseInt(partesFecha[2], 10);

    return new Date(anio, mes, dia);
  }

  obtenerNombreDia(fechaString :string) {
    let fecha  = this.convertirAFecha(fechaString);
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const indiceDia = fecha.getDay();
    return diasSemana[indiceDia];
  }

  determinarSiLafechaSeEncuentraEnLosProximos10Dias(fechaString: string): boolean {
    const partesFecha = fechaString.split('/');
    const dia = parseInt(partesFecha[0], 10);
    const mes = parseInt(partesFecha[1], 10) - 1; 
    const anio = parseInt(partesFecha[2], 10);
  
    // JavaScript cuenta los meses desde 0, por lo que restamos 1 al mes
    const fecha = new Date(
      parseInt(partesFecha[2]),
      parseInt(partesFecha[1]) - 1,
      parseInt(partesFecha[0]),
    );
  
    const hoy = new Date();
    const diferenciaEnMilisegundos = fecha.getTime() - hoy.getTime();
    const diferenciaEnDias = diferenciaEnMilisegundos / (1000 * 60 * 60 * 24);
  
    return diferenciaEnDias >= 0 && diferenciaEnDias <= 10;
  }
  
  determinarSiLafechaSeEncuentraEnLosUltimos10Dias(fechaString: string): boolean {
    const partesFecha = fechaString.split('/');
    const dia = parseInt(partesFecha[0], 10);
    const mes = parseInt(partesFecha[1], 10) - 1; 
    const anio = parseInt(partesFecha[2], 10);
  
    // JavaScript cuenta los meses desde 0, por lo que restamos 1 al mes
    const fecha = new Date(
      parseInt(partesFecha[2]),
      parseInt(partesFecha[1]) - 1,
      parseInt(partesFecha[0]),
    );

    const hoy = new Date();
    const diferenciaEnMilisegundos = hoy.getTime() - fecha.getTime();
    const diferenciaEnDias = diferenciaEnMilisegundos / (1000 * 60 * 60 * 24);
  
    return diferenciaEnDias >= 0 && diferenciaEnDias <= 10;
  }
  
  
}
