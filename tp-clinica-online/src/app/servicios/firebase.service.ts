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
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  storageRef = firebase.app().storage().ref();
  flagLogueado : boolean = false;
  email : string = "";
  nombreUsuario : string = "";
  public tipoUsuario : string = "";
  flagEsAdmin : boolean = false;

  public objUsuarioLogueado : any;


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

  salir(salir:boolean){
    if(salir){
      this.flagLogueado=false;
      this.flagEsAdmin = false;
      this.auth.signOut().then(()=>{
        this.notificacion.mostrarInfo("Cerrar Sesión","Has cerrado tu sesión");
      }).catch(error=>{
        this.notificacion.mostrarError("Error","Error al cerrar sesión");
      });
      this.router.navigateByUrl('login');
    }
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
        email:paciente.email
      });

      const documentoUserPaciente = this.store.doc("Usuarios/"+uId);
      documentoUserPaciente.set({
        nombre:paciente.nombre,
        apellido:paciente.apellido,
        email:paciente.email,
        tipoUsuario:'paciente',
        estaHabilitado:'si',
        fotos:urlImagenes
      });

      this.notificacion.mostrarExito("Registro exitoso","El paciente ha sido registrado en el sistema");
      this.salir(false);
    
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
        email:admin.email
      });

      const documentoUserAdmin = this.store.doc("Usuarios/"+uId1);
      documentoUserAdmin.set({
        nombre:admin.nombre,
        apellido:admin.apellido,
        email:admin.email,
        tipoUsuario:'admin',
        estaHabilitado:'si',
        fotos:urlImagenes
      });

      this.notificacion.mostrarExito("Registro exitoso","El Admin ha sido registrado en el sistema");
      this.salir(false);
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
        email:especialista.email,
        edad:especialista.edad,
        dni:especialista.dni,
        especialidad:especialista.especialidad,
        imagen:urlImagenes,
      });

      const documentoUserEspecialista = this.store.doc("Usuarios/"+uId1);
      documentoUserEspecialista.set({
        nombre:especialista.nombre,
        apellido:especialista.apellido,
        email:especialista.email,
        tipoUsuario:'especialista',
        estaHabilitado:'no',
        fotos:urlImagenes
      });

      this.notificacion.mostrarExito("Registro exitoso","El especialista ha sido registrado en el sistema");
      this.salir(false);
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

  traerEspecialistaPorEmail(email: string): Observable<any> {
    return this.store.collection('Especialistas', ref => ref.where('email', '==', email)).valueChanges();
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

  guardarTodosLosTurnos(turnos : any[]){
    turnos.forEach((turnoItem : any)=>{
      const uId = this.store.createId();
      const documentoTurno = this.store.doc("Turnos/"+uId);
      documentoTurno.set({
        especialista:turnoItem.especialista,
        especialidad:turnoItem.especialidad,
        estaDisponible:turnoItem.estaDisponible,
        estadoTurno:turnoItem.estadoTurno,
        fecha:turnoItem.fecha,
        paciente:''
      });
    })
    this.notificacion.mostrarExito("Turnos","Horarios guardados exitosamente");
  }

  guardarTurnoParaElPaciente(nombreYApellidoPaciente: string, mailPaciente: string, nombreYApellidoEspecialista: string, especialidad: string, diaTurno : string){
    const uId = this.store.createId();
    const documentoTurno = this.store.doc("Turnos/"+uId);
    documentoTurno.set({
      paciente:nombreYApellidoPaciente,
      mailPaciente:mailPaciente,
      nombreEspecialista:nombreYApellidoEspecialista,
      especialidad:especialidad, 
      diaTurno:diaTurno,
      estadoTurno:'pendiente',
      fueRealizado:'false',
      comentarioCancelacion:'',
      resenia:'',
      calificacionAtencion:'',
      historiaClinica:''
    });
   this.notificacion.mostrarExito("Turnos",`Has solicitado turno para ${nombreYApellidoPaciente} en ${especialidad} el día ${diaTurno}hs`);
  }

  traerTurnosOcupados(nombreEspecialista:string, especialidad:string){
    return this.store.collection("Turnos",ref=>ref.where("nombreEspecialista","==",nombreEspecialista).where("especialidad","==",especialidad)).valueChanges();
  }


traerHorariosEspecialista(especialista:string){
  return this.store.collection("HorariosEspecialistas", ref=> ref.where("especialista", "==", especialista)).valueChanges();
}

traerTodosLosHorariosEspecialistas(){
  return this.store.collection("HorariosEspecialistas").valueChanges();
}


  async guardarHorariosEspecialista(horarios: any[]) {
    try {
        // Iterar sobre cada horario
        for (const horario of horarios) {
            const uIdHorario = this.store.createId();
            const documentoHorario = this.store.doc("HorariosEspecialistas/" + uIdHorario);

            // Crear un objeto con los datos del horario
            await documentoHorario.set ({
                dias: horario.dias,
                duracionTurno: horario.duracionTurno,
                especialidad: horario.especialidad,
                especialista: horario.especialista
            });
        }

        this.notificacion.mostrarExito("Horarios", "Horarios guardados exitosamente");
    } catch (error) {
        console.error('Error al intentar guardar los horarios:', error);
        // Puedes manejar el error de una manera específica o lanzar una excepción.
    }
}


async modificarHorariosEspecialista(especialidad: string, especialista: string, nuevosDias: string[], nuevaDuracionTurno: number) {
  const snapshot = await this.store.collection("HorariosEspecialistas", ref=> ref.where("especialidad", "==", especialidad).where("especialista", "==", especialista).limit(1));
  
  return snapshot.get().toPromise()
  .then(async (querySnapshot: any) => {
    if (!querySnapshot.empty) {
      const docId = querySnapshot.docs[0].id;
     
      const docRef = this.store.collection("HorariosEspecialistas").doc(docId);

      // Modificar el documento con los nuevos datos
      await docRef.update({
          "dias": nuevosDias,
          "duracionTurno": nuevaDuracionTurno
          // Puedes agregar más campos que desees modificar
      });

      return "Se han modificado tus horarios exitosamente";

    } else {
            // Si no existen documentos, crear uno nuevo
            const uIdHorario = this.store.createId();
            const documentoHorario = this.store.doc("HorariosEspecialistas/" + uIdHorario);

            // Establecer los datos en el nuevo documento
            await documentoHorario.set({
              dias: nuevosDias,
              duracionTurno: nuevaDuracionTurno,
              especialidad: especialidad,
              especialista: especialista
            });

           return "Se han guardado tus horarios exitosamente";
    }
  })
  .catch((error) => {
    console.error('Error al modificar el documento:', error);
    return "Error al guardar tus nuevos horarios";
  });
}

traerTurnosDelPaciente(mailPaciente:string){
  return this.store.collection("Turnos",ref=>ref.where("mailPaciente","==",mailPaciente)).valueChanges();
}

traerTurnosDelEspecialista(nombreEspecialista:string){
  return this.store.collection("Turnos",ref=>ref.where("nombreEspecialista","==",nombreEspecialista)).valueChanges();
}

traerTodosLosTurnosRegistrados(){
  return this.store.collection("Turnos").valueChanges();
}

async cancelarTurnoPaciente(especialidad: string, especialista: string, paciente:string, comentarioCancelacion:string, diaTurno:string) {
  const snapshot = await this.store.collection("Turnos", ref=> ref.where("especialidad", "==", especialidad).where("nombreEspecialista", "==", especialista).where("paciente","==",paciente).where("diaTurno","==",diaTurno).limit(1));
  
  return snapshot.get().toPromise()
  .then(async (querySnapshot: any) => {
    if (!querySnapshot.empty) {
      const docId = querySnapshot.docs[0].id;
     
      const docRef = this.store.collection("Turnos").doc(docId);

      // Modificar el documento con los nuevos datos
      await docRef.update({
          "comentarioCancelacion": comentarioCancelacion,
          "estadoTurno": "cancelado"
          // Puedes agregar más campos que desees modificar
      });

      return "Se han cancelado el turno";

    } 
    return "No se ha encontrado ningún turno con esas características";
  })
  .catch((error) => {
    console.error('Error al modificar el documento:', error);
    return "Error al cancelar el turno";
  });
}

async rechazarTurnoPaciente(especialidad: string, especialista: string, paciente:string, comentarioCancelacion:string, diaTurno:string) {
  const snapshot = await this.store.collection("Turnos", ref=> ref.where("especialidad", "==", especialidad).where("nombreEspecialista", "==", especialista).where("paciente","==",paciente).where("diaTurno","==",diaTurno).limit(1));
  
  return snapshot.get().toPromise()
  .then(async (querySnapshot: any) => {
    if (!querySnapshot.empty) {
      const docId = querySnapshot.docs[0].id;
     
      const docRef = this.store.collection("Turnos").doc(docId);

      // Modificar el documento con los nuevos datos
      await docRef.update({
          "comentarioCancelacion": comentarioCancelacion,
          "estadoTurno": "rechazado"
          // Puedes agregar más campos que desees modificar
      });

      return "Se ha rechazado el turno";

    } 
    return "No se ha encontrado ningún turno con esas características";
  })
  .catch((error) => {
    console.error('Error al modificar el documento:', error);
    return "Error al rechazar el turno";
  });
}

async aceptarTurnoPaciente(especialidad: string, especialista: string, paciente:string, diaDelTurno: string) {
  const snapshot = await this.store.collection("Turnos", ref=> ref.where("especialidad", "==", especialidad).where("nombreEspecialista", "==", especialista).where("paciente","==",paciente).where("diaTurno","==",diaDelTurno).limit(1));
  
  return snapshot.get().toPromise()
  .then(async (querySnapshot: any) => {
    if (!querySnapshot.empty) {
      const docId = querySnapshot.docs[0].id;
     
      const docRef = this.store.collection("Turnos").doc(docId);

      // Modificar el documento con los nuevos datos
      await docRef.update({
          "estadoTurno": "aceptado"
          // Puedes agregar más campos que desees modificar
      });

      return "Se ha aceptado el turno";

    } 
    return "No se ha encontrado ningún turno con esas características";
  })
  .catch((error) => {
    console.error('Error al modificar el documento:', error);
    return "Error al aceptar el turno";
  });
}

async finalizarTurnoPaciente(especialidad: string, especialista: string, paciente:string, resenia : string, diaDelTurno : string) {
  const snapshot = await this.store.collection("Turnos", ref=> ref.where("especialidad", "==", especialidad).where("nombreEspecialista", "==", especialista).where("paciente","==",paciente).where("diaTurno","==",diaDelTurno).limit(1));
  
  return snapshot.get().toPromise()
  .then(async (querySnapshot: any) => {
    if (!querySnapshot.empty) {
      const docId = querySnapshot.docs[0].id;
     
      const docRef = this.store.collection("Turnos").doc(docId);

      // Modificar el documento con los nuevos datos
      await docRef.update({
          "estadoTurno": "finalizado",
          "fueRealizado":"true",
          "resenia":resenia,
      });

      return "Se ha finalizado el turno";

    } 
    return "No se ha encontrado ningún turno con esas características";
  })
  .catch((error) => {
    console.error('Error al modificar el documento:', error);
    return "Error al finalizar el turno";
  });
}

async guardarHistoriaClinica(paciente : string, historiaClinica : any){
  let fecha : Date = new Date();
  const uIdHistoriaClinica = this.store.createId();
  const docHistoria = this.store.doc("HistoriasClinicas/"+uIdHistoriaClinica);
  docHistoria.set({
    fecha:fecha,
    paciente:paciente,
    altura:historiaClinica.altura,
    peso:historiaClinica.peso,
    temperatura:historiaClinica.temperatura,
    presion:historiaClinica.presion,
    detalles:historiaClinica.detalles,
    mailPaciente:historiaClinica.mailPaciente
  });
}

async modificarHistoriaClinica(mailPaciente : string, historiaClinica : any){
  const collectionRef = this.store.collection('HistoriasClinicas');
  let fecha : Date = new Date();

  try {
    collectionRef.ref.where('mailPaciente', '==', mailPaciente).limit(1).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // Actualizar el token en cada documento
        collectionRef.doc(doc.id).update({
          fecha:fecha,
          altura:historiaClinica.altura,
          peso:historiaClinica.peso,
          temperatura:historiaClinica.temperatura,
          presion:historiaClinica.presion,
          detalles:historiaClinica.detalles,
        });
      });
    });
    
    console.log(`Documentos para el paciente ${mailPaciente} eliminados con éxito.`);
  } catch (error) {
    console.error('Error al eliminar documentos:', error);
    throw error;
  }
}

traerHistoriaClinicaPaciente(paciente:string){
  return this.store.collection("HistoriasClinicas",ref=>ref.where("paciente","==",paciente)).valueChanges();
}

traerTodasLasHistoriasClinicas(){
  return this.store.collection("HistoriasClinicas").valueChanges();
}

async agregarCalificacionServicio(especialidad: string, especialista: string, paciente:string, resenia : string, diaDelTurno : string) {
  const snapshot = await this.store.collection("Turnos", ref=> ref.where("especialidad", "==", especialidad).where("nombreEspecialista", "==", especialista).where("paciente","==",paciente).where("diaTurno","==",diaDelTurno).limit(1));
  
  return snapshot.get().toPromise()
  .then(async (querySnapshot: any) => {
    if (!querySnapshot.empty) {
      const docId = querySnapshot.docs[0].id;
     
      const docRef = this.store.collection("Turnos").doc(docId);

      // Modificar el documento con los nuevos datos
      await docRef.update({
          "calificacionAtencion":resenia
          // Puedes agregar más campos que desees modificar
      });

      return "Se ha calificado el turno";

    } 
    return "No se ha encontrado ningún turno con esas características";
  })
  .catch((error) => {
    console.error('Error al modificar el documento:', error);
    return "Error al calificar el turno";
  });
}

traerMisTurnosFinalizados(nombreEspecialista : string){
  return this.store.collection("Turnos",ref=>ref.where("nombreEspecialista","==",nombreEspecialista).where("estadoTurno","==","finalizado")).valueChanges();
}



}
