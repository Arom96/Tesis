import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController } from '@ionic/angular';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { FormGroup,Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { AuthService } from '../services/auth.service';
import { Toast } from '@ionic-native/toast/ngx';
import { ToastController } from '@ionic/angular';
import { LEADING_TRIVIA_CHARS } from '@angular/compiler/src/render3/view/template';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
export const errorMessages: { [key: string]: string } = {

  maxEstudent:' Número maximo de estudiantes es 20',
  llenar:'El campo no puede estar vacío',
  links:'El link que ingreso es incorrecto',
  opcion:'Seleccione una opción el campo no puede estar vacío',
  perfilPost:'Seleccione un perfil',
  categoriaPost:'Seleccione una categoria de ',
  titulopost:'Ingrese el título de ',
  descripcionPost:'Ingrese una descripción para ',
  fechaPost:'Seleccion la fecha de inicio de',
  numeroPost:'Formato de número telefónico incorrecto',
  comenta: 'Agrega un comentario a',
  name: 'Solo se permiten letras. Sin espacios',
  apellido: 'Solo se permiten letras. Sin espacios',
  email:'El email es requerido',
  emailmal:'Debe ser el correo institucional',
  fecnac:'La fecha de nacimiento es requerida',
  genero: 'El genero es necesario',
  password:'La contraseña es requerida',
  password2:'Las contraseñas no coinciden',
  solotexto:'Solo letras mayúsculas y minúsculas',

};
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


@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {
  @ViewChild('slidePrincipal') slides: IonSlides;

  error=false;
  noExist=false;
  pasar=false;
  usuarioexite=false;
  usuario: Usuario = new Usuario();
  usuariolog: Usuario = new Usuario();
  usuarionew: Usuario = new Usuario();
  usuarionew1: Usuario = new Usuario();
  forma: FormGroup;
  logF:NgForm;
  errors = errorMessages;
  matcher = new MyErrorStateMatcher();
  promo=true;
  slideOpts   = {
    on: {
      beforeInit() {
        const swiper = this;
        swiper.classNames.push(`${swiper.params.containerModifierClass}fade`);
        const overwriteParams = {
          slidesPerView: 1,
          slidesPerColumn: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: true,
          spaceBetween: 0,
          virtualTranslate: true,
        };
        swiper.params = Object.assign(swiper.params, overwriteParams);
        swiper.params = Object.assign(swiper.originalParams, overwriteParams);
      },
      setTranslate() {
        const swiper = this;
        const { slides } = swiper;
        for (let i = 0; i < slides.length; i += 1) {
          const $slideEl = swiper.slides.eq(i);
          const offset$$1 = $slideEl[0].swiperSlideOffset;
          let tx = -offset$$1;
          if (!swiper.params.virtualTranslate) tx -= swiper.translate;
          let ty = 0;
          if (!swiper.isHorizontal()) {
            ty = tx;
            tx = 0;
          }
          const slideOpacity = swiper.params.fadeEffect.crossFade
            ? Math.max(1 - Math.abs($slideEl[0].progress), 0)
            : 1 + Math.min(Math.max($slideEl[0].progress, -1), 0);
          $slideEl
            .css({
              opacity: slideOpacity,
            })
            .transform(`translate3d(${tx}px, ${ty}px, 0px)`);
        }
      },
      setTransition(duration) {
        const swiper = this;
        const { slides, $wrapperEl } = swiper;
        slides.transition(duration);
        if (swiper.params.virtualTranslate && duration !== 0) {
          let eventTriggered = false;
          slides.transitionEnd(() => {
            if (eventTriggered) return;
            if (!swiper || swiper.destroyed) return;
            eventTriggered = true;
            swiper.animating = false;
            const triggerEvents = ['webkitTransitionEnd', 'transitionend'];
            for (let i = 0; i < triggerEvents.length; i += 1) {
              $wrapperEl.trigger(triggerEvents[i]);
            }
          });
        }
      },
    }
  }

  constructor(private router: Router, private fb:FormBuilder, private authSvc: AuthService, private toast: Toast, public toastCtrl: ToastController) 
  {
    // this.authSvc.afAuth.authState.toPromise().then(resp=>{
    //   console.log(resp);
    // })
    this.crearFormulario()
  }

  ngOnInit() {
  }

  crearFormulario(){
    this.forma=this.fb.group({
      nombre  :['',[Validators.required,Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]$')] ],
      apellido:['',[Validators.required,Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]$')]],
      email  :['',[Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')] ],
      genero: ['',Validators.required],
      fechanacimiento:['',[Validators.required]],
      rol:['',Validators.required],
      carrera:['',Validators.required],
      password   :['',[Validators.required, Validators.pattern('(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')]],
   }
   );}

  cambiar(){
     
    this.promo=false;
  }
  navegar(){
    this.router.navigate(['/verify-email'])
  }

  mostrarLogin() {
    this.pasar=false;
    this.slides.lockSwipes(false);
    this.slides.slideTo(0);
    this.slides.lockSwipes(true);
    this.forma.reset({
      nombre:'',
      apellido:'',
      email:'',
      genero:'',
      fechanacimiento:'',
      rol:'',
      carrera:'',
      password:'',
    })
    this.usuario=this.usuarionew1;
  }

  mostrarRegistro() {
    this.pasar=true;
    this.slides.lockSwipes(false);
    this.slides.slideTo(1);
    this.slides.lockSwipes(true);
  }

  async login( form: NgForm ) {
    if(form.invalid){
      Object.values(this.forma.controls).forEach(control=>{
          console.log(control);
          control.markAsTouched();
        })
        return
      }
      try{
        const rep = await this.authSvc.loginMailUser(this.usuariolog.email, this.usuariolog.password);
        console.log(rep.uid)
        if (rep.uid) {
          
          this.logF=form;
          form.reset()
          // const isVerified = this.authSvc.isEmailVerified(rep);
          this.redirectUser(true);
        }else{         
          var error:any=rep;
          if(error.code=='auth/user-not-found'){
            this.noExist=true;
            setTimeout(() => {
                this.noExist=false;
            }, 3000);
            return;
          }else if(error.code=='auth/wrong-password'){
            this.error=true;
            setTimeout(() => {
              this.error=false;
            }, 3000);
            return;
          }
        }

      }catch(err){
          if(err){
           
          }
      }
  
  }

  async register(forma:FormGroup){
    if(this.forma.invalid){
      console.log('entra');
  
      return Object.values(this.forma.controls).forEach(control=>{
        if (control instanceof FormGroup){
          Object.values(control.controls).forEach(control=>control.markAsTouched()) ;
          }else{
            control.markAsTouched();
            return;
          }
        });
      
      }
        try {
          
     
          const user= await this.authSvc.registro(this.usuario);
          if(user){
              
              this.router.navigate(['/splash']);
              this.mostrarLogin();
              this.forma.reset({
                nombre:'',
                apellido:'',
                email:'',
                genero:'',
                fechanacimiento:'',
                rol:'',
                carrera:'',
                password:'',
              })
              this.usuario=this.usuarionew1;
          }
       
        } catch (error) {
          if(error.code=="auth/email-already-in-use"){
              this.usuarioexite=true;
              setTimeout(() => {
                this.usuarioexite=false;
              }, 3000);
          } 
        
        }  
  }

  async openToast(message) {  
    const toast = await this.toastCtrl.create({  
      message: message,   
      duration: 4000  
    });  
    toast.present();  
  }  

  createUser(forma:FormGroup){
    let mailDomain = this.usuario.email.split('@')[1]
    if(mailDomain != 'epn.edu.ec')
    {
      this.openToast('Debe utilizar el correo institucional!')
    }
    else
    {
      let val1 = this.usuario.nombre.match(/\d+/g);
      let val2 = this.usuario.apellido.match(/\d+/g);
      if(this.usuario.nombre.trim().length == 0 || this.usuario.apellido.trim().length == 0)
      {
        this.openToast('Revisar los campos')
      }
      else
      {
        if(!this.forma.controls['password'].hasError('pattern'))
        {
          this.openToast('Creando nuevo usuario por favor espere...')
          //this.toast.show(`Creando nuevo usuario por favor espere...`, '5000', 'center')
          let sub = this.authSvc.createMailUser(this.usuario.email, this.usuario.password, this.usuario.nombre, this.usuario.apellido, 'alumno').then(result =>{
            console.log(result)
            this.forma.reset({
              nombre:'',
              apellido:'',
              email:'',
              genero:'',
              fechanacimiento:'',
              rol:'',
              carrera:'',
              password:'',
            })
            this.usuario=this.usuarionew1;      
          })
        } 
        else
        {
          this.openToast('Por favor revisar los campos...');
        }
      }
      
      
    }
    
  }

  private redirectUser(isVerified: boolean): void {
    
    if (isVerified) {
      this.usuariolog=this.usuarionew;
      this.logF.resetForm();
      this.router.navigate(['dash/tabs/tab1']);
    } 
    else {
      this.usuariolog=this.usuarionew;
      
      this.logF.resetForm();
      this.router.navigate(['verify-email']);
    }
  }

  recuperarPass()
  {
    let mail = this.usuario.email
    if (mail != undefined)
    {
      this.authSvc.resetPassword(mail)
    }
    else
    {
      this.openToast('Debe ingresar su correo institucional')
    }    
  }

}
