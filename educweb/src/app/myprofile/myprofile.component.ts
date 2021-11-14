import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { AuthServiceService } from '../Services/auth-service.service';

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
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css']
})
export class MyprofileComponent implements OnInit {
  hide = true;
  userUrl = '';
  User;
  usrRole;
  currentUpload;

  options = new FormGroup({
    namesControl: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$')
    ]),
    lastnamesControl: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$')
    ]),
    roleControl: new FormControl(''),
    emailControl: new FormControl(''),
    passwControl: new FormControl(''),
    imageSelectorControl: new FormControl(''),
  })

  constructor(private storage: AngularFireStorage, private AppC: AppComponent, private userService: AuthServiceService, private snack: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    this.User = this.AppC.User
    this.options.get('namesControl').setValue(this.User.name);
    this.options.get('lastnamesControl').setValue(this.User.lastname);
    this.options.get('emailControl').setValue(this.User.mail);
    this.options.get('roleControl').setValue(this.User.role);
    this.userUrl = this.User.usrUrl;
    this.usrRole = this.AppC.User.role;
  }

  detectFiles(event){
    let file = event.target.files[0];
    console.log(file)
    this.currentUpload = new Upload(file);
    this.storage.upload('/UsersProfileImg/'+this.User.uid+'.png',this.currentUpload.file).then(response =>{
      let url = this.storage.ref('/UsersProfileImg/'+this.User.uid+'.png').getDownloadURL();
      url.subscribe(result =>{
        console.log(result);
        this.userUrl = result;
        this.updateUser();
      })
    });
    
    
  }

  updateUser(){
    let val1 = this.options.get('namesControl').value.match(/\d+/g);
    let val2 = this.options.get('lastnamesControl').value.match(/\d+/g);
    if(this.options.get('namesControl').value.replace(/\s/g, '').length == 0 || this.options.get('lastnamesControl').value.replace(/\s/g, '').length == 0)
    {
      this.snack.open('Por favor revisar los campos...', '', {duration: 2000})
      this.options.get('namesControl').clearAsyncValidators;
      this.options.get('lastnamesControl').clearAsyncValidators;
      return
    }
    else
    {
      this.userService.updateUser(this.User.uid, this.options.get('namesControl').value, this.options.get('lastnamesControl').value, this.userUrl).then(any => this.snack.open('Datos actualizados con éxito', '', {duration: 2000}));
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

  //cambia la navegacion a login/register con parametros
  navigateWithParams(){
    this.router.navigate(['/home']);
  }

  logOutUser()
  {
    this.AppC.logOutUser();
  }

}
