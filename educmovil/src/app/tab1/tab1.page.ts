import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, Platform, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
// import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { File } from '@ionic-native/file/ngx';
import { Observable, Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';

import { ForegroundService } from '@ionic-native/foreground-service/ngx';
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

export interface User {
  uid: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
}
export class Usuario {
  uid: string;
  email: string;
  nombre: string;
  name: string;
  lastname?: string;
  apellido?: string;
  password?: string;
  rol: string;
  estado?: string;
  genero?:  string;
  fechanacimiento?:Date;
  usuarioVerificado: boolean;
  creado?: string;
  carrera?: string;
  usrUrl?: any[];
  credencial?:any[];
  emailVerified: boolean;
  grupos?: string[];
  token?:string;
}
export class FileItem {
  public name: string;
  public archivo:Blob;
  public uploading:boolean;
  public uploadPercent: Observable<number>;
  public downloadURL: Observable<string>;
  public progreso: number;
  public url:string;
  constructor(public file: Blob, name:string) {
    this.archivo=file;
    this.name = name;
    this.progreso=0;
    this.uploading=false;
  }
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  public user$: Observable <any> = this.auth.afsAuth.user;
  public usuario = new Usuario();
  public ImageSource:any[]=[];
  image;
  imagenprobar:string;
  valor=false;
  perfil=false;
  user_uid = '';
  usu$:Subscription;
  usuar$:Subscription;
  images:Blob[]=[];
  forma: FormGroup;

  constructor(private router:Router,private auth: AuthService,public actionSheetController: ActionSheetController, private fb:FormBuilder,
    private platform: Platform, private file: File,public alertController: AlertController,public toastController: ToastController,
    public foregroundService: ForegroundService,
    private storage: AngularFireStorage) {
     this.usuar$=this.user$.subscribe(resp=>{
       this.user_uid = resp.uid;
     this.usu$= this.auth.getUser(resp.uid).subscribe(resp=>{
       if(resp!=undefined){
         console.log(resp);
         this.valor=true;
         this.usuario=resp;
         this.crearFormulario();
         this.llenar();
         if(this.usuario.usrUrl.length!=0){
           this.perfil=true;
         }else{
           this.perfil=false;
         }
       }
   })
 })
 }

  crearFormulario(){
  this.forma=this.fb.group({
    nombre  :['',[Validators.required,Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]$')] ],
    apellido:['',[Validators.required,Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]$')]],
    
 }
 );
  }

  llenar(){
    if(this.usuario.fechanacimiento!= null){
      
      var d=parseInt(this.usuario.fechanacimiento['seconds']);
      var s:Date = new Date(d*1000);
      console.log(s);
      var fec=s;
    }
    this.forma.reset({
      nombre  :this.usuario.name,
      apellido:this.usuario.lastname,
      genero: this.usuario.genero,
      fechanacimiento: fec,
      carrera: this.usuario.carrera
    })
  }

  menu(){
    this.presentActionSheet().then(resp=>{

    })
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Seleccionar',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Galeria',
        role: 'destructive',
        icon: 'images-outline',
        handler: () => {
          this.libreria();
          console.log('Delete clicked');
        }
      }, {
        text: 'Foto',
        icon: 'camera-outline',
        handler: () => {
          console.log('Share clicked');
          this.camara();
        }
      }, 
      {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }
  async camara() {
    this.foregroundService.start('App Running', 'Background Service', 'drawable/fsicon');
    const takePhoto = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      quality: 50,
      saveToGallery: true
    });
    // const cameraPhoto = await this.openCamera();
    this.ImageSource
    // this.image = cameraPhoto;
    this.image = takePhoto.dataUrl;
    this.foregroundService.stop();
    let block = this.image.split(',')[1];
    console.log(block)

    this.storage.ref('/UsersProfileImg/'+this.user_uid+'.png').putString(block, "base64", {contentType: 'image/png'}).then(response =>{
      let url = this.storage.ref('/UsersProfileImg/'+this.user_uid+'.png').getDownloadURL();
      url.subscribe(result =>{
        console.log(result);
        this.usuario.usrUrl = result;
        this.cambio(this.forma);
      })
    });
    
    // const fileURI = this.image;
    // let file: string;
    // this.imagenprobar=file
    // if (this.platform.is('ios')) {
    //   file = fileURI.split('/').pop();
    // } else {
    //   file = fileURI.substring(fileURI.lastIndexOf('/') + 1);
    //   console.log(file);
    // }
    // const path: string = fileURI.substring(0, fileURI.lastIndexOf('/'));
    

    // const buffer: ArrayBuffer = await this.file.readAsArrayBuffer(path, file);
    // const blob: Blob = new Blob([buffer], { type: 'image/jpeg' });
    // this.images.push(blob);
    // const id = Math.random().toString(36).substring(2) +'.jpg';
    // this.getImageFromService(blob,id);    
    
  }
  async openCamera() {
    // const options: CameraOptions = {
    //   quality: 100,
    //   destinationType: this.camera.DestinationType.FILE_URI,
    //   encodingType: this.camera.EncodingType.JPEG,
    //   mediaType: this.camera.MediaType.PICTURE,
    //   targetWidth: 1000,
    //   targetHeight: 1000,
    //   sourceType: this.camera.PictureSourceType.CAMERA
    // };
    // return await this.camera.getPicture(options);
  }
  async libreria(){

    const takePhoto = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
      quality: 100,
    });

    // const libraryImage = await this.openLibrary();
    // this.image = libraryImage;
   
    this.image = takePhoto.dataUrl;
    console.log(this.image)
    //this.usuario.usrUrl = this.image;
    const fileURI = this.image;
    let block = this.image.split(',')[1];
    console.log(block)

    this.storage.ref('/UsersProfileImg/'+this.user_uid+'.png').putString(block, "base64", {contentType: 'image/png'}).then(response =>{
      let url = this.storage.ref('/UsersProfileImg/'+this.user_uid+'.png').getDownloadURL();
      url.subscribe(result =>{
        console.log(result);
        this.usuario.usrUrl = result;
        this.cambio(this.forma);
      })
    });
  }
  async openLibrary() {
    // const options: CameraOptions = {
    //   quality: 100,
    //   destinationType: this.camera.DestinationType.FILE_URI,
    //   encodingType: this.camera.EncodingType.JPEG,
    //   mediaType: this.camera.MediaType.PICTURE,
    //   targetWidth: 1000,
    //   targetHeight: 1000,
    //   sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    // };
    // return await this.camera.getPicture(options);
  }
  getImageFromService(blob:Blob, name:string) {
       
   
    const newFile= new FileItem(blob,name);
    var arra:FileItem[]=[]
    arra.splice(0,1,newFile);
    this.usuario.usrUrl = arra;
    
    // this.auth.updateUserwithImg( arra,this.usuario.uid).then(resp=>{
    //     this.presentToast('Se ha cambiado la foto!');
    // });
  }
  async presentToast( mensaje:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }
  cambio(  form:FormGroup ){
    if(form.invalid){
      Object.values(form.controls).forEach(control=>{
          this.presentToast('Solo se permiten letras. Sin espacios')
          control.markAsTouched();
        })
        return
      }
      try{
   
        this.datosPost(form);
          console.log('llega')
          this.auth.actuliazarCuentaUsuario(this.usuario).then(resp=>{
          this.llenar();
          this.presentToast('Datos actualizados con éxito');
          
        })  
      }catch(err){

      }
    
  }
  datosPost(forma:FormGroup){
    this.usuario.name=forma.get('nombre').value;
    this.usuario.lastname=forma.get('apellido').value;
  }
  logOut(){
    this.auth.logOut();
    this.router.navigate(['splash']);
  }
}
