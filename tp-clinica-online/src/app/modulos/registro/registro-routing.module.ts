import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroComponent } from './registro.component';
import { AltaPacienteComponent } from 'src/app/componentes/alta-paciente/alta-paciente.component';
import { AltaEspecialistaComponent } from 'src/app/componentes/alta-especialista/alta-especialista.component';
import { AltaAdminComponent } from 'src/app/componentes/alta-admin/alta-admin.component';

const routes: Routes = [{ path: '', component: RegistroComponent },
{path:'paciente',component:AltaPacienteComponent, title:'Registrar Paciente - Clínica'},
{path:'especialista',component:AltaEspecialistaComponent, title:'Registrar Especialista - Clínica'},
{path:'admin',component:AltaAdminComponent, title:'Registrar Administrador - Clínica'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistroRoutingModule { }
