import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class NotificacionService {
  constructor(private toast: ToastrService) {}

  mostrarExito(titulo: string, mensajeExito: string) {
    this.toast.success(mensajeExito, titulo);
  }

  mostrarError(titulo: string, mensajeError: string) {
    this.toast.error(mensajeError, titulo);
  }

  mostrarInfo(titulo: string, mensajeInfo: string) {
    this.toast.info(mensajeInfo, titulo);
  }

  mostrarConfirmacion(titulo: string, mensaje: string): Promise<any> {
    return Swal.fire({
      title: titulo,
      text: mensaje,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    });
  }

  mostrarMensajeSwal(titulo: string, mensaje: string): Promise<any> {
    return Swal.fire({
      title: titulo,
      text: mensaje,
    });
  }

  async mostrarConfirmacionConTexto(titulo: string, mensaje: string): Promise<string | null> {
    const resultado = await Swal.fire({
      title: titulo,
      html: `<p>${mensaje}</p>`,
      icon: 'question',
      input: 'text',
      inputPlaceholder: 'Ingrese su comentario aquí',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    });

    if (resultado.isConfirmed) {
      // Retorna el texto ingresado si el usuario hace clic en "Aceptar"
      return resultado.value;
    } else {
      // Retorna null si el usuario hace clic en "Cancelar"
      return null;
    }
  }

}
