import { Directive, ElementRef, Renderer2, OnInit } from '@angular/core';

@Directive({
  selector: '[appCambiarColorSegunHoraDelDia]'
})
export class CambiarColorSegunHoraDelDiaDirective {

  constructor(private elemento: ElementRef, private render: Renderer2) {}

  ngOnInit() {
    this.actualizarColorFondo();
  }

  private actualizarColorFondo() {
    const horaActual = new Date().getHours();

    if (horaActual >= 7 && horaActual < 20) {
      this.render.setStyle(this.elemento.nativeElement, 'background-color', 'darkblue');
    } else {
      this.render.setStyle(this.elemento.nativeElement, 'background-color', '#272727');
    }
  }
}
