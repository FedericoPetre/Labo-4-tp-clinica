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
import { slideInAnimation } from './animaciones/animaciones';
import { SeccionPacientesComponent } from './componentes/seccion-pacientes/seccion-pacientes.component';
import { GraficosYEstadisticasComponent } from './componentes/graficos-yestadisticas/graficos-yestadisticas.component';
import { GraficoTortaComponent } from './componentes/grafico-torta/grafico-torta.component';
import { logueadoGuard } from './guards/logueado.guard';

const routes: Routes = [
  {path:'', redirectTo:'bienvenida', pathMatch:'full'},
  {path:'bienvenida',title:'Ingreso Clínica Online', component:BienvenidaComponent, data: { animation: 'bienvenida' }},
  { path: 'registro', loadChildren: () => import('./modulos/registro/registro.module').then(m => m.RegistroModule), data: { animation: 'registro' } },
  {path:'login',component:LoginComponent, title:'Ingresar - Clínica', data: { animation: 'login' }},
  {path:'seccion-usuarios',component:ComponenteHabilitacionesComponent, title:'Sección Usuarios - Clínica Online', canActivate:[logueadoGuard]},
  {path:'mi-perfil',component:MiPerfilComponent, title:'Mi perfil - Clínica Online', data: { animation: 'mi-perfil' }, canActivate:[logueadoGuard]},
  { path: 'turnos', loadChildren: () => import('./modulos/turnos-module/turnos-module.module').then(m => m.TurnosModuleModule), data: { animation: 'turnos' }, canActivate:[logueadoGuard]},
  {path:'quien-soy', component:QuienSoyComponent, title:'Creador de la web - Clínica Online', data: { animation: 'quien-soy' }},
  {path:'pacientes',component:SeccionPacientesComponent, title:'Sección Pacientes - Clínica Online' , canActivate:[logueadoGuard]},
  {path:'graficos-y-estadisticas',component:GraficosYEstadisticasComponent, title:'Gráficos y estadísticas - Clínica Online' , canActivate:[logueadoGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
