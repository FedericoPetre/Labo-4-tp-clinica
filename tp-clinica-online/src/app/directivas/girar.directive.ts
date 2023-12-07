import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appGirar]'
})
export class GirarDirective {

  grados = 0;

  constructor(private element: ElementRef, private render: Renderer2) {}

  @HostListener('click') onClick() {
    this.girarComponente();
  }

  private girarComponente() {
    let suma = 360 + this.grados;
    let rotate = "rotate("+suma+"deg)";
    this.render.setStyle(this.element.nativeElement, 'transform', rotate);
    // Puedes ajustar la duración de la animación y otros estilos según tus preferencias
    this.render.setStyle(this.element.nativeElement, 'transition', 'transform 1s ease-in-out');
    this.grados = this.grados + 360;
  }
}