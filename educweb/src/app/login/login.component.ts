import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthServiceService } from '../Services/auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppComponent } from '../app.component';
import { validateEventsArray } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

export class Upload{
  $key: string;
  file: File;
  name: string;
  url: string;
  progess: number;
  createdAt: Date = new Date();

  constructor(file:File){
    this.file = file;
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  hide = true;
  selected = 0;
  user;
  showNotAllowed = false;
  showCardUpload = false;
  userUrl = '';
  currentUpload;
  clearname = '';
  clearlastname = '';


  options = new FormGroup({
    namesControl: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$')
    ]),
    lastnamesControl: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$')
    ]),
    roleControl: new FormControl('', [
      Validators.required
    ]),
    emailControl: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    passwControl: new FormControl('', [
      Validators.required
    ]),
  })
 

  constructor(private authService: AuthServiceService, private snack: MatSnackBar, private AppComp: AppComponent, private dataRoute: ActivatedRoute, private route: Router, private storage: AngularFireStorage) { }

  ngOnInit(): void {
    this.options.get('roleControl').setValue('profesor');
    this.options.get('roleControl').updateValueAndValidity;
    this.selected = 1;
    let sub = this.dataRoute
    .queryParams
    .subscribe(params => {
      if(params.params == 'login'){
        this.selected = 1;
      }
      else
      {
        this.selected = 0;
      }
    });
  }

  createUser(){
    let names = this.options.get('namesControl').value;
    let lastnames = this.options.get('lastnamesControl').value;
    let mail = this.options.get('emailControl').value;
    let pass = this.options.get('passwControl').value;
    let roles = this.options.get('roleControl').value;

    let val1 = this.options.get('namesControl').value.match(/\d+/g);
    let val2 = this.options.get('lastnamesControl').value.match(/\d+/g);

    if(this.options.get('namesControl').value.replace(/\s/g, '').length == 0 || this.options.get('lastnamesControl').value.replace(/\s/g, '').length == 0)
    {
      this.snack.open('Por favor revisar los campos...', '', {duration: 2000})
      this.options.get('namesControl').value.trim();
      this.options.get('lastnamesControl').value.trim();
      this.options.get('namesControl').clearAsyncValidators;
      this.options.get('lastnamesControl').clearAsyncValidators;
      return
    }
    else
    {
      console.log(names.length,lastnames.length,roles, mail.length, pass.length);
      if(pass.length <= 5){this.snack.open('Por favor revisar los campos...', '', {duration: 2000})}
      else
      {
        if(names.length != 0 && lastnames.length != 0 && mail.length != 0 && pass.length != 0)
      {
        this.snack.open('Creando usuario ....', 'x', {duration: 2000});


        let sub = this.authService.createMailUser(mail, pass, names, lastnames, roles).then(result =>{
          console.log(result)
          this.options.get('namesControl').setValue('');
          this.options.get('lastnamesControl').setValue('');
          this.options.get('emailControl').setValue('');
          this.options.get('passwControl').setValue('');
          this.options.get('roleControl').setValue('');
          if(result== 'ok'){
            this.delay(100).then(any =>{
              this.snack.open('Usuario creado con éxito y en espera de aprobación.', 'x', {duration: 5000});
            })
            
          }
          
        })
      }
      }
      
      
    }
    
  }


  validarCamposn(campo){
    console.log(campo)
    let valor = campo.value;
    if(/\d/.test(valor)) {
      this.options.get('namesControl').setValue(valor.replace(/\d/g,' ').trim());
      
    } 

  }

  validarCamposa(campo){
    console.log(campo)
    let valor = campo.value;
    if(/\d/.test(valor)) {
      this.options.get('lastnamesControl').setValue(valor.replace(/\d/g,' ').trim());
    } 

  }

  changeSelection(selection){
    this.delay(60).then(any =>{
      if(this.options.get('roleControl').value == 'profesor')
      {
        this.showCardUpload= true;
      }
      else
      {
        this.showCardUpload= false;
      }
    })
  }

  loginUser(){
    let mail = this.options.get('emailControl').value;
    let pass = this.options.get('passwControl').value;

    this.authService.loginMailUser(mail, pass).then( (res) => {
      let subAuth = this.authService.isAuth().subscribe( user => {
        if(user){
          let subAuth2 = this.authService.getUserData(user.uid).subscribe(result =>{
            if(result.role == 'profesor')
            {
              if(!result.enabled)
              {                
                subAuth2.unsubscribe();
                this.route.navigateByUrl('carnet-upload');
              }
              else
              {
                this.user = result;
                this.snack.open('Bienvenido '+result.name, '', {duration: 3000});
                this.AppComp.isLogged = true;
                this.showNotAllowed = false;
                subAuth.unsubscribe();
                subAuth2.unsubscribe();
                this.route.navigateByUrl('home');
              }
            }
            else
            {
              if(result.enabled)
              {
                this.user = result;
                this.snack.open('Bienvenido '+result.name, '', {duration: 3000});
                this.AppComp.isLogged = true;
                this.showNotAllowed = false;
                subAuth.unsubscribe();
                subAuth2.unsubscribe();
                this.route.navigateByUrl('home');
              }
              else
              {
                this.snack.open('Inicia sesión en la aplicación móvil', '', {duration: 4000});
                this.showNotAllowed = true;
                this.authService.logoutUser();
                this.AppComp.isLogged = false;
              }
            }
           
          })
          
        }        
        
      })
    }).catch(err => {
      console.log(err.code);
      if(err.code == 'auth/user-not-found')
      {
        this.snack.open('El usuario no esta registrado o no existe', '', {duration: 2000})
      }
      if(err.code == 'auth/wrong-password')
      {
        this.snack.open('El usuario o la contraseña es incorrecta', '', {duration: 2000})
      }
      if(err.code == 'auth/too-many-requests')
      {
        this.snack.open('Muchos intentos fallidos espere un minuto...', '', {duration: 2000})
      }
      
    })
  }

  detectFiles(event){
    let file = event.target.files[0];
    this.currentUpload = new Upload(file);
    this.storage.upload('ProfCarnets/'+this.options.get('emailControl').value+'.png',this.currentUpload.file).then(response =>{
      let url = this.storage.ref('ProfCarnets/'+this.options.get('emailControl').value+'.png').getDownloadURL();
      url.subscribe(result =>{
        console.log(result);
        this.userUrl = result;
      })
    });
    
  }

  resetPassword(){
    let mail = this.options.get('emailControl').value;
    if (mail != '')
    {
      this.authService.resetPassword(mail)
    }
    else
    {
      this.snack.open('Debe ingresar su correo', '', {duration: 2500});
    }
  }

  async delay(ms: number) {
    await new Promise<void>(resolve => setTimeout(()=>resolve(), ms)).then(()=>console.log("delay ", ms));
  }

}
