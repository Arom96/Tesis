import { Component, OnInit, Inject } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { ConfirmDialog } from '../courses/courses.component';
import { AuthServiceService } from '../Services/auth-service.service';

export interface DialogData {
  uid?: string
  process?: string
}

export class Upload {
  $key: string;
  file: File;
  name: string;
  url: string;
  progess: number;
  createdAt: Date = new Date();

  constructor(file: File) {
    this.file = file;
  }
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  Categories = [];
  catDetailsSelected = 'initial';

  userName;
  usrImg;
  usrRole;
  usrUID;

  constructor(public dialog: MatDialog, private snack: MatSnackBar, private auth: AuthServiceService, private router: Router, private Appc: AppComponent) { }

  ngOnInit(): void {
    this.userName = this.Appc.User.name;
    this.usrImg = this.Appc.usrImg;
    this.usrRole = this.Appc.User.role;
    this.usrUID = this.Appc.User.uid;
    console.log(this.usrRole);

    let sub = this.auth.listCats().subscribe(result => {
      this.Categories = result;
      this.Categories.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
      console.log('Categorias:', this.Categories);
    });
  }

  registerNewCategory() {
    const dialogRef = this.dialog.open(NewCategoryDialog, {
      width: '300px',
      data: { data: this.usrUID, process: 'new' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'created') {
        this.snack.open('Categoría creada con éxito', '', { duration: 2000 })
      }
    })
  }

  logOutUser() {
    this.Appc.logOutUser();
  }

  editCategory(category) {
    let uid = this.usrUID;
    console.log(uid, category.uid)
    if (uid == category.uid) {
      const dialogRef = this.dialog.open(NewCategoryDialog, {
        width: '300px',
        data: { data: { name: category.name, desc: category.desc, cover: category.cover, id: category.id, uid: uid, catUID: category.uid }, process: 'edit' }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result == 'updated') {
          this.catDetailsSelected = 'initial';
          this.snack.open('Categoría actualizada con éxito', '', { duration: 2000 })

        }
      })
    }
    else {
      this.snack.open('No tiene permisos para editar esta categoría', '', { duration: 2000 });
    }

  }

  deleteConfirm(categoryID) {
    let uid = this.usrUID;
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '300px',
      data: { data: '', process: 'delete' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result == 'deleteLectura') {
        this.deleteCat(categoryID);
      }
    })
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

    this.catDetailsSelected = category;
  }

  deleteCat(id) {
    for (let s in this.Categories) {
      if (this.Categories[s]['id'] == id) {
        if (this.Categories[s]['uid'] == this.usrUID) {
          this.auth.deleteCategory(id);
          this.catDetailsSelected = 'initial';
        }
        else {
          this.snack.open('No tiene permisos para eliminar esta categoría', '', { duration: 2000 });
        }
      }
    }

  }
  //cambia la navegacion a login/register con parametros
  navigateWithParams() {
    this.router.navigate(['/home']);
  }

}

@Component({
  selector: 'newCat',
  templateUrl: 'newCat.html',
  styleUrls: ['newCat.css']
})
export class NewCategoryDialog implements OnInit {
  currentUpload;
  uploadLink = ''
  process;
  uid;
  CatUID;
  uploading = false;
  public NameInput = new FormControl();
  public DescriptInput = new FormControl();
  constructor(private storage: AngularFireStorage, private auth: AuthServiceService, public dialogRef: MatDialogRef<NewCategoryDialog>, private snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    if (this.data["data"] != undefined) {
      // this.user = this.data["usr"];
      console.log(this.data);
    }
    this.process = this.data.process;
    this.uid = this.data['data']['uid'];
    this.CatUID = this.data['data']['catUID'];
    console.log(this.uid, this.CatUID);
  }


  ngOnInit() {
    if (this.process == 'edit') {
      this.NameInput.setValue(this.data['data']['name']);
      this.DescriptInput.setValue(this.data['data']['desc']);
      this.uploadLink = this.data['data']['cover']
    }

  }

  detectFiles(event) {
    this.uploading = true;
    (document.getElementById("save") as HTMLButtonElement).disabled = true;
    let name = this.NameInput.value;
    name = name + Math.random().toString(36).replace(/[^a-z]+/g, '')
    let file = event.target.files[0];
    this.currentUpload = new Upload(file);
    this.storage.upload('/CategoryPics/' + name + '.png', this.currentUpload.file).then(response => {
      let url = this.storage.ref('/CategoryPics/' + name + '.png').getDownloadURL();
      url.subscribe(result => {
        this.uploading = false;
        (document.getElementById("save") as HTMLButtonElement).disabled = false;
        console.log(result);
        this.uploadLink = result;
      })
    });

  }

  createCat() {
    if (this.uploadLink != '' && this.NameInput.value.trim().length != 0) {
      let name = this.NameInput.value;
      let desc = this.DescriptInput.value;
      console.log(name);
      console.log(this.data['data'])
      let sub = this.auth.createCategory(name, desc, this.uploadLink, this.data['data']);
      let current_datetime = new Date();
      let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds() 
      this.auth.createNot('Nueva categoría "'+name+'" esta disponible', formatted_date)
      this.dialogRef.close('created');
    }
    else {
      this.snack.open('Debe seleccionar un cover/nombre.', '', { duration: 2000 })
    }

  }

  updateCat() {
    console.log(this.CatUID, this.uid)
    if (this.CatUID == this.uid) {
      let name = this.NameInput.value;
      let desc = this.DescriptInput.value;
      let id = this.data['data']['id'];
      let sub = this.auth.updateCategory(id, name, desc, this.uploadLink);
      this.dialogRef.close('updated');
    }
    else {
      this.snack.open('No tiene permisos para modificar esta categoría', '', { duration: 2000 })
    }

  }

}
