import { Component, AfterViewInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  obser$ : any;
  email = "";
  arrayUsuarios : any;
  nombre : string = "";
  flagEstaLogueado : boolean = false;
  flagEsAdmin : boolean = false;

  ngOnInit(){
    this.obser$ = this.firebase.retornarUsuarioRegistrados().subscribe((datos)=>{
      this.cargarUsuariosAutorizados(datos);
      this.email = this.firebase.email;
      this.flagEstaLogueado = this.firebase.flagLogueado;
      this.firebase.nombreUsuario = this.determinarNombreDelAutorizado(this.email);
      this.nombre = this.firebase.nombreUsuario;
      if(this.firebase.tipoUsuario == "admin"){
        this.flagEsAdmin = true;
      }else{
        this.flagEsAdmin = false;
      }
    });
  }

  ngOnDestroy(){
    if(this.obser$){
      this.obser$.unsubscribe();
      this.flagEstaLogueado = false;
      this.flagEsAdmin = false;
      this.firebase.tipoUsuario = "";
    }
  }

  constructor(private firebase : FirebaseService){
  }

  cargarUsuariosAutorizados(arrayAux : any[]){
    let arrayNuevo : any[] = [];

    for(let i=0; i<arrayAux.length; i++){

    if(arrayAux[i].estaHabilitado == 'si'){
    
      let objPersona = {
        tipoUsuario: arrayAux[i].tipoUsuario,
        flagEstaHabilitado: 'si',
        nombre:arrayAux[i].nombre,
        email:arrayAux[i].email
      };
  
      arrayNuevo.push(objPersona);
    }
     
    }

    this.arrayUsuarios = arrayNuevo;
  }

  determinarNombreDelAutorizado(email:string){
    let nombreAutorizado : string = "";

    for(let i=0; i<this.arrayUsuarios.length; i++){
      if(this.arrayUsuarios[i].email == email){
        nombreAutorizado = this.arrayUsuarios[i].nombre;
        break;
      }
    }
    return nombreAutorizado;
  }


  async salir() {
    setTimeout(()=>{},1000);
    await this.firebase.salir();
    this.flagEstaLogueado = this.firebase.flagLogueado;
    this.flagEsAdmin = false;
    this.firebase.tipoUsuario = "";
  }

}
