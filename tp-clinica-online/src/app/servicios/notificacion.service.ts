import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class NotificacionService {
  constructor(private toast: ToastrService, private spinner : NgxSpinnerService) {}

  async mostrarExito(titulo: string, mensajeExito: string) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000, // Duración en milisegundos
        timerProgressBar: true, // Muestra una barra de progreso
        icon: 'success', // Puedes cambiarlo a 'info', 'warning', 'error', etc.
        title: mensajeExito,
        customClass: {
          container: 'sweetalert-toast-container',
          popup: 'sweetalert-toast-popup',
          title: 'sweetalert-toast-title',
        },
      });
    }

 async mostrarError(titulo: string, mensajeError: string) {
  Swal.fire({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000, // Duración en milisegundos
    timerProgressBar: true, // Muestra una barra de progreso
    icon: 'error', // Puedes cambiarlo a 'info', 'warning', 'error', etc.
    title: mensajeError,
    customClass: {
      container: 'sweetalert-toast-container',
      popup: 'sweetalert-toast-popup',
      title: 'sweetalert-toast-title',
    },
  });
  }

  async mostrarInfo(titulo: string, mensajeInfo: string) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000, // Duración en milisegundos
      timerProgressBar: true, // Muestra una barra de progreso
      icon: 'info', // Puedes cambiarlo a 'info', 'warning', 'error', etc.
      title: mensajeInfo,
      customClass: {
        container: 'sweetalert-toast-container',
        popup: 'sweetalert-toast-popup',
        title: 'sweetalert-toast-title',
      },
    });
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


  

  async mostrarHistoriaClinica(historiaClinica:any): Promise<string | null> {
    let detalleStr = "";
    for (const key in historiaClinica.detalle) {
      if (historiaClinica.detalle.hasOwnProperty(key)) {
        detalleStr = detalleStr + `${key}:${historiaClinica.detalle[key]}, `;
      }
    }

    let mensaje : string = `<p>Altura: ${historiaClinica.altura}</p><br><p>Peso: ${historiaClinica.peso}</p><br><p>Presion: ${historiaClinica.presion}</p><br><p>Temperatura: ${historiaClinica.temperatura}</p><br><p>Detalles: ${detalleStr}</p>`;

    const resultado = await Swal.fire({
      title: "Historia Clínica del paciente "+historiaClinica.paciente,
      html: `${mensaje}`,
      icon: 'info',
      confirmButtonText: 'Aceptar',
    });

    if (resultado.isConfirmed) {
      // Retorna el texto ingresado si el usuario hace clic en "Aceptar"
      let mensajeRetorno = mensaje.replace("<p>","");
      while(mensajeRetorno.includes("<p>")){
        mensajeRetorno = mensajeRetorno.replace("<p>","");
      }

      while(mensajeRetorno.includes("<br>")){
        mensajeRetorno = mensajeRetorno.replace("<br>","");
      }

      while(mensajeRetorno.includes("</p>")){
        mensajeRetorno = mensajeRetorno.replace("</p>",",");
      }

      return mensajeRetorno;
    } else {
      // Retorna null si el usuario hace clic en "Cancelar"
      return null;
    }
  }

  

  async mostrarFormularioHistoriaClinica(paciente: string): Promise<{ altura: number, peso: number, temperatura: number, presion: number, detalles: any } | null> {
    const { value: formValues,  dismiss: dismissReason } = await Swal.fire({
      title: `Nueva Historia Clínica de ${paciente}`,
      html:
      '<label for="clave">Altura</label>' +
      '<input type="number" id="altura" class="swal2-input" placeholder="Altura (cm)" min="0"><br>' +
      '<label for="peso">Peso</label>' +
      '<input type="number" id="peso" class="swal2-input" placeholder="Peso (kg)" min="0"><br>' +
      '<label for="temperatura">Temperatura</label>' +
      '<input type="number" id="temperatura" class="swal2-input" placeholder="Temperatura (°C)" min="0"><br>' +
      '<label for="presion">Presión</label>' +
      '<input type="number" id="presion" class="swal2-input" placeholder="Presión (mmHg)" min="0"><br>' +
      '<div id="detalles-container"></div>' +
      '<button id="agregar-detalle" class="swal2-confirm swal2-styled" type="button" style="display: none">Agregar Detalle</button>',
    showCancelButton: true,
    cancelButtonText: 'Cancelar', // Añade esta línea para personalizar el estilo del botón de cancelar
    confirmButtonText: 'Enviar',
      preConfirm: () => {
        const alturaInput = document.getElementById('altura') as HTMLInputElement;
        const pesoInput = document.getElementById('peso') as HTMLInputElement;
        const temperaturaInput = document.getElementById('temperatura') as HTMLInputElement;
        const presionInput = document.getElementById('presion') as HTMLInputElement;
  
        // Obtener valores ingresados
        const altura = parseInt(alturaInput.value);
        const peso = parseInt(pesoInput.value);
        const temperatura = parseInt(temperaturaInput.value);
        const presion = parseInt(presionInput.value);
        const detallesContainer = document.getElementById('detalles-container');
        const detallesInputs = detallesContainer?.getElementsByClassName('detalle-input') as HTMLCollectionOf<HTMLInputElement>;
        const claveInputs = detallesContainer?.getElementsByClassName('clave-input') as HTMLCollectionOf<HTMLInputElement>;
  
        let detalles: any = {};
  
        for (let i = 0; i < detallesInputs.length; i++) {
          const unaClave = claveInputs[i].value.trim();
          const valor = detallesInputs[i].value.trim();
  
          if (unaClave && valor) {
            detalles = { ...detalles, [unaClave]: valor };
          }
        }
  
        return { altura, peso, temperatura, presion, detalles };
      },
      didOpen: () => {
        const agregarDetalleButton = document.getElementById('agregar-detalle');
        const detallesContainer = document.getElementById('detalles-container');
  
        agregarDetalleButton!.style.display = 'block';
  
        let detalleCount = 0;
  
        agregarDetalleButton!.addEventListener('click', () => {
          if (detalleCount < 3) {
            const claveInput = document.createElement('input');
            claveInput.classList.add('swal2-input');
            claveInput.classList.add('clave-input');
            claveInput.setAttribute('placeholder', 'Clave ' + (detalleCount + 1));
            detallesContainer!.appendChild(claveInput);
  
            const detalleInput = document.createElement('input');
            detalleInput.classList.add('swal2-input');
            detalleInput.classList.add('detalle-input');
            detalleInput.setAttribute('placeholder', 'Valor ' + (detalleCount + 1));
            detallesContainer!.appendChild(detalleInput);
  
            detalleCount++;
          }
  
          if (detalleCount === 3) {
            agregarDetalleButton!.style.display = 'none';
          }
        });
  
        const alturaInput = document.getElementById('altura') as HTMLInputElement;
        const pesoInput = document.getElementById('peso') as HTMLInputElement;
        const temperaturaInput = document.getElementById('temperatura') as HTMLInputElement;
        const presionInput = document.getElementById('presion') as HTMLInputElement;
        const confirmButton = Swal.getConfirmButton();
        confirmButton!.disabled = true;
  
        function validateInputs() {
          if (alturaInput.value && pesoInput.value && temperaturaInput.value && presionInput.value) {
            confirmButton!.disabled = false;
          } else {
            confirmButton!.disabled = true;
          }
        }
  
        alturaInput.addEventListener('input', validateInputs);
        pesoInput.addEventListener('input', validateInputs);
        temperaturaInput.addEventListener('input', validateInputs);
        presionInput.addEventListener('input', validateInputs);
  
        validateInputs();
      },
      willClose: () => {
        const detallesContainer = document.getElementById('detalles-container');
        detallesContainer!.innerHTML = '';
      },
      focusConfirm: false,
      allowOutsideClick: false,
      allowEnterKey: false,
      inputValidator: () => {
        const alturaInput = document.getElementById('altura') as HTMLInputElement;
        const pesoInput = document.getElementById('peso') as HTMLInputElement;
        const temperaturaInput = document.getElementById('temperatura') as HTMLInputElement;
        const presionInput = document.getElementById('presion') as HTMLInputElement;
  
        if (!alturaInput.value || !pesoInput.value || !temperaturaInput.value || !presionInput.value) {
          return 'Por favor, complete todos los campos obligatorios.';
        }
        return null;
      },
    });
  
    if (dismissReason === Swal.DismissReason.cancel) {
      // Si el motivo de cierre es cancelar, retorna null o realiza alguna acción deseada.
      return null;
    }
  
    if (formValues && formValues.altura && formValues.peso && formValues.temperatura && formValues.presion) {
      return formValues as { altura: number, peso: number, temperatura: number, presion: number, detalles: any };
    } else {
      return null;
    }
  }

  mostrarSpinner(){
    this.spinner.show();
  }

  ocultarSpinner(){
    this.spinner.hide();
  }
  
}
