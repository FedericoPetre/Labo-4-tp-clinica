import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TurnosModuleComponent } from './turnos-module.component';
import { SolicitarTurnoComponent } from 'src/app/componentes/solicitar-turno/solicitar-turno.component';
import { MisTurnosComponent } from 'src/app/componentes/mis-turnos/mis-turnos.component';

const routes: Routes = [{ path: '', component: TurnosModuleComponent },
{path:'solicitar-turno',component:SolicitarTurnoComponent, title:'Solicitar Turno - Clínica'},
{path:'mis-turnos',component:MisTurnosComponent, title:'Mis Turnos - Clínica'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TurnosModuleRoutingModule { }
