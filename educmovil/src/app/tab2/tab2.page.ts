import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

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
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  Categories = [];
  constructor(private auth: AuthService, private router: Router) 
  {
    let sub = this.auth.listCategories().subscribe(result =>{
      this.Categories = []
      for(let s in result)
      {
        this.Categories.push({name: result[s]['name'], desc: result[s]['desc'], cover: result[s]['cover'], temas: result[s]['id']})
      }
      console.log(this.Categories);
    })
  }

  changeTab(cat)
  {
    this.router.navigate(['dash/tabs/tab4', { id: cat.name, desc: cat.desc, temas: cat.temas }]);
  }

}
