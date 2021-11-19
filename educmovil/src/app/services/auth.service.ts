import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, map, take } from 'rxjs/operators';
import { Toast } from '@ionic-native/toast/ngx';
import { ToastController } from '@ionic/angular';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
}
export class Usuario {
  uid: string;
  email: string;
  name: string;
  nombre: string;
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

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url: string = 'https://us-central1-educweb-esfot.cloudfunctions.net/createUser';
  public user$: Observable<User>;
  public usu: Observable<Usuario>;  
  public usuario = new Usuario();

  constructor(public afsAuth: AngularFireAuth, private afs: AngularFirestore, private http: HttpClient, private snack: MatSnackBar, private router: Router, private toast: Toast, public toastCtrl: ToastController) 
  { 
    this.user$ = this.afsAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        }
        return of(null);
      })
    );
  }

  async loginMailUser(mail, pass){
    try {
      const { user } = await this.afsAuth.signInWithEmailAndPassword(mail, pass);
     
      return user;
    } catch (error) {
      return error;
    }
  }

  async registro(usuario:Usuario){
    const authData = {
      ...usuario,
    }
    const result= await this.afsAuth.createUserWithEmailAndPassword(authData.email, authData.password).then(
      resp=>{
        console.log(resp.user.uid);
        console.log(authData);
         this.afs.doc(`usuarios/${resp.user.uid}`).set({
          uid:resp.user.uid,
          email : authData.email,
          nombre: authData.nombre,
          apellido: authData.apellido,
          fechanacimiento: authData.fechanacimiento,
          rol:authData.rol,
          usuarioVerificado:true,
          creado:'firebase',
          estado:"activo",
          genero:authData.genero,
          grupos:['Global'],
          photoURL:[],
          credencial:[],
          carrera:authData.carrera,
          token:""
      }

    );
   
    resp.user.updateProfile({
        displayName: authData.apellido,
    })
    return resp;
  });

    return result;

  }

  createMailUser(mail, pass, name, lastname, roles, cedula?:'', celularm?:'', dir?:'', url?:'', birthdate?:''){
    let errorC = false;
    let msg = ''
    let body={
        mail: mail,
        pwd: pass,
        name: name,
        lastname: lastname,
        birthdate: '',
        cedula: '', 
        celular: '',
        dir: '',
        role: roles,
        imgUrl: '',
        enabled: false,
        token: '',
    }
    return this.http.post(this.url, body).toPromise()
    .catch(msg =>{
      console.log(msg);
      if(msg.error == 'ALREADY_EXISTS'){
        errorC = true;
        //this.snack.open('Ya existe un usuario con este correo', '', {duration: 3000});
        this.openToast('Ya existe un usuario con este correo')
        return
      }
    }).finally(() => {
      if(!errorC)
      {
        //this.snack.open('Usuario creado con exito y en espera de aprobacion.', '', {duration: 3000}) 
        this.openToast('Usuario creado con exito.')
        if(roles == 'profesor')
        {
          this.afsAuth.signInWithEmailAndPassword(mail, pass).then(credential =>{
            this.router.navigate(['/carnet-upload']);
        })        
        }
        else
        {
          this.router.navigate(['/splash'], { queryParams: { params: 'login' } });
        }      
      }
      
    });
  }

  logOut()
  {
    this.afsAuth.signOut();
  }

  async openToast(message) {  
    const toast = await this.toastCtrl.create({  
      message: message,   
      duration: 4000  
    });  
    toast.present();  
  } 

  getUser(uid: string ){
    const userRef: AngularFirestoreDocument<Usuario> = this.afs.doc(`users/${uid}`);
    this.usu = userRef.snapshotChanges().pipe(map(a => {
      const data = a.payload.data() as Usuario;
      if ( data ){
        this.usuario = data;
        const id = a.payload.id;
        return {id, ...data};
      }else{
        return null;
      }
    }));
    return this.usu ;
  }

  actuliazarCuentaUsuario(usuario:Usuario){
    return this.afs.doc(`users/${usuario.uid}`).update({
       name:usuario.name,
       lastname:usuario.lastname,
       usrUrl:usuario.usrUrl
     });
   }

  listCategories(){
    return this.afs.collection(`Category`).valueChanges();
//   const userRef = this.afs.collection(`Category`);
//   this.usu = userRef.snapshotChanges().pipe(map(a => {
//     const data = a.payload.data() as Usuario;
//     if ( data ){
//       this.usuario = data;
//       const id = a.payload.id;
//       return {id, ...data};
//     }else{
//       return null;
//     }
//   }));
//   return this.usu ;
  }

  listNots(){
    return this.afs.collection(`notifications`, ref => ref.orderBy('cat')).valueChanges();
//   const userRef = this.afs.collection(`Category`);
//   this.usu = userRef.snapshotChanges().pipe(map(a => {
//     const data = a.payload.data() as Usuario;
//     if ( data ){
//       this.usuario = data;
//       const id = a.payload.id;
//       return {id, ...data};
//     }else{
//       return null;
//     }
//   }));
//   return this.usu ;
  }

  actualizartoken(token: string, usuario: any){
    return this.afs.doc(`users/${usuario.uid}`).update({
      token
    });

  }

  resetPassword(mail)
  {
    this.afsAuth.sendPasswordResetEmail(mail)
    this.openToast('Se envió un correo para reestablecer la contraseña');
  }
}
