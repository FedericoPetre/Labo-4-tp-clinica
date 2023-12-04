import { Component, AfterViewInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { Subscription } from 'rxjs';
import { NotificacionService } from 'src/app/servicios/notificacion.service';

@Component({
  selector: 'app-componente-habilitaciones',
  templateUrl: './componente-habilitaciones.component.html',
  styleUrls: ['./componente-habilitaciones.component.css']
})
export class ComponenteHabilitacionesComponent implements AfterViewInit {
  obserPersonas$ : any;
  arrayPersonasRegistradas : any;

  especialistasSubscription?: Subscription;

  estadoHabilitado: { [email: string]: boolean } = {};

  obserHistoriasClinicas$ :any;

  historiasClinicas :any[] = [];

  ngAfterViewInit(){
  }

  ngOnInit(){
    this.obserHistoriasClinicas$ = this.firebase.traerTodasLasHistoriasClinicas().subscribe((datos=>{
      this.cargarHistoriasClinicas(datos);

      this.obserPersonas$ = this.firebase.retornarUsuarioRegistrados().subscribe((datos)=>{
        this.cargarUsuariosAutorizados(datos);
      });
    }));
  }

  ngOnDestroy(){
    if(this.obserPersonas$){
      this.obserPersonas$.unsubscribe();
    }

    if (this.especialistasSubscription) {
      this.especialistasSubscription.unsubscribe();
    }

    if(this.obserHistoriasClinicas$){
      this.obserHistoriasClinicas$.unsubscribe();
    }
  }

  constructor(private firebase : FirebaseService, private notificaciones : NotificacionService){

  }

  cargarHistoriasClinicas(arrayAux :any[]){
    let historiasClinicas : any[] = [];

    if(arrayAux.length > 0){
      arrayAux.forEach((historia:any)=>{
        let hClinica = {
          altura:historia.altura+" cm",
          paciente:historia.paciente,
          peso:historia.peso+" kg",
          presion:historia.presion+" mmHg",
          temperatura:historia.temperatura+" °C",
          detalle: historia.detalles,
          mailPaciente:historia.mailPaciente
        };

        historiasClinicas.push(hClinica);

      });
    }

    this.historiasClinicas = historiasClinicas;

  }

  async verHistoriaClinica(usuario:any){
    let historiaClinica = this.encontrarHistoriaPorMailPaciente(usuario.email);

    this.notificaciones.mostrarHistoriaClinica(historiaClinica).then((respuesta:string|null)=>{
      if(respuesta != null){
      }
    });
  }

  async descargarHistoriaClinica(usuario:any){
    let historiaClinica = this.encontrarHistoriaPorMailPaciente(usuario.email);
    let mensaje : string = `Altura: ${historiaClinica.altura},Peso: ${historiaClinica.peso},Presion: ${historiaClinica.presion},Temperatura: ${historiaClinica.temperatura},Detalles: ${historiaClinica.detalle}`;
    
  }


  private encontrarHistoriaPorMailPaciente(mailPaciente:string){
    let historia : any;
    for(let i=0; i<this.historiasClinicas.length; i++){
      if(this.historiasClinicas[i].mailPaciente == mailPaciente){
        historia = this.historiasClinicas[i];
        break;
      }
    }

    return historia;
  }


  cargarUsuariosAutorizados(arrayAux : any[]){
    let arrayNuevo : any[] = [];

    for(let i=0; i<arrayAux.length; i++){
      let objPersona = {
        tipoUsuario: arrayAux[i].tipoUsuario,
        flagEstaHabilitado:arrayAux[i].estaHabilitado,
        nombre:arrayAux[i].nombre + " "+arrayAux[i].apellido,
        email:arrayAux[i].email,
        fotos:arrayAux[i].fotos,
        flagTieneHistoriaClinica: false
      };

      let tipoUsuario = objPersona.tipoUsuario;
      if(tipoUsuario == 'paciente'){
        let historiaClinica = this.encontrarHistoriaPorMailPaciente(objPersona.email);
        if(historiaClinica){
          objPersona.flagTieneHistoriaClinica = true;
        }
      }
  
      arrayNuevo.push(objPersona);
     
    }
    arrayNuevo.sort((a, b) => {
      if (a.tipoUsuario === 'paciente' && b.tipoUsuario !== 'paciente') {
          return -1; // 'paciente' antes de cualquier otro tipo
      }
      if (a.tipoUsuario === 'especialista' && b.tipoUsuario === 'admin') {
          return -1; // 'especialista' antes de 'admin'
      }
      if (a.tipoUsuario === 'admin' && b.tipoUsuario !== 'admin') {
          return 1; // 'admin' después de cualquier otro tipo
      }
      return 0; // No cambian de posición
  });

    this.arrayPersonasRegistradas = arrayNuevo;
  }

  async actualizarHabilitacion(email:string, nuevoEstado : string){

    this.notificaciones.mostrarSpinner();

    setTimeout(async()=>{
      await this.firebase.actualizarHabilitacionEspecialista(email, nuevoEstado);
      this.notificaciones.ocultarSpinner();
    },2000);
  }

  descargarTodosLosDatosDeLosUsuarios(){
    //acá descarga todo y lo pone en el excel
    alert("funciona el botón");
  }

  descargarTurnosUsuario(item:any){
    //busca todos los turnos del paciente y los descarga en el excel
    if(item.tipoUsuario == 'paciente'){
      alert("es paciente");
    }
  }


}
