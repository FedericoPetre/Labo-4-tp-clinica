import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { Persona } from 'src/app/clases/persona';

@Component({
  selector: 'app-alta-admin',
  templateUrl: './alta-admin.component.html',
  styleUrls: ['./alta-admin.component.css']
})
export class AltaAdminComponent {

  fotoAdmin : any[] = [];
  public form : FormGroup;
  imagenPerfil : any = "../../../assets/img/silueta.png";

  public get Nombre(){
    return this.form.get('nombre')?.value;
  }

  public get Apellido(){
    return this.form.get('apellido')?.value;
  }

  public get Edad(){
    return this.form.get('edad')?.value;
  }

  public get Dni(){
    return this.form.get('dni')?.value;
  }

  public get Email(){
    return this.form.get('email')?.value;
  }

  public get Clave(){
    return this.form.get('clave')?.value;
  }


  constructor(private firebase : FirebaseService, private formBuilder : FormBuilder){
    this.form = formBuilder.group({
      nombre:['',[Validators.required]],
      apellido:['',[Validators.required]],
      edad:['',[Validators.min(0), Validators.required]],
      dni:['',[Validators.min(0), Validators.required]],
      email:['',[Validators.required]],
      clave:['',[Validators.required]],
      foto:['',[Validators.required]]
    });
  }


  async registrarAdmin(){
    const admin = new Persona(this.Nombre, this.Apellido, this.Edad, this.Dni, this.Email, this.Clave);
    console.log(JSON.stringify(admin));
    await this.firebase.registrarAdmin(admin, this.fotoAdmin);
    this.limpiarTodo();
  }

  actualizarfotoAdmin(event : any){
    let fotos : FileList = event.target.files;
    this.fotoAdmin = [];

    let reader : FileReader = new FileReader();
    reader.readAsDataURL(fotos[0]);
    reader.onloadend = () => {
      this.fotoAdmin.push(reader.result);
      this.imagenPerfil = this.fotoAdmin[0];
    }


    console.log(this.fotoAdmin);    
  }

  limpiarTodo(){
    this.form.setValue({
      nombre:'',
      apellido:'',
      edad:'',
      dni:'',
      email:'',
      clave:'',
      foto:''
    });
    this.imagenPerfil = "../../../assets/img/silueta.png";
  }
}
