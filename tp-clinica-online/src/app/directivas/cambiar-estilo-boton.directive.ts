import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appCambiarEstiloBoton]'
})
export class CambiarEstiloBotonDirective {

  constructor(private elemento: ElementRef, private render: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.aplicarEfecto();
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.quitarEfecto();
  }

  private aplicarEfecto() {
    // Hacer el botón más grande y aplicar sombra
    this.render.setStyle(this.elemento.nativeElement, 'transform', 'scale(1.3)');
    this.render.setStyle(this.elemento.nativeElement, 'box-shadow', '0 0 20px rgba(255, 255, 255, 0.5)');
  }

  private quitarEfecto() {
    // Restaurar tamaño original y quitar sombra
    this.render.setStyle(this.elemento.nativeElement, 'transform', 'scale(1)');
    this.render.removeStyle(this.elemento.nativeElement, 'box-shadow');
  }

}
