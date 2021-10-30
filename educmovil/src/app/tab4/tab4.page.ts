import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { Router, ActivatedRoute, Route } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  public title;
  public desc;
  public temas = [];
  public id;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private auth: AuthService) { }

  ngOnInit() {
    this.title = this.activatedRoute.snapshot.paramMap.get('id');
    this.desc = this.activatedRoute.snapshot.paramMap.get('desc');
    this.id  = this.activatedRoute.snapshot.paramMap.get('temas');
    
    let sub = this.auth.listCategories().subscribe(result =>{
      this.temas = []
      for(let s in result)
      {
        if(result[s]['id'] == this.id)
        {
          for(let i in result[s]['temas'])
          {
            this.temas.push(result[s]['temas'][i])
          }
          
        }
      }
      console.log(this.temas);
    })
  }

  changeTab(nombre)
  {
    this.router.navigate(['dash/tabs/tab5', { id: this.id, name: nombre }]);
  }

  goback(){
    this.router.navigate(['dash/tabs/tab2'])
  }
  

}
