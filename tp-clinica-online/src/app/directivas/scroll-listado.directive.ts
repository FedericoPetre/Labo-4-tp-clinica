import { Directive, ElementRef, Renderer2, AfterViewInit } from '@angular/core';


@Directive({
  selector: '[appScrollListado]'
})
export class ScrollListadoDirective {

  constructor(private element: ElementRef, private render: Renderer2) {}

  ngAfterViewInit() {
    this.verificarOverflow();
  }

  private verificarOverflow() {
    const contenedor = this.element.nativeElement;

    if (contenedor.scrollHeight > contenedor.clientHeight) {
      this.render.setStyle(contenedor, 'overflow-y', 'scroll');
      this.render.setStyle(contenedor, 'scrollbar-color', 'blue transparent');
    }
  }

}
