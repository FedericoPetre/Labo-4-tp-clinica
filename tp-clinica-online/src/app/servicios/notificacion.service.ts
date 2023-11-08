import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  constructor(private toast : ToastrService) { }

  mostrarExito(titulo:string, mensajeExito:string){
    this.toast.success(mensajeExito, titulo);
  }

  mostrarError(titulo:string, mensajeError:string){
    this.toast.error(mensajeError, titulo);
  }

  mostrarInfo(titulo:string, mensajeInfo:string){
    this.toast.info(mensajeInfo, titulo);
  }
}
