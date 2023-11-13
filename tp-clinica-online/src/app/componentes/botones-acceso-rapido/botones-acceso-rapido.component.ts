import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-botones-acceso-rapido',
  templateUrl: './botones-acceso-rapido.component.html',
  styleUrls: ['./botones-acceso-rapido.component.css']
})
export class BotonesAccesoRapidoComponent {

  @Input() usuario: any;
  @Output() clickEvent: EventEmitter<any> = new EventEmitter<any>();

  handleClick() {
    this.clickEvent.emit(this.usuario);
  }

}
