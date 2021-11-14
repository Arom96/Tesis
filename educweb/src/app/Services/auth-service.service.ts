import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { last, map } from 'rxjs/operators';
import auth from 'firebase/app';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserInterface } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  url: string = 'https://us-central1-educweb-esfot.cloudfunctions.net/createUser';
  url2: string = 'https://us-central1-educweb-esfot.cloudfunctions.net/deleteUser';

  private UserRoles = 'nodata';

  constructor(private afsAuth: AngularFireAuth, private afs: AngularFirestore, private http: HttpClient, private snack: MatSnackBar, private router: Router) { }

  loginMailUser(mail, pass){
    return this.afsAuth.signInWithEmailAndPassword(mail, pass).then(credential => console.log(credential.user))
  }

  resetPassword(mail)
  {
    this.afsAuth.sendPasswordResetEmail(mail)
    this.snack.open('Se envió un correo para reestablecer la contraseña', '', {duration: 3500})
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
        enabled: false
    }
    return this.http.post(this.url, body).toPromise()
    .catch(msg =>{
      console.log(msg);
      if(msg.error == 'ALREADY_EXISTS'){
        errorC = true;
        this.snack.open('Ya existe un usuario con este correo', '', {duration: 3000});
        return
      }
    }).finally(() => {
      if(!errorC)
      {
        this.snack.open('Usuario creado con éxito y en espera de aprobación.', '', {duration: 3000}) 
        if(roles == 'profesor')
        {
          this.afsAuth.signInWithEmailAndPassword(mail, pass).then(credential =>{
            this.router.navigate(['/carnet-upload']);
        })        
        }
        else
        {
          this.router.navigate(['/login'], { queryParams: { params: 'login' } });
        }      
      }
      
    });
  }

  deleteUser(uid){
    let body={uid: uid}
    return this.http.post(this.url2, body).toPromise()
    .catch(msg =>{
      console.log(msg);
    }).finally(() => {
      this.snack.open('El usuario ha sido rechazado y eliminado', '', {duration: 3000});
    });
  }

  logoutUser(){
    return this.afsAuth.signOut();
  } 

  isAuth(){
  return this.afsAuth.authState.pipe(map(auth => auth ));
  }


  updateUserRoles(role){
  this.UserRoles = role;
  } 

  getUserRoles(){
  return this.UserRoles;
  }
  
  listUsers(){
    return this.afs.collection<UserInterface>(`users`).valueChanges();
  }
  
  getUserData(userUid){
    return this.afs.doc<UserInterface>(`users/${userUid}`).valueChanges()
  }

  updateUser(userUid, name, lastname, usrUrl){
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${userUid}`);
    const data = {
      name: name,
      lastname: lastname,
      usrUrl: usrUrl
    }
    return userRef.set(data, { merge: true})
  }

  updateUserCarnet(userUid, carnetUrl){
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${userUid}`);
    const data = {
      carnetUrl: carnetUrl
    }
    return userRef.set(data, { merge: true})
  }

  enableUser(userUid){
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${userUid}`);
    const data = {
      enabled: true
    }
    return userRef.set(data, { merge: true})
  }

  alertUser(userUid){
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${userUid}`);
    const data = {
      dir: 'Advertencia: Su petición no ha sido aceptada por que no ha proporcionado un carnet o no es el correcto. Por favor verifique que el carnet sea el correcto o dentro de las 72 horas su cuenta será eliminada.'
    }
    return userRef.set(data, { merge: true})
  }

  createCategory(catName, desc, cover, uid){
    const res = this.afs.collection('Category').add({
      name: catName,
      desc: desc,
      cover: cover,
      uid: uid,
      temas: []
    })
    console.log(res.then(result =>{
      const userRef: AngularFirestoreDocument<any> = this.afs.doc(`Category/${result.id}`);
      const data = {
        id: result.id
      }
      return userRef.update(data);
    }))
  }

  createNot(name, time, userName){
    const res = this.afs.collection('notifications').add({
      desc: name,
      cat: time,
      autor: userName,
    })
    console.log(res.then(result =>{
      const userRef: AngularFirestoreDocument<any> = this.afs.doc(`notifications/${result.id}`);
      const data = {
        id: result.id
      }
      return userRef.update(data);
    }))
  }

  updateCategory(id, catName, desc, cover){
    console.log(id);
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`Category/${id}`);
    const data = {
      name: catName,
      desc: desc,
      cover: cover
    }
    return userRef.set(data, { merge: true})
  }

  updateTema(id, tema)
  {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`Category/${id}`);
    const data = {
      temas: tema
    }
    return userRef.set(data, { merge: true})
  }

  listCats(){
    return this.afs.collection<UserInterface>(`Category`).valueChanges();    
  }

  deleteCategory(id){
    return this.afs.collection(`Category`).doc(id).delete();
  }

  pushNewTema(id, temas){
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`Category/${id}`);
    const data = {
      temas: temas
    }
    return userRef.set(data, { merge: true})
  }


  

}
