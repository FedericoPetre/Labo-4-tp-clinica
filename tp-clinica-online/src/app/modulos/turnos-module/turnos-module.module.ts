import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TurnosModuleRoutingModule } from './turnos-module-routing.module';
import { TurnosModuleComponent } from './turnos-module.component';


@NgModule({
  declarations: [
    TurnosModuleComponent
  ],
  imports: [
    CommonModule,
    TurnosModuleRoutingModule
  ]
})
export class TurnosModuleModule { }
