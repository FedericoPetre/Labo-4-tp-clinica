import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BienvenidaComponent } from './componentes/bienvenida/bienvenida.component';
import { LoginComponent } from './componentes/login/login.component';
import { ComponenteHabilitacionesComponent } from './componentes/componente-habilitaciones/componente-habilitaciones.component';
import { MiPerfilComponent } from './componentes/mi-perfil/mi-perfil.component';
import { SolicitarTurnoComponent } from './componentes/solicitar-turno/solicitar-turno.component';
import { FiltroUnicoComponent } from './componentes/filtro-unico/filtro-unico.component';
import { MisTurnosComponent } from './componentes/mis-turnos/mis-turnos.component';
import { CaptchaComponent } from './componentes/captcha/captcha.component';
import { QuienSoyComponent } from './componentes/quien-soy/quien-soy.component';

const routes: Routes = [
  {path:'', redirectTo:'bienvenida', pathMatch:'full'},
  {path:'bienvenida',title:'Ingreso Clínica Online', component:BienvenidaComponent},
  { path: 'registro', loadChildren: () => import('./modulos/registro/registro.module').then(m => m.RegistroModule) },
  {path:'login',component:LoginComponent, title:'Ingresar - Clínica'},
  {path:'seccion-usuarios',component:ComponenteHabilitacionesComponent, title:'Sección Usuarios - Clínica Online'},
  {path:'mi-perfil',component:MiPerfilComponent, title:'Mi perfil - Clínica Online'},
  { path: 'turnos', loadChildren: () => import('./modulos/turnos-module/turnos-module.module').then(m => m.TurnosModuleModule) },
  {path:'quien-soy', component:QuienSoyComponent, title:'Creador de la web - Clínica Online'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
