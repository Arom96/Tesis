import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import {FormBuilder, FormControl,FormGroup, Validators,FormArray} from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogData, NewCategoryDialog } from '../categories/categories.component';
import { NewLecturaDialog, NewPruebaDialog, NewTemaDialog, ViewPruebaDialog } from '../courses/courses.component';
import { Upload } from '../login/login.component';
import { AuthServiceService } from '../Services/auth-service.service';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {FlatTreeControl} from '@angular/cdk/tree';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';

interface FoodNode {
  name: string;
  cover?: string;
  number?: number;
  children?: FoodNode[];
}



/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public TREE_DATA: FoodNode[] = [
    {
      name: 'Fruit',
      cover: '',
      children: [
        {name: 'Apple'},
        {name: 'Banana'},
        {name: 'Fruit loops'},
      ]
    }, {
      name: 'Vegetables',
      children: [
        {
          name: 'Green',
          children: [
            {name: 'Broccoli'},
            {name: 'Brussels sprouts'},
          ]
        }, {
          name: 'Orange',
          children: [
            {name: 'Pumpkins'},
            {name: 'Carrots'},
          ]
        },
      ]
    },
  ];

  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      number: node.number,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
      node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  selecedCat = '';
  Categories = [];
  selectedTema;
  selectedID = '';
  tema;
  userName;
  usrImg;
  constructor(private auth: AuthServiceService,public dialog: MatDialog, private snack: MatSnackBar, private Appc: AppComponent, private router: Router) {
    this.dataSource.data = this.TREE_DATA;
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  ngOnInit(): void {
    this.userName = this.Appc.User.name;
    this.usrImg = this.Appc.usrImg;
    let sub = this.auth.listCats().subscribe(result =>{
    this.Categories = result;      
    console.log(this.Categories);
    this.TREE_DATA = []
    for(let s in this.Categories)
    {
      let children = []
      for(let j in this.Categories[s].temas)
      {
        children.push({name: this.Categories[s].temas[j].nombre})
      }
      if(children === [])
      {
        children = [{name: ''}]
      }
      this.TREE_DATA.push({name: this.Categories[s].name, cover: this.Categories[s].cover, number: this.Categories[s].temas.length , children: children})
    }
    this.dataSource.data = this.TREE_DATA;
    console.log(this.TREE_DATA)
  })
  }

  showData(name){
    for(let s in this.Categories)
    {
      for(let f in this.Categories[s].temas)
      {
        if(this.Categories[s].temas[f].nombre == name)
        {
          console.log(this.Categories[s].temas[f]);
          this.selectedTema = this.Categories[s].temas[f];
          this.tema = this.Categories[s]
          console.log(this.tema)
          this.selecedCat = this.Categories[s]
          this.selectedID = this.Categories[s].id;
        }
      }
    }
  }
  
  showSelected(name){
    for(let s in this.Categories)
    {
      if(this.Categories[s].name == name)
      {
        this.selecedCat = this.Categories[s]
      }     
    }
  }
  openCreateTema(){
    if(this.selecedCat !='')
    {
      console.log(this.selecedCat)
      const dialogRef = this.dialog.open(NewTemaDialog, {
        width: '300px',
        data: {data: this.selecedCat, process: 'new'}
      });

      dialogRef.afterClosed().subscribe(result =>{
        console.log(result);
        if(result != undefined){
          this.createTema(result);
          this.snack.open('Tema creado con exito', '', {duration: 2000})
        }
      })
    }
    else{this.snack.open('Debe seleccionar un tema antes!.', '', {duration: 2500})}
    
  }

  deleteLectura(task, tema)
  {

    console.log(this.selectedTema, this.selecedCat, tema)
    let Tid = this.selecedCat['temas'].indexOf(tema);
    let lecturaID = tema.lecturas.indexOf(task);
    this.selecedCat['temas'][Tid]['lecturas'].splice(lecturaID, 1);
    this.auth.updateTema(this.selectedID, this.selecedCat['temas']);

  }

  deletePrueba(task, tema)
  {
    let Tid = this.selecedCat['temas'].indexOf(tema);
    let lecturaID = tema.pruebas.indexOf(task);
    this.selecedCat['temas'][Tid]['pruebas'].splice(lecturaID, 1);
    this.auth.updateTema(this.selectedID, this.selecedCat['temas']);

  }

  openCreateLectura(padre){
    const dialogRef = this.dialog.open(NewLecturaDialog, {
      width: '300px',
      data: {data: '', process: 'new'}
    });

    dialogRef.afterClosed().subscribe(result =>{
      if(result != undefined){
        console.log(result)
        this.createLectura(padre, result.name, result.file, result.desc, result.level);
        this.snack.open('Lectura creada con exito', '', {duration: 2000})
      }
    })
  }

  openViewPrueba(id){
    const dialogRef = this.dialog.open(ViewPruebaDialog, {
      width: '80vw',
      data: {data: id, process: 'new'}
    });

    dialogRef.afterClosed().subscribe(result =>{
      if(result != undefined){
        console.log(result)
        this.snack.open('Lectura creada con exito', '', {duration: 2000})
      }
    })
  }

  OpenEditLectura(padre, lecturas, index){
    console.log(padre, index)
    const dialogRef = this.dialog.open(NewLecturaDialog, {
      width: '300px',
      data: {data: padre, process: 'edit'}
    });

    dialogRef.afterClosed().subscribe(result =>{
      if(result != undefined){
        console.log(result)
        this.editLectura(lecturas, result.name, result.file, result.desc, result.level, index);
        this.snack.open('Lectura editada con exito', '', {duration: 2000})
      }
    })
  }

  openCreatePrueba(padre){
    const dialogRef = this.dialog.open(NewPruebaDialog, {
      width: '100vw',
      data: {data: '', process: 'new'}
    });

    dialogRef.afterClosed().subscribe(result =>{
      if(result != undefined){
        console.log(result)
        this.createPrueba(padre, result.name, result.payload)
        this.snack.open('Prueba agregada con exito', '', {duration: 2000})
      }
    })
  } 

  showCatDetails(category){
    for(let s in this.Categories)
    {
      if(category.name != this.Categories[s].name)
      {
        document.getElementById(this.Categories[s].name).style.border="2px transparent";
        document.getElementById(this.Categories[s].name).style.borderRadius="15px";
      }
      else
      {
        document.getElementById(this.Categories[s].name).style.border="2px solid";
        document.getElementById(this.Categories[s].name).style.borderRadius="15px";
      }
      
    }

    console.log(category);
    this.selectedTema= [];
    this.selectedID = category.id;
    this.selecedCat = category;
    for(let s in category['temas'])
    {
      this.selectedTema.push(category['temas'][s]);
    }
    console.log(this.selectedTema);

  }

  goToLink(url: string){
    window.open(url, "_blank");
  } 

  //cambia la navegacion a login/register con parametros
  navigateWithParams(){
    this.router.navigate(['/home']);
  }

  createTema(name){
    console.log(this.selecedCat);
    let id = this.selecedCat['id'];
    let temas = this.selecedCat['temas']
    temas.push({'lecturas': [], 'pruebas':[], 'nombre': name})
    this.auth.pushNewTema(id, temas);
  }

  createLectura(padre, name, doc, desc, level){
    console.log(padre,  name, doc, desc, level)
    let id = this.selecedCat['id'];
    let temas = this.selecedCat['temas']
    console.log(temas);
    for(let s in temas)
    {
      if(temas[s].nombre == padre)
      {
        temas[s].lecturas.push({'doc': doc, 'nombre': name, 'level': level, 'desc': desc})
      }
      
    }
    console.log(temas, id);
    this.auth.pushNewTema(id, temas);
  }

  editLectura(padre, name, doc, desc, level, index){
    console.log(padre, name, doc, desc, level, index)
    let id = this.selectedID;
    let temas = this.selecedCat['temas']
    for(let s in temas)
    {
      if(temas[s].nombre == padre)
      {
        temas[s].lecturas[index] = {'doc': doc, 'nombre': name, 'level': level, 'desc': desc}
      }
      
    }
    this.auth.pushNewTema(id, temas);
  }

  createPrueba(padre, name, url){
    let id = this.selecedCat['id'];
    let temas = this.selecedCat['temas']
    for(let s in temas)
    {
      if(temas[s].nombre == padre)
      {
        temas[s].pruebas.push({'name': name, 'payload': url})
      }
      
    }
    console.log(temas);
    this.auth.pushNewTema(id, temas);
  }

  //-------Para mantener el acordeon en refresh
  trackByIdentity(index, item){
    return item.name; 
  }

  logOutUser(){
    this.Appc.logOutUser();
  }

  registerNewCategory(){
    const dialogRef = this.dialog.open(NewCategoryDialog, {
      width: '300px',
      data: {data: '', process: 'new'}
    });

    dialogRef.afterClosed().subscribe(result =>{
      if(result == 'created'){
        this.snack.open('Categoria creada con exito', '', {duration: 2000})
      }
    })
  }


}
