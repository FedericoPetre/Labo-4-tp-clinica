import { Injectable } from '@angular/core';
import { Paciente } from '../clases/paciente';
import { Especialista } from '../clases/especialista';
import { Persona } from '../clases/persona';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Storage, ref, uploadBytes } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { NotificacionService } from './notificacion.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  storageRef = firebase.app().storage().ref();
  flagLogueado : boolean = false;
  email : string = "";
  nombreUsuario : string = "";
  public tipoUsuario : string = "";

  constructor(private auth : AngularFireAuth, private store : AngularFirestore, private storage : Storage, private notificacion : NotificacionService, private router : Router) {}

  async ingresar(email : string, clave : string){
    this.email = email;
    await this.auth.signInWithEmailAndPassword(email, clave).then((respuesta)=>{
      const flagEmailEstaVerificado = respuesta.user?.emailVerified;
      if(flagEmailEstaVerificado){
        this.flagLogueado = true;
        this.notificacion.mostrarExito("Ingreso exitoso", "Bienvenido "+email);
        setTimeout(()=>{

        },1000);
        this.router.navigateByUrl('bienvenida');
      }else{
        this.notificacion.mostrarError("Error","El mail "+email+" no se encuentra verificado!");
      }
    }).catch((error:any)=>{
      this.notificacion.mostrarError("Error","El usuario no es válido");
    })
  }

  salir(){
    this.flagLogueado = false;
    this.auth.signOut().then(()=>{
      this.notificacion.mostrarInfo("Cerrar Sesión","Has cerrado tu sesión");
    }).catch(error=>{
      this.notificacion.mostrarError("Error","Error al cerrar sesión");
    });
    this.router.navigateByUrl('login');
  }

  async registrarPaciente(paciente:Paciente,  imagenes : any[]){
    this.auth.createUserWithEmailAndPassword(paciente.email, paciente.clave).then(async (respuesta)=>{
      let urlImagenes : any[] = [];

      await this.subirImagen("Pacientes/"+paciente.email+"/"+0, imagenes[0]).then((url)=>{
        urlImagenes.push(url);
      });

      await this.subirImagen("Pacientes/"+paciente.email+"/"+1, imagenes[1]).then((url)=>{
        urlImagenes.push(url);
      });

      const usuarioPaciente = respuesta.user;
      const uId = usuarioPaciente?.uid;

      usuarioPaciente?.sendEmailVerification();
      const documento = this.store.doc("Pacientes/"+uId);
      documento.set({
        nombre:paciente.nombre,
        apellido:paciente.apellido,
        edad:paciente.edad,
        dni:paciente.dni,
        obraSocial:paciente.obraSocial,
        imagenes:urlImagenes,
      });

      const documentoUserPaciente = this.store.doc("Usuarios/"+uId);
      documentoUserPaciente.set({
        nombre:paciente.nombre,
        email:paciente.email,
        tipoUsuario:'paciente',
        estaHabilitado:'si',
        fotos:urlImagenes
      });

      this.notificacion.mostrarExito("Registro exitoso","El paciente ha sido registrado en el sistema");
    
    }).catch((error:any)=>{
      this.notificacion.mostrarError("Error de registro",error);
    });
  }

  async registrarAdmin(admin : Persona, imagenes : any[]){
    this.auth.createUserWithEmailAndPassword(admin.email, admin.clave).then(async (respuesta)=>{
      let urlImagenes : any[]=[];

      await this.subirImagen("Admins/"+admin.email+"/"+0, imagenes[0]).then((url)=>{
        urlImagenes.push(url);
      });

      const usuarioAdmin = respuesta.user;
      const uId1 = usuarioAdmin?.uid;

      usuarioAdmin?.sendEmailVerification();
      const documento1 = this.store.doc("Admins/"+uId1);
      documento1.set({
        nombre:admin.nombre,
        apellido:admin.apellido,
        edad:admin.edad,
        dni:admin.dni,
        imagen:urlImagenes,
      });

      const documentoUserAdmin = this.store.doc("Usuarios/"+uId1);
      documentoUserAdmin.set({
        nombre:admin.nombre,
        email:admin.email,
        tipoUsuario:'admin',
        estaHabilitado:'si',
        fotos:urlImagenes
      });

      this.notificacion.mostrarExito("Registro exitoso","El Admin ha sido registrado en el sistema");
    
    }).catch((error:any)=>{
      this.notificacion.mostrarError("Registro fallido",error);
    });
  }

  async registrarEspecialista(especialista : Especialista,  imagenes : any[]){
    this.auth.createUserWithEmailAndPassword(especialista.email, especialista.clave).then(async (respuesta)=>{
      let urlImagenes : any[]=[];

      await this.subirImagen("Especialistas/"+especialista.email+"/"+0, imagenes[0]).then((url)=>{
        urlImagenes.push(url);
      });

      const usuarioEspecialista = respuesta.user;
      const uId1 = usuarioEspecialista?.uid;

      usuarioEspecialista?.sendEmailVerification();
      const documento1 = this.store.doc("Especialistas/"+uId1);
      documento1.set({
        nombre:especialista.nombre,
        apellido:especialista.apellido,
        edad:especialista.edad,
        dni:especialista.dni,
        especialidad:especialista.especialidad,
        imagen:urlImagenes,
      });

      const documentoUserEspecialista = this.store.doc("Usuarios/"+uId1);
      documentoUserEspecialista.set({
        nombre:especialista.nombre,
        email:especialista.email,
        tipoUsuario:'especialista',
        estaHabilitado:'no',
        fotos:urlImagenes
      });

      this.notificacion.mostrarExito("Registro exitoso","El especialista ha sido registrado en el sistema");
    
    }).catch((error:any)=>{
      this.notificacion.mostrarError("Registro fallido",error);
    });
  }

  async subirImagen(nombreImagen: string, imagenBase64 : any){
    try{
        let respuesta = await this.storageRef.child(nombreImagen).putString(imagenBase64,'data_url');
        //console.log("Entró acá al subir imagen BIEN");
        return await respuesta.ref.getDownloadURL();
    }catch(error:any){
       console.log(error);
   // console.log("Entró acá al subir imagen ERROR"+error);
      return null;
    }
  }

  traerEspecialistasRegistrados(){
    const especialistas = this.store.collection('Especialistas');
    return especialistas.valueChanges();
  }

  traerPacientesRegistrados(){
    const pacientes = this.store.collection('Pacientes');
    return pacientes.valueChanges();
  }

  traerAdminsRegistrados(){
    const admins = this.store.collection('Admins');
    return admins.valueChanges();
  }

   retornarUsuarioRegistrados(){
    const usuario = this.store.collection('Usuarios');

    return usuario.valueChanges();
  }

  async actualizarHabilitacionEspecialista(email: string, nuevoEstado: string): Promise<void> {
    const especialistasCollection = this.store.collection("Usuarios", ref =>
      ref.where("email", "==", email)
    );

    try {
      const especialistas = await especialistasCollection.get().toPromise();

      especialistas?.forEach(especialista => {
        const id = especialista.id;
        const data: any = especialista.data();
        // Actualiza el campo estadoHabilitado del documento encontrado
        return this.store.collection("Usuarios").doc(id).update({
          estaHabilitado: nuevoEstado
        }).then(() => {
          let mensaje: string = "Has ";
          let habilitado: string = "";

          switch (nuevoEstado) {
            case "si":
              habilitado = "habilitado ";
              break;
            case "no":
              habilitado = "deshabilitado ";
              break;
          }
          mensaje = mensaje + habilitado + "a " + email;
          this.notificacion.mostrarExito("Éxito al cambiar la habilitación", mensaje);
        }).catch(error => {
          this.notificacion.mostrarError("Error al cambiar la habilitación", error);
        });
      });
    } catch (error:any) {
      this.notificacion.mostrarError("Error al obtener datos del especialista", error);
    }
  }
}
