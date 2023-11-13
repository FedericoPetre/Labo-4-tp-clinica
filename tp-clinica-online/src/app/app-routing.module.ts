import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BienvenidaComponent } from './componentes/bienvenida/bienvenida.component';
import { LoginComponent } from './componentes/login/login.component';
import { ComponenteHabilitacionesComponent } from './componentes/componente-habilitaciones/componente-habilitaciones.component';
import { MiPerfilComponent } from './componentes/mi-perfil/mi-perfil.component';
import { MisHorariosComponent } from './componentes/mis-horarios/mis-horarios.component';

const routes: Routes = [
  {path:'', redirectTo:'bienvenida', pathMatch:'full'},
  {path:'bienvenida',title:'Ingreso Clínica Online', component:BienvenidaComponent},
  { path: 'registro', loadChildren: () => import('./modulos/registro/registro.module').then(m => m.RegistroModule) },
  {path:'login',component:LoginComponent, title:'Ingresar - Clínica'},
  {path:'seccion-usuarios',component:ComponenteHabilitacionesComponent, title:'Sección Usuarios - Clínica Online'},
  { path: 'turnos', loadChildren: () => import('./modulos/turnos/turnos.module').then(m => m.TurnosModule) },
  {path:'mi-perfil',component:MiPerfilComponent, title:'Mi perfil - Clínica Online'},
  {path:'mis-horarios',component:MisHorariosComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }