import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  Notifications = [];
  constructor(private auth: AuthService) 
  {
    let sub = this.auth.listNots().subscribe(result =>{
      this.Notifications = []
      for(let s in result)
      {
        this.Notifications.push({desc: result[s]['desc'], cat: result[s]['cat']})
      }
      console.log(this.Notifications);
    })
  }

}
