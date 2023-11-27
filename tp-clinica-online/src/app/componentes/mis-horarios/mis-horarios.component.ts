// mis-horarios.component.ts

import { Component, Input } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { NotificacionService } from 'src/app/servicios/notificacion.service';
import { TurnosService } from 'src/app/servicios/turnos.service';

@Component({
  selector: 'app-mis-horarios',
  templateUrl: './mis-horarios.component.html',
  styleUrls: ['./mis-horarios.component.css']
})
export class MisHorariosComponent {
  @Input() especialidades: any[] = [
    { nombre: 'pediatria', horarios: [], duracionCadaTurno:0 },
    { nombre: 'neonatología', horarios: [], duracionCadaTurno:0 }
    // Agrega más especialidades según sea necesario
  ];

  miEspecialidad: any = this.especialidades[0];

  diasDeLaSemana: string[] = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  duracionCadaTurno: number = 0;
  obser$ :any;
  flagModifico : boolean = false;
  
  constructor(private toast : NotificacionService, private firebase : FirebaseService, private turnos: TurnosService, private notificacion : NotificacionService){
    
  }
  
  ngAfterViewInit(){
    const especialistaIngresado1 = this.firebase.objUsuarioLogueado;
    this.obser$ = this.firebase.traerHorariosEspecialista(especialistaIngresado1.nombre + " "+especialistaIngresado1.apellido).subscribe(datos=>{
      this.cargarDias(datos);
    })
  }

  ngOnDestroy(){
    if(this.obser$){
      this.obser$.unsubscribe();
    }
  }

  mostrarEspecialidad(especialidad: any) {
    this.miEspecialidad = especialidad;
  }

  seleccionarDia(dia: string) {
    const index = this.miEspecialidad.horarios.indexOf(dia);

    if (index === -1) {
      this.miEspecialidad.horarios.push(dia);

    } else {
      this.miEspecialidad.horarios.splice(index, 1);
    }
  }

  esDiaSeleccionado(dia: string): boolean {
    return this.miEspecialidad.horarios.includes(dia);
  }

  esDiaEnOtraEspecialidad(dia: string): boolean {
    return this.especialidades.some(especialidad =>
      especialidad.horarios.includes(dia) && especialidad !== this.miEspecialidad
    );
  }

  agregarDuracion() {
    if (this.duracionCadaTurno >= 0 && Number.isInteger(this.duracionCadaTurno)) {
      // Validar que la duración sea un número entero mayor o igual a 0
      this.especialidades.forEach(especialidad => {
        especialidad.duracionCadaTurno = this.duracionCadaTurno;
      });
      // Puedes hacer algo más con la duración si es necesario
    } else {
      // Mostrar mensaje de error o realizar otra acción en caso de invalidez
      this.toast.mostrarError("Turnos","La duración de cada turno debe ser un número entero mayor o igual a 0");
    }
  }

  guardarHorarios(){
    const especialistaIngresado = this.firebase.objUsuarioLogueado;

    let horariosAGuardar : any[] = [];

    this.especialidades.forEach(especialidadItem=>{
      let dias : any[] = [];
      
      especialidadItem.horarios.forEach((element : string) => {
        let dia = this.turnos.retornarValorDia(element);
        dias.push(dia);
        
      });

      let horarios : any = {
        dias:dias,
        duracionTurno:this.duracionCadaTurno,
        especialidad: especialidadItem.nombre,
        especialista: especialistaIngresado.nombre + " "+especialistaIngresado.apellido,
      };

      horariosAGuardar.push(horarios);
     
    })

    for(let i=0; i<horariosAGuardar.length; i++){
      let horarioI = horariosAGuardar[i];
      this.firebase.modificarHorariosEspecialista(horarioI.especialidad, horarioI.especialista, horarioI.dias, horarioI.duracionTurno).then((respuesta:string)=>{
        if(i==horariosAGuardar.length-1){
          if(respuesta != "Error al guardar tus nuevos horarios"){
            this.notificacion.mostrarExito("Horarios", respuesta);
          }
          else{
            this.notificacion.mostrarError("Horarios", respuesta);
          }

        }
      });
    }

  }

cargarDias(arrayDatos: any[]) {
  if (arrayDatos.length > 0) {
    arrayDatos.forEach((especialidad: any) => {
      const especialidadItem = this.encontrarEspecialidad(especialidad.especialidad);
      if (especialidadItem) {
        this.mostrarEspecialidad(especialidadItem);

        // Limpiar días en la especialidad actual
        this.miEspecialidad.horarios = [];

        // Seleccionar días del array de la especialidad
        this.turnos.retornarDias(especialidad.dias).forEach((dia:string)=>{
          this.seleccionarDia(dia);

        });    

        this.duracionCadaTurno = especialidad.duracionTurno;
        this.agregarDuracion();
      }
    });
  }
}


  encontrarEspecialidad(nombreEspecialidad:string){
    let especialidadObj : any;

    this.especialidades.forEach((especialidad:any)=>{
      if(especialidad.nombre == nombreEspecialidad){
        especialidadObj = especialidad;
      }
    })

    return especialidadObj;
  }

}
