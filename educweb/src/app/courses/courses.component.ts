import { Platform } from '@angular/cdk/platform';
import { Component, Inject, OnInit, AfterViewInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { DialogData } from '../categories/categories.component';
import { Upload } from '../login/login.component';
import { AuthServiceService } from '../Services/auth-service.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Swal from 'sweetalert2'
// "ngx-image-cropper": "^3.0.3",

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  selecedCat = '';
  Categories = [];
  selectedTema = [];
  selectedID = '';
  userName;
  usrImg;
  usrRole;
  usrID;
  urlSafe: SafeResourceUrl;

  // variables para comprobar temas
  temacreado: boolean = false;

  // varibales para guardar el arreglo de lecturas
  listalecturas: any[];

  constructor(
    private auth: AuthServiceService,
    public dialog: MatDialog,
    private snack: MatSnackBar,
    private router: Router,
    private Appc: AppComponent,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    // .map(res => {
    //   res.url_youtube = this.sanitizer.bypassSecurityTrustResourceUrl(res.url_youtube);
    // });

    this.userName = this.Appc.User.name;
    this.usrImg = this.Appc.usrImg;
    let sub = this.auth.listCats().subscribe(result => {
      this.Categories = result;
      for(let s in this.Categories)
      {
        this.Categories[s].numero = this.Categories[s]['temas'].length
      }
      this.Categories.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
      this.usrRole = this.Appc.User.role;
      // console.log(this.Categories);
      this.usrID = this.Appc.User.uid
    })
  }

  openCreateTema() {
    
    if (this.selecedCat != '') {
      const dialogRef = this.dialog.open(NewTemaDialog, {
        width: '300px',
        data: { data: this.selecedCat, process: 'new' }
      });
      dialogRef.afterClosed().subscribe(result => {

        this.createTema(result);
        this.snack.open('Tema creado con éxito', '', { duration: 2500 })

      });
    } else {
      this.snack.open('Debe seleccionar un tema antes!.', '', { duration: 2500 })
    }
  }

  openConfirmDelete(task, tema) {
    // console.log(task);
    if (this.usrID == task.uid) 
    {
      const dialogRef = this.dialog.open(ConfirmDialog, {
        width: '300px',
        data: { data: 's', process: 'new' }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result == 'deleteLectura') {
          if (this.usrID == task.uid) {
            //aqui va lo de eliminar
            this.deleteLectura(task, tema)
          }
          else {
            this.snack.open('No tiene permisos para eliminar.', '', { duration: 2500 })
          }

        }
        if (result == 'deletePrueba') {
          if (this.usrID == task.uid) {
            //aqui va lo de eliminar
            this.deletePrueba(task, tema)
          }
          else {
            this.snack.open('No tiene permisos para eliminar.', '', { duration: 2500 })
          }

        }
      })
    }
    else
    {
      this.snack.open('No tiene permisos para eliminar.', '', { duration: 2500 })
    }
  }

  openConfirmDeletePrueba(task, tema) {
    if (this.usrID == task.uid) 
    {
      const dialogRef = this.dialog.open(ConfirmDialog, {
        width: '300px',
        data: { data: 's', process: 'new' }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result == 'deleteLectura') {
          //aqui va lo de eliminar
          this.deletePrueba(task, tema)
        }
      })
    }
    else
    {
      this.snack.open('No tiene permisos para eliminar.', '', { duration: 2500 })
    }
  }

  deleteLectura(task, tema) {
    let Tid = this.selectedTema.indexOf(tema);
    let lecturaID = tema.lecturas.indexOf(task);
    this.selecedCat['temas'][Tid]['lecturas'].splice(lecturaID, 1);
    this.auth.updateTema(this.selectedID, this.selecedCat['temas']);

  }

  logOutUser() {
    this.Appc.logOutUser();
  }

  deletePrueba(task, tema) {
    let Tid = this.selectedTema.indexOf(tema);
    let lecturaID = tema.pruebas.indexOf(task);
    this.selecedCat['temas'][Tid]['pruebas'].splice(lecturaID, 1);
    this.auth.updateTema(this.selectedID, this.selecedCat['temas']);

  }

  openCreateLectura(padre) {

    // console.log(padre);
    

    for (let i = 0; i < this.selecedCat['temas'].length; i++) {
      if (this.selecedCat['temas'][i].nombre == padre) {
        this.listalecturas = this.selecedCat['temas'][i].lecturas;
        break;
      }
    }

    // console.log(this.listalecturas);
    
    
    const dialogRef = this.dialog.open(NewLecturaDialog, {
      width: '80vw',
      data: { data: '', process: 'new', lecturas: this.listalecturas }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        if (result.name != '' && result.name != null) {
          // console.log('RESULT:', result);
          this.createLectura(
            padre,
            result.name,
            result.file,
            result.desc,
            result.level,
            result.images,
            result.url_youtube
          );
          this.snack.open('Lectura creada con éxito', '', { duration: 2000 })
        }
        else {
          this.snack.open('Debe ingresar un nombre', '', { duration: 2000 });
        }
      }
      if (result == null) {
        this.snack.open('Debe ingresar un nombre', '', { duration: 2000 });
      }
    })
  }

  OpenEditLectura(padre, lecturas, index) {
    // console.log('Edit:', padre, index);
    // console.log('usrID:', this.usrID);
    if (this.usrID == padre.uid) 
    {
      const dialogRef = this.dialog.open(NewLecturaDialog, {
        width: '80vw',
        data: { data: padre, process: 'edit' }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result != undefined) {
          if (this.usrID == padre.uid) {
            // console.log(result)
            this.editLectura(
              lecturas,
              result.name,
              result.file,
              result.desc,
              result.level,
              index,
              result.images,
              result.url_youtube
            );
            this.snack.open('Lectura editada con éxito', '', { duration: 2000 })
          } else {
            this.snack.open('No tiene permisos para editar esta lectura', '', { duration: 2500 })
          }
        }
      })
    }
    else
    {
      this.snack.open('No tiene permisos para editar esta lectura', '', { duration: 2500 })
    }
  }

  openCreatePrueba(padre) {
    const dialogRef = this.dialog.open(NewPruebaDialog, {
      width: '100vw',
      data: { data: '', process: 'new' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        // console.log(result)
        this.createPrueba(padre, result.name, result.payload, this.usrID)
        this.snack.open('Prueba agregada con éxito', '', { duration: 2000 })
      }
    })
  }

  openEditPrueba(prueba, tema_nombre, index) {
    // console.log(prueba)
    if (this.usrID == prueba.uid) 
    {
      const dialogRef = this.dialog.open(NewPruebaDialog, {
        width: '100vw',
        data: { data: prueba, process: 'edit' }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result != undefined) {
          // console.log(result)
          //this.createPrueba(padre, result.name, result.payload)
          this.updatePrueba(tema_nombre, result.name, result.payload, this.usrID, index);
          this.snack.open('Prueba actualizada con éxito', '', { duration: 2000 })
        }
      })
    }
    else
    {
      this.snack.open('No tiene permisos para editar esta prueba.', '', { duration: 2000 })
    }
  }

  showCatDetails(category) {
    for (let s in this.Categories) {
      if (category.name != this.Categories[s].name) {
        document.getElementById(this.Categories[s].name).style.border = "2px transparent";
        document.getElementById(this.Categories[s].name).style.borderRadius = "15px";
      }
      else {
        document.getElementById(this.Categories[s].name).style.border = "2px solid";
        document.getElementById(this.Categories[s].name).style.borderRadius = "15px";
      }

    }

    // console.log(category);
    this.selectedTema = [];
    this.selectedID = category.id;
    this.selecedCat = category;
    for (let s in category['temas']) {
      this.selectedTema.push(category['temas'][s]);
    }

    // if (this.selectedTema) {
    //   this.selectedTema.map(res => {
    //     res.lecturas.map(lec => {
    //       console.log('RES', res.lecturas);
    //       let urlSafe: SafeResourceUrl;
    //       urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(lec.url_youtube);
    //       lec.url_youtube = urlSafe;
    //     });
    //   });
    // }

    // console.log('Temas:', this.selectedTema);

  }

  goToLink(url: string) {
    window.open(url, "_blank");
  }

  createTema(name) {

    if (name.length != 0) {
      // console.log(this.selecedCat);
      let id = this.selecedCat['id'];
      let temas = this.selecedCat['temas']
      temas.push({ 'lecturas': [], 'pruebas': [], 'nombre': name })
      this.auth.pushNewTema(id, temas);
      let current_datetime = new Date();
      let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds() 
      this.auth.createNot('Nuevo tema "'+name+'" disponible en la categoría: '+this.selecedCat['name'], formatted_date, this.userName)
      this.selecedCat = '';
    } else {
      this.snack.open('Debe ingresar un nombre', '', { duration: 2000 })
    }
  }

  createLectura(padre, name, doc, desc, level, images, url_youtube) {
    let id = this.selecedCat['id'];
    let temas = this.selecedCat['temas']
    for (let s in temas) {
      if (temas[s].nombre == padre) {
        temas[s].lecturas.push({
          'doc': doc,
          'nombre': name,
          'level': level,
          'desc': desc,
          'images': images,
          'url_youtube': url_youtube,
          'uid': this.usrID,
          'autor': this.Appc.User.name + ' ' + this.Appc.User.lastname
        })
      }
    }
    // console.log(temas);
    this.auth.pushNewTema(id, temas);
    let current_datetime = new Date();
    let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds() 
    this.auth.createNot('Nueva lectura: "'+name+'" esta disponible en: '+padre, formatted_date, this.userName)
  }

  editLectura(padre, name, doc, desc, level, index, images, url_youtube) {
    let id = this.selecedCat['id'];
    let temas = this.selecedCat['temas']
    for (let s in temas) {
      if (temas[s].nombre == padre) {
        temas[s].lecturas[index] = {
          'doc': doc,
          'nombre': name,
          'level': level,
          'desc': desc,
          'images': images,
          'url_youtube': url_youtube,
          'uid': this.usrID
        }
      }
    }
    this.auth.pushNewTema(id, temas);
  }


  createPrueba(padre, name, url, uid) {
    let id = this.selecedCat['id'];
    let temas = this.selecedCat['temas']
    for (let s in temas) {
      if (temas[s].nombre == padre) {
        temas[s].pruebas.push({
          'name': name,
          'payload': url,
          'uid': uid
        })
      }

    }
    // console.log(temas);
    this.auth.pushNewTema(id, temas);
    let current_datetime = new Date();
    let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds() 
    this.auth.createNot('Nueva prueba "'+name+'" esta disponible en: '+padre, formatted_date, this.userName)
  }


  updatePrueba(padre, name, url, uid, index) {
    let id = this.selecedCat['id'];
    let temas = this.selecedCat['temas']
    for (let s in temas) {
      if (temas[s].nombre == padre) {
        temas[s].pruebas[index] = {
          'name': name,
          'payload': url,
          'uid': uid
        }
        // temas[s].pruebas.push({
        //   'name': name,
        //   'payload': url,
        //   'uid': uid
        // })
      }

    }
    // console.log(temas);
    this.auth.pushNewTema(id, temas);
  }

  viewPrueba(prueba) {
    // console.log(prueba);
    const dialogRef = this.dialog.open(ViewPruebaDialog, {
      width: '100vw',
      data: { data: prueba, process: 'new' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        // console.log(result)
      }
    })
  }

  //-------Para mantener el acordeon en refresh
  trackByIdentity(index, item) {
    return item.name;
  }

  //cambia la navegacion a login/register con parametros
  navigateWithParams() {
    this.router.navigate(['/home']);
  }

}

// =================================================================================================
// COMPONENT newTema
// =================================================================================================


@Component({
  selector: 'newTema',
  templateUrl: 'newTema.html',
  styleUrls: ['newTema.css']
})



export class NewTemaDialog implements OnInit {

  currentUpload;
  uploadLink = ''
  process;
  name = '';
  public NameInput = new FormControl();

  // varibale para comprobar el tema
  temacreado: boolean = false;

  constructor(
    private storage: AngularFireStorage,
    private auth: AuthServiceService,
    public dialogRef: MatDialogRef<NewTemaDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private snack: MatSnackBar
  ) {
    if (this.data["data"] != undefined) {
      // this.user = this.data["usr"];
      this.name = this.data['data']['name'];
    }
    this.process = this.data.process;
  }


  ngOnInit() {

  }

  createTema() {

    if(this.NameInput.value.trim() == '' || this.NameInput.value == undefined){
      this.snack.open('Debe ingresar un nombre', '', { duration: 2000 });
    }else{      

      for (let i = 0; i < this.data['data'].temas.length; i++) {
        if (this.NameInput.value.trim().toLocaleLowerCase() == this.data['data'].temas[i].nombre.toLocaleLowerCase()) {
          this.temacreado = true;
          break;
        }else{
          this.temacreado = false;
        }
      }

      if (this.temacreado) {

        this.snack.open("No hemos podido crear el tema por que ya existe, por favor verifique he intentelo nuevamente", '', {duration: 3600});
      }else{
        let name = this.NameInput.value.trim();
        this.dialogRef.close(name);
      }

      
    }
    
  }

}



// =================================================================================================
// COMPONENT newLectura
// =================================================================================================

@Component({
  selector: 'newLectura',
  templateUrl: 'newLectura.html',
  styleUrls: ['newLectura.css']
})
export class NewLecturaDialog implements OnInit {

  currentUpload;
  uploadLink = ''
  process;
  uploading = false;
  usrUID;
  disableurl = false;
  public NameInput = new FormControl();
  public DescInput = new FormControl();
  public levelControl = new FormControl();

  //base64
  imgBase64: string;
  contentType: string = 'data:image/jpeg;base64,';
  imageData: string;
  dataImages: any[] = [];
  public urlYouTubeInput = new FormControl();

  // variables para la lista de lecturas
  listalecturas: any[];
  comprobarlectura: boolean = false;

  constructor(
    private storage: AngularFireStorage,
    private auth: AuthServiceService,
    public dialogRef: MatDialogRef<NewLecturaDialog>,
    private snack: MatSnackBar,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    if (this.data["usr"] != undefined) {
      // this.user = this.data["usr"];
      // console.log(this.data);
    }
    this.process = this.data.process;
  }

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  isEditable = false;

  ngOnInit() {
    
    this.listalecturas = this.data['lecturas'];   
    // lista ... = lecturas 
    // console.log(this.listalecturas);

    if (this.process == 'edit') {

      this.listalecturas = [{
        doc: '',
        nombre: '',
        level: '',
        desc: '',
        images: '',
        url_youtube: '',
        uid: '',
        autor: ''
      }];

      // recibo un objeto y lo guardo en la posicion 0 del array
      // console.log('EDIT:', this.process, this.data);
      this.NameInput.setValue(this.data['data']['nombre']);
      this.DescInput.setValue(this.data['data']['desc']);
      this.levelControl.setValue(this.data['data']['level']);
      this.uploadLink = this.data['data']['doc'];
      const url_youtube = this.data['data']['url_youtube'] ? this.data['data']['url_youtube'] : '';
      // console.log('url_youtube', url_youtube);
      this.urlYouTubeInput.setValue(url_youtube);
      const dataIMGs = this.data['data']['images'] ? this.data['data']['images'] : [];
      // console.log('dataIMGs', dataIMGs);
      this.dataImages = [...dataIMGs];
      this.listalecturas[0] = this.data['data'];
      // this.listalecturas[0] = 'prueba';

      // console.log(this.listalecturas);      
    }

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });

  }


  detectFiles(event) {
    this.uploading = true;
    let name = this.NameInput.value;
    (document.getElementById("save") as HTMLButtonElement).disabled = true;
    name = name + Math.random().toString(36).replace(/[^a-z]+/g, '')
    let file = event.target.files[0];
    this.currentUpload = new Upload(file);
    this.storage.upload('/Lecturas/' + name + '.pdf', this.currentUpload.file).then(response => {
      let url = this.storage.ref('/Lecturas/' + name + '.pdf').getDownloadURL();
      url.subscribe(result => {
        this.uploading = false;
        (document.getElementById("save") as HTMLButtonElement).disabled = false;
        // console.log(result);
        this.uploadLink = result;
        this.snack.open("Documento cargado con éxito", '', { duration: 3500 })
      })
    });

  }


  // ========================================================================================
  // IMAGE SELECTED
  // ========================================================================================

  imageChangeEvent(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      let imageSelected = file;
      const SIZE = 60000;
      if(file && file.size <= SIZE){
        this.handleInputChange(file); //turn into base64

      }else{
        Swal.fire(
          'Solo se permiten imágenes de 500 x 500',
          'Con un peso menor a 6MB',
          'warning'
        )
      }
      
    } else {
      console.log("No file selected");
    }
  }

  handleInputChange(files) {
    let file = files;
    let pattern = /image-*/;
    let reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onloadend = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e) {
    let reader = e.target;
    const base64result = reader.result.substr(reader.result.indexOf(',') + 1);
    this.imgBase64 = base64result;
    const imageData = this.contentType + this.imgBase64;
    this.imageData = this.contentType + this.imgBase64;
    this.dataImages.push(imageData);
  }

  onDeleteImg(index) {
    this.dataImages.splice(index, 1);
  }

  // ========================================================================================

  createLectura() {

    let name = this.NameInput.value;
    let desc = this.DescInput.value;
    let level = this.levelControl.value;

    if (this.uploadLink == '' || this.NameInput.value.trim().length == 0 ) {
      this.snack.open('Revise que todos los campos esten llenos', '', { duration: 2500 });
    } else {
      
      if(this.process == 'edit'){
        this.dialogRef.close({
          'file': this.uploadLink,
          'name': name,
          'desc': desc,
          'level': level,
          'images': this.dataImages,
          'url_youtube': this.urlYouTubeInput.value
        }); 
      }else{
        for (let i = 0; i < this.listalecturas.length; i++) {  
          if ( name.trim().toLowerCase() == this.listalecturas[i].nombre.toLowerCase()) {
            this.comprobarlectura = true;
            break;
          }else{
            this.comprobarlectura = false;
          }
        }
        if (this.comprobarlectura) {
          this.snack.open("La lectura ya existe por favor verifique he intente nuevamente", '', { duration: 3500 })
        }else{
          this.dialogRef.close({
            'file': this.uploadLink,
            'name': name,
            'desc': desc,
            'level': level,
            'images': this.dataImages,
            'url_youtube': this.urlYouTubeInput.value
          }); 
        }
      }

    }    
 }

  goToLink(url: string) {
    window.open(url, "_blank");
  }

  matchYoutubeUrl(url) {
    var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    var matches = url.match(p);
    if(matches){
        return matches[1];
    }
    return false;
}


  check(sender){
    var url = this.urlYouTubeInput.value;
    var id = this.matchYoutubeUrl(url);
    if(id){
      this.disableurl = true;
    }else{
      Swal.fire(
        'URL no válida',
        'Inserta un enlace de YOUTUBE válido',
        'warning'
      )
      this.urlYouTubeInput.setValue('');
      this.disableurl = false;

    }
}

}


// =================================================================================================
// COMPONENT newPrueba
// =================================================================================================


@Component({
  selector: 'newPrueba',
  templateUrl: 'newPrueba.html',
  styleUrls: ['newPrueba.css']
})
export class NewPruebaDialog implements OnInit, AfterViewInit {
  QuizInput = new FormControl();
  NameInput = new FormControl();
  process;
  quiz = { 'questions': [{ '1': 'Pregunta1', '2': 'Pregunta2', '3': 'Pregunta3', '4': 'Pregunta4', 'correcta': '2', 'pregunta': 'texto depregunta' }] };
  currentStep = 0;

  constructor(
    private storage: AngularFireStorage,
    private auth: AuthServiceService,
    public dialogRef: MatDialogRef<NewPruebaDialog>,
    private snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private platform: Platform
  ) {
    if (this.data["usr"] != undefined) {
      // this.user = this.data["usr"];
      console.log(this.data);
    }
    this.process = this.data.process;
  }


  ngOnInit() {
    console.log(this.process);
    if (this.process == 'edit') {
      // (document.getElementById("name") as HTMLInputElement).value = this.data['data']['name'];
      console.log(this.data);
      this.quiz = { 'questions': [] }
      for (let s in this.data['data']['payload']) {
        this.quiz.questions.push({ '1': this.data['data']['payload'][s]['1'], '2': this.data['data']['payload'][s]['2'], '3': this.data['data']['payload'][s]['3'], '4': this.data['data']['payload'][s]['4'], 'correcta': this.data['data']['payload'][s]['correcta'], 'pregunta': this.data['data']['payload'][s]['pregunta'] });

      }
      console.log(this.quiz);
    }

  }

  ngAfterViewInit() {
    this.loadData();
  }

  loadData() {
    setTimeout(() => {
      if (this.process == 'edit') {
        (document.getElementById('name') as HTMLInputElement).value = this.data['data']['name']
        for (let s in this.data['data']['payload']) {
          (document.getElementById([s, '1'].join('')) as HTMLInputElement).value = this.quiz.questions[s]['1'];
          (document.getElementById([s, '2'].join('')) as HTMLInputElement).value = this.quiz.questions[s]['2'];
          (document.getElementById([s, '3'].join('')) as HTMLInputElement).value = this.quiz.questions[s]['3'];
          (document.getElementById([s, '4'].join('')) as HTMLInputElement).value = this.quiz.questions[s]['4'];
          (document.getElementById([s, 'correcta'].join('')) as HTMLSelectElement).value = this.quiz.questions[s]['correcta'];
          (document.getElementById([s, 'ask'].join('')) as HTMLInputElement).value = this.quiz.questions[s]['pregunta'];

        }
      }
    }, 100);
  }


  agregarPregunta() {
    this.quiz.questions.push({ '1': 'Pregunta1', '2': 'Pregunta2', '3': 'Pregunta3', '4': 'Pregunta4', 'correcta': '2', 'pregunta': 'texto depregunta' })
  }

  guardarPrueba() {
    let error = false;
    let index = 0
    for (let s in this.quiz.questions) {
      if ((document.getElementById(String(index) + 'ask') as HTMLInputElement).value != '' && (document.getElementById(String(index) + '1') as HTMLInputElement).value != '' && (document.getElementById(String(index) + '2') as HTMLInputElement).value != '' && (document.getElementById(String(index) + '4') as HTMLInputElement).value != '' && (document.getElementById(String(index) + 'correcta') as HTMLSelectElement).value != '') {
        this.quiz.questions[s]['pregunta'] = (document.getElementById(String(index) + 'ask') as HTMLInputElement).value;
        this.quiz.questions[s]['1'] = (document.getElementById(String(index) + '1') as HTMLInputElement).value;
        this.quiz.questions[s]['2'] = (document.getElementById(String(index) + '2') as HTMLInputElement).value;
        this.quiz.questions[s]['3'] = (document.getElementById(String(index) + '3') as HTMLInputElement).value;
        this.quiz.questions[s]['4'] = (document.getElementById(String(index) + '4') as HTMLInputElement).value;
        this.quiz.questions[s]['correcta'] = (document.getElementById(String(index) + 'correcta') as HTMLSelectElement).value;
        index += 1
      }
      else {
        error = true;
        this.snack.open('Llene todos los campos', '', { duration: 3000 });
      }

    }
    console.log(this.quiz)
    if (!error) {
      this.dialogRef.close({ 'name': (document.getElementById('name') as HTMLInputElement).value, 'payload': this.quiz.questions });
    }
  }

  //funcion de delay
  async delay(ms: number) {
    await new Promise<void>(resolve => setTimeout(() => resolve(), ms)).then(() => console.log("T= ", ms));
  }

  createPrueba() {
    let name = this.NameInput.value;
    let url = this.QuizInput.value;
    this.dialogRef.close({ 'name': name, 'url': url });
  }


}

// =================================================================================================
// COMPONENT viewPrueba
// =================================================================================================


@Component({
  selector: 'viewPrueba',
  templateUrl: 'viewPrueba.html',
  styleUrls: ['viewPrueba.css']
})
export class ViewPruebaDialog implements OnInit {
  QuizInput = new FormControl();
  NameInput = new FormControl();
  process;
  QuizName;
  quiz = { 'questions': [{ '1': 'Pregunta1', '2': 'Pregunta2', '3': 'Pregunta3', '4': 'Pregunta4', 'correcta': '2', 'pregunta': 'texto depregunta' }] };
  currentStep = 0;

  constructor(
    private storage: AngularFireStorage,
    private auth: AuthServiceService,
    public dialogRef: MatDialogRef<NewPruebaDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    if (this.data["data"] != undefined) {
      // this.user = this.data["usr"];
      console.log(this.data);
    }
    this.process = this.data.process;
  }


  ngOnInit() {
    this.QuizName = this.data['data']['name'];
    this.quiz = this.data['data']['payload'];
  }

  agregarPregunta() {
    this.quiz.questions.push({
      '1': 'Pregunta1',
      '2': 'Pregunta2',
      '3': 'Pregunta3',
      '4': 'Pregunta4',
      'correcta': '2',
      'pregunta': 'texto depregunta'
    })

  }

  guardarPrueba() {
    let index = 0
    for (let s in this.quiz.questions) {
      this.quiz.questions[s]['pregunta'] = (document.getElementById(String(index) + 'ask') as HTMLInputElement).value;
      this.quiz.questions[s]['1'] = (document.getElementById(String(index) + '1') as HTMLInputElement).value;
      this.quiz.questions[s]['2'] = (document.getElementById(String(index) + '2') as HTMLInputElement).value;
      this.quiz.questions[s]['3'] = (document.getElementById(String(index) + '3') as HTMLInputElement).value;
      this.quiz.questions[s]['4'] = (document.getElementById(String(index) + '4') as HTMLInputElement).value;
      this.quiz.questions[s]['correcta'] = (document.getElementById(String(index) + 'correcta') as HTMLSelectElement).value;
    }
    console.log(this.quiz);
    this.dialogRef.close({ 'name': (document.getElementById('name') as HTMLInputElement).value, 'payload': this.quiz.questions });
  }


}

// =================================================================================================
// COMPONENT confirm-dialog
// =================================================================================================

@Component({
  selector: 'confirm-dialog',
  templateUrl: 'confirm-dialog.html',
  styleUrls: ['confirm-dialog.css']
})
export class ConfirmDialog implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<NewTemaDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    if (this.data["data"] != undefined) {
      // this.user = this.data["usr"];
      console.log(this.data['data']);
    }
  }


  ngOnInit() {

  }

  confirmed() {
    this.dialogRef.close('deleteLectura');
  }

  cancel() {
    this.dialogRef.close();
  }

}

