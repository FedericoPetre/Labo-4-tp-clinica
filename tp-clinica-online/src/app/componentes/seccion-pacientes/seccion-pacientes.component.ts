import { Component } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-seccion-pacientes',
  templateUrl: './seccion-pacientes.component.html',
  styleUrls: ['./seccion-pacientes.component.css']
})
export class SeccionPacientesComponent {

  nombreUsuario : string = "";
  obserPacientesQueAtendi$ : any;
  misTurnosFinalizados : any[] = [];
  turnosFinalizadosDelPaciente : any[] = [];
  obserTodosLosPacientes$ :any;

  misPacientes : any[]  = [];

  constructor(private firebase : FirebaseService){
  }
  
  ngOnInit(){
    this.nombreUsuario = this.firebase.nombreUsuario;
    this.obserPacientesQueAtendi$ = this.firebase.traerMisTurnosFinalizados(this.nombreUsuario).subscribe(datos=>{
      this.cargarMisTurnosFinalizados(datos);

      this.obserTodosLosPacientes$ = this.firebase.traerPacientesRegistrados().subscribe(datos=>{
        this.cargarYFiltrarPorMisPacientes(datos);
      });
    });

  }

  ngOnDestroy(){
    if(this.obserTodosLosPacientes$){
      this.obserTodosLosPacientes$.unsubscribe();
    }

    if(this.obserPacientesQueAtendi$){
      this.obserPacientesQueAtendi$.unsubscribe();
    }
  }


  cargarMisTurnosFinalizados(arrayAux :any[]){
    let arrayTurnosFinalizados : any[] = [];

    if(arrayAux.length > 0){
      arrayAux.forEach((dato:any)=>{
        let objTurno = {
          diaDelTurno : dato.diaTurno,
          especialidad : dato.especialidad,
          estado : dato.estadoTurno,
          especialista: dato.nombreEspecialista,
          fueRealizado: dato.fueRealizado,
          resenia: dato.resenia,
          calificacionAtencion: dato.calificacionAtencion,
          comentarioCancelacion : dato.comentarioCancelacion,
          paciente: dato.paciente,
          mailPaciente:dato.mailPaciente
        };

        arrayTurnosFinalizados.push(objTurno);

      })
    }

    this.misTurnosFinalizados = arrayTurnosFinalizados;
  }

  mostrarTurnosDelPaciente(nombrePaciente : string){
    let arrayTurnosPaciente : any[] = [];

    this.misTurnosFinalizados.forEach((turno:any)=>{
      if(turno.paciente == nombrePaciente){
        arrayTurnosPaciente.push(turno);
      }
    });

    this.turnosFinalizadosDelPaciente = arrayTurnosPaciente;
  }

  cargarYFiltrarPorMisPacientes(arrayAux:any[]){
    let misPacientes : any[] = [];
    if(arrayAux.length > 0){

      arrayAux.forEach((paciente:any)=>{
        
        if(this.verificarSiSeAntendioElPacienteConmigo(paciente.email)){
          let pacienteObj = {
            nombre:paciente.nombre+" "+paciente.apellido,
            foto:paciente.imagenes[0]
          };

          misPacientes.push(pacienteObj);
        }

      });

    }

    this.misPacientes = misPacientes;
  }

  private verificarSiSeAntendioElPacienteConmigo(emailPaciente:string){
    let flagSeAtendio : boolean = false;
    this.misTurnosFinalizados.forEach((turno:any)=>{
      if(turno.mailPaciente == emailPaciente){
        flagSeAtendio = true;
      }
    });

    return flagSeAtendio;
  }

}
