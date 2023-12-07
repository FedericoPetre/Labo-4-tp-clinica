import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appEspacioInput]'
})
export class EspacioInputDirective {

  constructor(private element: ElementRef, private render: Renderer2) {}

  @HostListener('keydown.space', ['$event']) onKeyDown(event: KeyboardEvent) {
    event.preventDefault(); // Evitar que se añada un espacio en el campo
    this.cambiarColor();
  }

  private cambiarColor() {
    this.render.setStyle(this.element.nativeElement, 'color', 'white');
    this.render.setStyle(this.element.nativeElement, 'background', 'darkblue');
  }

}
