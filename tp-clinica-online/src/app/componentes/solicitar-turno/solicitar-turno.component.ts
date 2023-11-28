import { Component } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { TurnosService } from 'src/app/servicios/turnos.service';

@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.css']
})
export class SolicitarTurnoComponent {

  constructor(private firebase : FirebaseService, private turnos : TurnosService){}

  public horariosDisponiblesEspecialistas : any[] = [];
  obser$ : any;
  obserEspecialistas$:any;

  public especialistas : any[] = [];
  public especialidades: any[] = [];
  public especialistasConFoto :any[] = [];

  public horariosDisponiblesDeEseEspecialistaConEsaEspecialidad : any[] = [];
  public especialistaElegido : string = "";
  public especialidadElegida : string = "";
  obserTurnos$ : any;

  ngOnInit(){
    this.obserEspecialistas$ = this.firebase.traerEspecialistasRegistrados().subscribe(datos=>{
      this.cargarEspecialistas(datos);
    });

    this.obser$ = this.firebase.traerTodosLosHorariosEspecialistas().subscribe(datos=>{
      this.cargarTurnos(datos);
    });


  }

  ngOnDestroy(){
    if(this.obser$){
      this.obser$.unsubscribe();
    }

    if(this.obserEspecialistas$){
      this.obserEspecialistas$.unsubscribe();
    }

  }

  cargarEspecialidadesEspecialista(item:any){
    let especialidades : any[] = [];
    this.especialistaElegido = item;

    this.horariosDisponiblesEspecialistas.forEach((horario:any)=>{
      if(horario.especialista == item && !especialidades.includes(horario.especialidad)){
        especialidades.push(horario.especialidad);
      }
    });

    this.especialidades = especialidades;
  }

  cargarEspecialistas(arrayDatos : any[]){
    let especialistas : any[] = [];

    if(arrayDatos.length > 0){
      arrayDatos.forEach((dato:any)=>{
        let objDato = {
          nombre: dato.nombre + " "+dato.apellido,
          foto : dato.imagen[0],
        };

        if(!especialistas.includes(objDato)){
          especialistas.push(objDato);
        }
      });
    }

    this.especialistasConFoto = especialistas;    
  }

  cargarTurnos(arrayDatos : any[]){

    let turnos : any[] = [];
    let horarios : any[] = [];
    let especialistasNombre : any[] = [];
    let especialidades : string[] = [];

    if(arrayDatos.length > 0){

      arrayDatos.forEach((dato:any)=>{
        let objEspecialista = {
          nombre: dato.especialista,
          foto: this.traerFotoDelEspecialista(dato.especialista, this.especialistasConFoto),
        };

        if (!especialistasNombre.some(especialista => especialista.nombre === objEspecialista.nombre)) {
          especialistasNombre.push(objEspecialista);
        }

        if(!especialidades.includes(dato.especialidad)){
          especialidades.push(dato.especialidad);
        }

        if(dato.dias.length > 0){

          let objTurno = {
            especialista: dato.especialista,
            especialidad:dato.especialidad,
            duracionTurno:dato.duracionTurno,
            horarios : this.turnos.devolverCalendarizacionTodosLosDias(dato.dias, dato.duracionTurno)
          }
          if(!turnos.includes(objTurno)){
            turnos.push(objTurno);
          }
        }
      });
    }

    this.especialistas = especialistasNombre;
    this.horariosDisponiblesEspecialistas = turnos;

  }
  
  traerFotoDelEspecialista(nombreEspecialista : string, arrayEspecialistas : any[]){
    let fotoEspecialista : string = "";
    arrayEspecialistas.forEach((especialista:any)=>{
      if(especialista.nombre == nombreEspecialista){
        fotoEspecialista = especialista.foto;
      }
    });
    return fotoEspecialista;
  }

  mostrarTurnosDisponibles(itemEspecialidad:any){

    if(this.obserTurnos$){
      this.obserTurnos$.unsubscribe();
    }
    
    let horariosDisponibles : any[] = [];
    this.especialidadElegida = itemEspecialidad;
    let fechaOcupadas : any[] = [];

    this.obserTurnos$ = this.firebase.traerTurnosOcupados(this.especialistaElegido, this.especialidadElegida).subscribe(datos=>{
      this.cargarFechasOcupadas(datos).forEach((fecha:any)=>{
        fechaOcupadas.push(fecha);
      });

      this.horariosDisponiblesEspecialistas.forEach((horario:any)=>{
        if(horario.especialista == this.especialistaElegido && horario.especialidad == itemEspecialidad){
          horario.horarios.forEach((dia:any)=>{
            //console.log(fechaOcupadas);
            if(!horariosDisponibles.includes(dia) && !fechaOcupadas.includes(dia)){
              horariosDisponibles.push(dia);
            }
          });
        }
      });
    });
   
    this.horariosDisponiblesDeEseEspecialistaConEsaEspecialidad = horariosDisponibles;
  }


  solicitarTurno(dia:string, indice : number){
    if(indice != -1){
      this.horariosDisponiblesDeEseEspecialistaConEsaEspecialidad.splice(indice,1);
    }

    if(!this.firebase.flagEsAdmin){
      this.firebase.guardarTurnoParaElPaciente(this.firebase.nombreUsuario, this.firebase.email, this.especialistaElegido, this.especialidadElegida, dia);
    }
  }

  cargarFechasOcupadas(arrayDatos :any[]){
      let arrayFechasOcupadas : any[] = [];

      if(arrayDatos.length > 0){
        arrayDatos.forEach((dato:any)=>{
          arrayFechasOcupadas.push(dato.diaTurno);
        })
      }
      return arrayFechasOcupadas;
  }
}
