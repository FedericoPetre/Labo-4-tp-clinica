import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-carta-mi-perfil',
  templateUrl: './carta-mi-perfil.component.html',
  styleUrls: ['./carta-mi-perfil.component.css']
})
export class CartaMiPerfilComponent {
  @Input() nombre: string = '';
  @Input() apellido: string = '';
  @Input() email: string = '';
  @Input() edad: string = '';
  @Input() dni: string = '';
  @Input() imagenes: any[] = [];
  @Input() obraSocial = "";
  @Input() historiaClinica : any;
}
