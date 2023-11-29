import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PeticionHTTPService {

  constructor(private xhttp : HttpClient) { }

  async traerInformacionGithub(){
    try{
      const response : any = await fetch("https://api.github.com/users/federicopetre");
      const informacion = response.json();
      return informacion;

    }catch(error){
      console.log(error);
    }
  }
}
