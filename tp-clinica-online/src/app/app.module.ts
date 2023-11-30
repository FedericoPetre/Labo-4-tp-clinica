import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


/**TOAST */
import { ToastrModule } from 'ngx-toastr';
/** */

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { BienvenidaComponent } from './componentes/bienvenida/bienvenida.component';
import { AltaPacienteComponent } from './componentes/alta-paciente/alta-paciente.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AltaEspecialistaComponent } from './componentes/alta-especialista/alta-especialista.component';
import { NavbarComponent } from './componentes/navbar/navbar.component';
import { BotonesRegistroComponent } from './componentes/botones-registro/botones-registro.component';
import { LoginComponent } from './componentes/login/login.component';
// Importa BrowserAnimationsModule
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponenteHabilitacionesComponent } from './componentes/componente-habilitaciones/componente-habilitaciones.component';
import { AltaAdminComponent } from './componentes/alta-admin/alta-admin.component';
import { BotonesSeccionHabilitacionesComponent } from './componentes/botones-seccion-habilitaciones/botones-seccion-habilitaciones.component';
import { BotonesAccesoRapidoComponent } from './componentes/botones-acceso-rapido/botones-acceso-rapido.component';
import { MiPerfilComponent } from './componentes/mi-perfil/mi-perfil.component';
import { CartaMiPerfilComponent } from './componentes/carta-mi-perfil/carta-mi-perfil.component';
import { MisHorariosComponent } from './componentes/mis-horarios/mis-horarios.component';
import { SolicitarTurnoComponent } from './componentes/solicitar-turno/solicitar-turno.component';
import { MisTurnosComponent } from './componentes/mis-turnos/mis-turnos.component';
import { FiltroUnicoComponent } from './componentes/filtro-unico/filtro-unico.component';
import { TablaTurnosPacienteComponent } from './componentes/tabla-turnos-paciente/tabla-turnos-paciente.component';
import { TablaTurnosEspecialistaComponent } from './componentes/tabla-turnos-especialista/tabla-turnos-especialista.component';
import { TurnosAdminComponent } from './componentes/turnos-admin/turnos-admin.component';
import { CaptchaComponent } from './componentes/captcha/captcha.component';
import { QuienSoyComponent } from './componentes/quien-soy/quien-soy.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    AppComponent,
    BienvenidaComponent,
    AltaPacienteComponent,
    AltaEspecialistaComponent,
    NavbarComponent,
    BotonesRegistroComponent,
    LoginComponent,
    ComponenteHabilitacionesComponent,
    AltaAdminComponent,
    BotonesSeccionHabilitacionesComponent,
    BotonesAccesoRapidoComponent,
    MiPerfilComponent,
    CartaMiPerfilComponent,
    MisHorariosComponent,
    SolicitarTurnoComponent,
    MisTurnosComponent,
    FiltroUnicoComponent,
    TablaTurnosPacienteComponent,
    TablaTurnosEspecialistaComponent,
    TurnosAdminComponent,
    CaptchaComponent,
    QuienSoyComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(()=>getStorage()),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    HttpClientModule,
    NgxSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
