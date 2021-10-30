import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { AuthServiceService } from '../Services/auth-service.service';

@Component({
  selector: 'app-categorie-view',
  templateUrl: './categorie-view.component.html',
  styleUrls: ['./categorie-view.component.css']
})
export class CategorieViewComponent implements OnInit {
  catSelected;
  temasSelected;


  constructor(private authService: AuthServiceService, private snack: MatSnackBar, private AppComp: AppComponent, private dataRoute: ActivatedRoute, private route: Router) { }

  ngOnInit(): void {
    let sub = this.dataRoute
    .queryParams
    .subscribe(params => {
      let sub = this.authService.listCats().subscribe(result =>{
        for(let s in result){
          if(result[s].id == params.params)
          {
            this.catSelected = result[s];
            this.temasSelected = result[s]['temas'];    
            console.log(this.temasSelected)
          }
        }
      })
    });
  }
  
  goToLink(url: string){
    window.open(url, "_blank");
  } 


}
