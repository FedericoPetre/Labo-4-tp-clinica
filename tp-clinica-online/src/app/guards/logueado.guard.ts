import { CanActivateFn, Router } from '@angular/router';
import {inject} from '@angular/core';
import { FirebaseService } from '../servicios/firebase.service';

export const logueadoGuard: CanActivateFn = (route, state) => {
  let flagEstaLogueado : boolean = inject(FirebaseService).flagLogueado;

  if(flagEstaLogueado){
    return true;
  }else{
    inject(Router).navigate(['bienvenida']);
    return false;
  }
};
