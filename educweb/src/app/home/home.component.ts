import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { AuthServiceService } from '../Services/auth-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  categorias = []
  constructor(private auth: AuthServiceService, private router: Router, private App: AppComponent, private snack: MatSnackBar) { }

  ngOnInit(): void {
    let sub = this.auth.listCats().subscribe(result =>{
      this.categorias = result;
      this.categorias.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())); 
      // console.log('Categorias:', this.categorias);
    });
  }

  //cambia la navegacion a login/register con parametros
  navigateWithParams(param){
    this.delay(500).then(any =>{
      if(this.App.isLogged)
      {
        this.router.navigate(['/category'], { queryParams: { params: param } });
      }
      else
      {
        this.snack.open('Descarga nuestra aplicación móvil en Google Play para acceder al contenido', '', {duration: 3500})
      }
    })
   
    
  }

  async delay(ms: number) {
    await new Promise<void>(resolve => setTimeout(()=>resolve(), ms)).then(()=>console.log("delay ", ms));
  }

}
